using Jattac.Apps.CompanyMan.CompanyIncrementalNumbers;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.InvoiceLineItems;
using Jattac.Apps.CompanyMan.InvoiceRepetitionTemplates;
using Jattac.Apps.CompanyMan.Payments;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public interface IInvoiceWriter : IDatabaseWriterBase<Invoice>
    {
        Task<bool> UnpayAsync(Guid invoiceId);

        Task<ValidationResponse<Guid>> ToggleArchivalAsync(Guid invoiceId);

        Task<ValidationResponse<Guid>> MarkAsBadDebt(Guid invoiceId);

        Task<ValidationResponse<Guid>> WriteAsync(Invoice model, bool sendNotification);
    }

    public class InvoiceWriter : DatabaseWriterBase<Invoice>, IInvoiceWriter
    {
        private readonly IInvoiceReader invoiceReader;
        private readonly IInvoiceRepetitionTemplateWriter invoiceRepetitionTemplateWriter;
        private readonly IInvoiceLineItemWriter invoiceLineItemWriter;
        private readonly ICompanyIncrementalNumberProvider companyIncrementalNumberProvider;
        private readonly IPaymentWriter paymentWriter;
        private readonly IInvoiceSender invoiceSender;

        public InvoiceWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IInvoiceReader invoiceReader,
            IStandardHeaderReader headerReader,
            IInvoiceRepetitionTemplateWriter invoiceRepetitionTemplateWriter,
            IInvoiceLineItemWriter invoiceLineItemWriter,
            ICompanyIncrementalNumberProvider companyIncrementalNumberProvider,
            IPaymentWriter paymentWriter,
            IInvoiceSender invoiceSender)
             : base(databaseHelper, invoiceReader, headerReader)
        {
            this.invoiceReader = invoiceReader;
            this.invoiceRepetitionTemplateWriter = invoiceRepetitionTemplateWriter;
            this.invoiceLineItemWriter = invoiceLineItemWriter;
            this.companyIncrementalNumberProvider = companyIncrementalNumberProvider;
            this.paymentWriter = paymentWriter;
            this.invoiceSender = invoiceSender;
        }

        public async Task<ValidationResponse<Guid>> ToggleArchivalAsync(Guid invoiceId)
        {
            var invoice = await invoiceReader.GetSingleByIdAsync(invoiceId);
            if (invoice == null)
            {
                throw new Exception($"Could not find invoice with id {invoiceId} to delete.");
            }
            invoice.Deleted = !invoice.Deleted;
            return await base.UpsertAsync(invoice);
        }

        public async Task<ValidationResponse<Guid>> MarkAsBadDebt(Guid invoiceId)
        {
            var invoice = await invoiceReader.GetSingleByIdAsync(invoiceId);
            if (invoice == null)
            {
                throw new Exception($"Could not find invoice with id {invoiceId} to delete.");
            }
            invoice.BadDebt = true;
            return await base.UpsertAsync(invoice);
        }

        

        public async Task<ValidationResponse<Guid>> WriteAsync(Invoice model, bool sendNotification)
        {
            if (model.InvoiceType.Equals(InvoiceTypeNames.Customer, comparisonType: StringComparison.OrdinalIgnoreCase))
            {
                model.InvoiceNumber = (await companyIncrementalNumberProvider
                    .ConsumeLatestAvailableAsync(InvoiceConstants.IncrementalNumberKey))
                    .ToString();
            }
            model.Dated = model.Dated.ToSafeUniversal();
            var savedInvoiceResponse = await base.UpsertAsync(model);
            savedInvoiceResponse.FailReportClientVisibleMessagesIfAny();
            foreach (var specificLineItem in model.InvoiceLineItems)
            {
                specificLineItem.InvoiceId = model.Id;
                var savedLineItem = await invoiceLineItemWriter.UpsertAsync(specificLineItem);
                savedLineItem.FailReportClientVisibleMessagesIfAny();
            }
            if (model.InvoiceRepetitionTemplate.Day > 0)
            {
                model.InvoiceRepetitionTemplate.InvoiceId = model.Id;
                var repetitionTemplateSaved = await invoiceRepetitionTemplateWriter.UpsertAsync(model.InvoiceRepetitionTemplate);
                repetitionTemplateSaved.FailReportClientVisibleMessagesIfAny();
            }
            if(sendNotification && model.InvoiceType.Equals(InvoiceTypeNames.Customer, StringComparison.OrdinalIgnoreCase))
            {
                await invoiceSender.SendAsync(model.Id);
            }
            return savedInvoiceResponse;
        }


        [Obsolete($"Please use '{nameof(WriteAsync)}' instead.")]
        public override Task<ValidationResponse<Guid>> UpsertAsync(Invoice model)
        {
            throw new NotSupportedException($"Please use '{nameof(WriteAsync)}' instead.");
        }

        public async Task<bool> UnpayAsync(Guid invoiceId)
        {
            var invoice = await invoiceReader.GetSingleByIdAsync(invoiceId);
            if (invoice == null)
            {
                throw new Exception($"Could not find invoice with id {invoiceId} to unpay.");
            }
            return await paymentWriter.UnpayAsync(invoice.InvoiceLineItems.SelectMany(a => a.Payments).ToList());
        }
    }
}
