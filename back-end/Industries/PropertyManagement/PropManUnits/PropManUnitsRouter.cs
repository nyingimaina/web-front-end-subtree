using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Industries.PropertyManagement.PropManUnits
{
    public class PropManUnitsRouter : CrudRouter<PropManUnit, string, IPropManUnitReader, IPropManUnitWriter>
    {
        public override string RouteName => "property-management-units";

        protected override Expression<Func<PropManUnit, string>>? PagingField => propMan => propMan.DisplayLabel;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "get-by-company-id",
                httpMethod: HttpMethod.Get,
                handler: async (IPropManUnitReader reader, Guid companyId, int? page, ushort? pageSize) =>
                {
                    return await reader.GetByCompanyIdAsync(
                        companyId: companyId,
                        page: page,
                        pageSize: pageSize
                    );
                }
            ),
            new RouteDescription(
                endpoint: "get-single-by-id",
                httpMethod: HttpMethod.Get,
                handler: async (IPropManUnitReader reader, Guid propManUnitId) =>
                {
                    return await reader.GetSingleByIdAsync(
                        id: propManUnitId
                    );
                })
        };
    }
}