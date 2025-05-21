using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public interface IRolePermissionWriter : IDatabaseWriterBase<RolePermission>
    {
        Task<bool> DenyPermissionAsync(RolePermission rolePermission);
    }
    public class RolePermissionWriter : DatabaseWriterBase<RolePermission>, IRolePermissionWriter
    {
        private readonly IDatabaseHelper<Guid> databaseHelper;

        public RolePermissionWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IRolePermissionReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader,headerReader)
        {
            this.databaseHelper = databaseHelper;
        }


        public async Task<bool> DenyPermissionAsync(RolePermission rolePermission)
        {
            var query = $"Delete From {nameof(RolePermission)} where "
                + $"{nameof(RolePermission.CompanyId)} = @CompanyId"
                + $" And {nameof(RolePermission.PermissionId)} = @PermissionId"
                + $" And {nameof(RolePermission.RoleId)} = @RoleId";

            await databaseHelper.ExecuteAsync(query, rolePermission);
            return true;
        }

        

    }
}