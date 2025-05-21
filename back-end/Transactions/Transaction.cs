namespace Jattac.Apps.CompanyMan.Transactions
{
    public class Transaction
    {
        public string Description { get; set; } = string.Empty;

        public Guid ContactId { get; set; }

        public decimal InvoiceAmount { get; set; }

        public decimal PaymentAmount { get; set; }

        public  DateTime Dated {get; set;}
    }
}