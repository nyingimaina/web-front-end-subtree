using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.Invoices;

namespace Jattac.Apps.CompanyMan.Payments
{
    public class Payment : UserModel
    {
        public Guid InvoiceLineItemId { get; set; }
        public decimal Amount { get; set; }

        public DateTime Dated { get; set; }

        [Computed]
        public string InvoiceNumberPadded => Invoice.GetPaddedInvoiceNumber(invoiceNumber: InvoiceNumber);

        [Computed]
        public string InvoiceNumber { get; set; } = string.Empty;
    }
}
