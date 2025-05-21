namespace Jattac.Apps.CompanyMan.ContactTransactionDetails
{
    public class ContactTransactionDetail : CompanyModel
    {
        public Guid ContactId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string InvoiceType { get; set; } = string.Empty;
        public Guid BillableItemId { get; set; }
        public string BillableItemLabel { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal AmountBilled { get; set; }
        public Guid? PaymentId { get; set; }
        public decimal? PaymentAmount { get; set; }
        public bool IsPaid => PaymentAmount.HasValue;
        public DateTime? PaymentDate { get; set; }
        public decimal RemainingAmount { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime Dated { get; set; }
    }

}