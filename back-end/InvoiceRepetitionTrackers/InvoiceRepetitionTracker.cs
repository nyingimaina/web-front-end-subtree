using Dapper.Contrib.Extensions;
using Jattac.Apps.CompanyMan.Invoices;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTrackers
{
    public class InvoiceRepetitionTracker : UserModel
    {
        public Guid InvoiceRepetitionTemplateId { get; set; }
        public Guid InvoiceId { get; set; }

        public DateTime GeneratedDateTime { get; set; }

        public bool Sent { get; set; }

        public DateTime ScheduleSendDateTime { get; set; }

        [Computed]
        public Invoice Invoice { get; set; } = new Invoice();

        [Computed]
        public DateTime NextScheduledDate { get; set; }
        




        
    }
}