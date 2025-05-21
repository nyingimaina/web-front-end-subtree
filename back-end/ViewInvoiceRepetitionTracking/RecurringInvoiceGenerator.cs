using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.InvoiceRepetitionTrackers;
using Jattac.Apps.CompanyMan.Invoices;

namespace Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking
{
    public interface IRecurringInvoiceGenerator
    {
        Task<bool> GenerateAsync();
    }

    
    public class RecurringInvoiceGenerator : IRecurringInvoiceGenerator
    {
        private readonly IViewInvoiceRepetitionTrackerReader viewInvoiceRepetitionTrackerReader;
        private readonly IInvoiceReader invoiceReader;
        private readonly IInvoiceWriter invoiceWriter;
        private readonly IInvoiceRepetitionTrackersWriter invoiceRepetitionTrackersWriter;
        private readonly IStandardHeaderOverrider standardHeaderOverrider;
        private static readonly SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);

        public RecurringInvoiceGenerator(
            IViewInvoiceRepetitionTrackerReader viewInvoiceRepetitionTrackerReader,
            IInvoiceReader invoiceReader,
            IInvoiceWriter invoiceWriter,
            IInvoiceRepetitionTrackersWriter invoiceRepetitionTrackersWriter,
            IStandardHeaderOverrider standardHeaderOverrider
        )
        {
            this.viewInvoiceRepetitionTrackerReader = viewInvoiceRepetitionTrackerReader;
            this.invoiceReader = invoiceReader;
            this.invoiceWriter = invoiceWriter;
            this.invoiceRepetitionTrackersWriter = invoiceRepetitionTrackersWriter;
            this.standardHeaderOverrider = standardHeaderOverrider;
        }

        public async Task<bool> GenerateAsync()
        {
            try
            {
                await semaphore.WaitAsync();
                
                var scheduled = await viewInvoiceRepetitionTrackerReader.GetDueForGenerationAsync();
                foreach (var specificScheduled in scheduled)
                {
                    var invoice = await invoiceReader.GetSingleByIdAsync(specificScheduled.InvoiceId);
                    if (invoice == null)
                    {
                        Program.ErrorLogger.Log(new Exception($"Invoice with ID {specificScheduled.InvoiceId} not found."));
                        continue;
                    }
                    
                    standardHeaderOverrider.SetCompanyId(invoice.CompanyId);
                    standardHeaderOverrider.SetUserId(invoice.UserId);

                    var eightAM = specificScheduled
                        .NextScheduledDate
                        .Date
                        .AddHours(8)
                        .GetUtcEquivalent(
                            timezoneCode: specificScheduled.TimezoneCode);
                    invoice.Id = default;
                    invoice.Dated = eightAM;
                    if (invoice.InvoiceType == InvoiceTypeNames.Supplier)
                    {
                        invoice.InvoiceNumber = $"{invoice.InvoiceNumber} - {eightAM.ToString("dd-MMM-yyyy")}";
                    }
                    var saveResponse = await invoiceWriter.WriteAsync(invoice, sendNotification: false);
                    saveResponse.FailReportClientVisibleMessagesIfAny();


                    var invoiceRepetitionTracker = new InvoiceRepetitionTracker
                    {
                        InvoiceId = invoice.Id,
                        InvoiceRepetitionTemplateId = specificScheduled.InvoiceRepetitionTemplateId,
                        GeneratedDateTime = DateTime.UtcNow,
                        ScheduleSendDateTime = invoice.InvoiceType == InvoiceTypeNames.Supplier
                            ? DateTime.MaxValue : eightAM,
                        Sent = false,
                    };

                    saveResponse = await invoiceRepetitionTrackersWriter.UpsertAsync(invoiceRepetitionTracker);
                    saveResponse.FailReportClientVisibleMessagesIfAny();
                }
                return true;
            }
            finally
            {
                semaphore.Release();
            }
        }
    }

    
}