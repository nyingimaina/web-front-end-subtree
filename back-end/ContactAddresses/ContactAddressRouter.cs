using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.ContactAddresses
{
    public class ContactAddressesRouter : CrudRouter<ContactAddress, DateTime, IContactAddressReader, IContactAddressWriter>
    {
        

        public override string RouteName => "ContactAddresses";

        protected override Expression<Func<ContactAddress, DateTime>>? PagingField => contactAddress => contactAddress.Created;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>();
    }
}
