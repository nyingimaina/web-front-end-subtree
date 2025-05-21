using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.Routing;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public class RolePermissionRouter : CrudRouter<RolePermission, DateTime, IRolePermissionReader, IRolePermissionWriter>
    {
        
        public override string RouteName => "RolePermissions";

        protected override Expression<Func<RolePermission, DateTime>>? PagingField => rolePermission => rolePermission.Modified;

        protected override Action<QBuilder, string> SearchOnBeforeQuery => (_, __) => { };

        protected override HashSet<RouteDescription> CustomEndpoints => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint: "get-by-company-id",
                httpMethod: HttpMethod.Get,
                handler: async (IRolePermissionReader reader, Guid companyId) =>
                {
                    return await reader.GetManyByCompanyIdAsync(companyId);
                }
            ),
            new RouteDescription(
                endpoint: "deny-permission",
                httpMethod: HttpMethod.Post,
                handler: async (IRolePermissionWriter writer, RolePermission rolePermission) =>
                {
                    return await writer.DenyPermissionAsync(rolePermission);
                }
            ),
            new RouteDescription(
                endpoint: "grant-permission",
                httpMethod: HttpMethod.Post,
                handler: async (IRolePermissionWriter writer, RolePermission rolePermission) =>
                {
                    return await writer.UpsertAsync(rolePermission);
                }
            ),
        };
    }
}