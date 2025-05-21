using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Invoices;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Payments
{
    public interface IPaymentWriter : IDatabaseWriterBase<Payment>
    {
        Task<bool> PayAsync(List<Payment> payments);

        Task<bool> UnpayAsync(List<Payment> payments);
    }

    public class PaymentWriter : DatabaseWriterBase<Payment>, IPaymentWriter
    {
        private readonly IDatabaseHelper<Guid> databaseHelper;
        private readonly IInvoiceReader invoiceReader;
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        public PaymentWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IPaymentReader paymentReader,
            IStandardHeaderReader headerReader,
            IInvoiceReader invoiceReader)
            : base(databaseHelper, paymentReader, headerReader)
        {
            this.databaseHelper = databaseHelper;
            this.invoiceReader = invoiceReader;
        }


        public override Task<ValidationResponse<Guid>> InsertAsync(Payment model)
        {
            throw new NotSupportedException();
        }

        public override Task<ValidationResponse<Guid>> UpdateAsync(Payment model)
        {
            throw new NotSupportedException();
        }

        public override Task<ValidationResponse<Guid>> UpsertAsync(Payment model)
        {
            throw new NotSupportedException();
        }

        public async Task<bool> PayAsync(List<Payment> payments)
        {
            try
            {
                await semaphoreSlim.WaitAsync();

                var invoice = await invoiceReader.GetByInvoiceLineItemId(
                    invoiceLineItemId: payments[0].InvoiceLineItemId
                );
                if (invoice == null)
                {
                    throw new Exception($"Could not find invoice for invoice line item id {payments[0].InvoiceLineItemId}");
                }

                var totalPayment = payments.Sum(payment => payment.Amount);
                if (totalPayment > invoice.Balance)
                {
                    throw new Exception($"Payment amount {totalPayment} is greater than invoice balance {invoice.Balance}");
                }
                foreach (var specificPayment in payments)
                {
                    specificPayment.Dated = specificPayment.Dated.ToSafeUniversal();
                    var paymentResponse = await base.UpsertAsync(specificPayment);
                    paymentResponse.FailReportClientVisibleMessagesIfAny();
                }

                return true;
            }
            finally
            {
                semaphoreSlim.Release();
            }
        }

        public async Task<bool> UnpayAsync(List<Payment> payments)
        {
            try
            {
                await semaphoreSlim.WaitAsync();
                foreach (var specificPayment in payments)
                {
                    var parameterName = specificPayment.DbParamName(a => a.Id);
                    var deletionQuery = $"Delete From {nameof(Payment)} Where {nameof(Payment.Id)} = {parameterName}";
                    await databaseHelper.ExecuteAsync(deletionQuery, specificPayment);
                }

                return true;
            }
            finally
            {
                semaphoreSlim.Release();
            }
        }
    }
}
