using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.Security.Permissions;
using Jattac.Apps.CompanyMan.Security.Roles;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public interface  IRolePermissionReader :  IDatabaseReaderBase<RolePermission>
    {
        Task<ImmutableList<PermissionRoleView>> GetManyByCompanyIdAsync(
           Guid companyId
       );
    }
    public class RolePermissionReader : DatabaseReaderBase<RolePermission>, IRolePermissionReader
    {
        public RolePermissionReader(
            IDatabaseHelper<Guid> databaseHelper,
            IPermissionReader permissionReader,
            IRoleReader roleReader)
         : base(databaseHelper)
        {
        }


        

        public async Task<ImmutableList<PermissionRoleView>> GetManyByCompanyIdAsync(
            Guid companyId
        )
        {
            using(var qBuilder = QBuilderExtensions.GetQBuilder())
            {
                qBuilder
                    .UseSelector()
                    .Select<PermissionRoleView>("*")
                    .Then()
                    .UseTableBoundFilter<PermissionRoleView>()
                    .WhereEqualTo(permissionRoleView => permissionRoleView.CompanyId, companyId)
                    .Or<PermissionRoleView>()
                    .WhereExplicitly($"{nameof(PermissionRoleView.CompanyId)} IS NULL");

                var results = await qBuilder.GetManyAsync<PermissionRoleView>(DatabaseHelper);
                var nonRootPermissions = results
                    .Where(a => new[] { RoleNames.Admin, RoleNames.Root }.Contains(a.RoleName) == false)
                    .ToImmutableList();
                return nonRootPermissions;
                    
            }
        }
    }
}