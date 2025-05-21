using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.ContactTransactionDetails
{
    public class ContactTransactionDetailsRouter : CrudRouter<ContactTransactionDetail, DateTime, IContactTransactionDetailReader, IContactTransactionDetailWriter>
    {
        public override string RouteName => "contact-transaction-details";

        protected override Expression<Func<ContactTransactionDetail, DateTime>>? PagingField => contactTransactionDetail => contactTransactionDetail.Dated;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>();
    }
}
