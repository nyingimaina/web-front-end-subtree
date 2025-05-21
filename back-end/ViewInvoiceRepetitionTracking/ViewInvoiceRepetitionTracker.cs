using Jattac.Apps.CompanyMan.Invoices;

namespace Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking
{
    public class ViewInvoiceRepetitionTracker : Invoice
    {
        public DateTime NextScheduledDate { get; set; }

        public Guid InvoiceRepetitionTemplateId { get; set; }

        public Guid InvoiceRepetitionTrackerId { get; set; }

        public string TimezoneCode { get; set; } = string.Empty;
        public Guid InvoiceId { get; internal set; }

        public string LastInvoiceNumberPadded
        {
            get
            {
                return GetPaddedInvoiceNumber(LastInvoiceNumber);
            }
        }

        public string LastInvoiceNumber { get; set; } = string.Empty;

        public DateTime LastInvoiceDate { get; set; }
    }
}