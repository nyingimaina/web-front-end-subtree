using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnitContacts
{
    public class PropManUnitContactRouter : CrudRouter<PropManUnitContact, DateTime, IPropManUnitContactReader, IPropManUnitContactWriter>
    {
        public override string RouteName => "prop-man-unit-contacts";

        protected override Expression<Func<PropManUnitContact, DateTime>>? PagingField => t => t.Modified;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-by-prop-man-unit-id",
                httpMethod: HttpMethod.Get,
                handler: async (IPropManUnitContactReader reader, Guid propManUnitId, int? page, ushort? pageSize) =>
                {
                    return await reader.GetBySinglePropManUnitIdAsync(propManUnitId, page, pageSize);
                }
            )
        };
    }
}