namespace Jattac.Apps.CompanyMan.UnpaidInvoices
{
    public class UnpaidInvoice : UserModel
    {

        public Guid ContactId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime Dated { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string InvoiceType { get; set; } = string.Empty;
        public decimal TotalAmountDue { get; set; }
        public decimal TotalPaymentsMade { get; set; }
        public decimal RemainingAmount { get; set; }
        
        public bool BadDebt { get; set; } 
    }

}