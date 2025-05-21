using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.InvoiceRepetitionTrackers
{
    public class InvoiceRepetitionTrackersRouter : CrudRouter<InvoiceRepetitionTracker, DateTime, IInvoiceRepetitionTrackersReader, IInvoiceRepetitionTrackersWriter>
    {
        public override string RouteName => "invoice-repetition-trackers";

        protected override Expression<Func<InvoiceRepetitionTracker, DateTime>>? PagingField => x => x.Modified;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_,__) => { };
    }
}