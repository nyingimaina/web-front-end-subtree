using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.Security.RolePermissions;
using Jattac.Apps.CompanyMan.Security.Roles;
using Jattac.Apps.CompanyMan.Security.UserRoles;
using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.UserPermissions
{
    public interface IUserPermissionChecker
    {
        Task<bool> IsGranted(
            Guid userId,
            string permissionName
        );

        Task FailIfNotGranted(
            Guid userId,
            string permissionName
        );
    }
    public class UserPermissionChecker : IUserPermissionChecker
    {
        private readonly IDatabaseHelper<Guid> databaseHelper;

        public UserPermissionChecker(
            IDatabaseHelper<Guid> databaseHelper
        )
        {
            this.databaseHelper = databaseHelper;
        }


        public async Task FailIfNotGranted(
            Guid userId,
            string permissionName
        )
        {
            var isGranted = await IsGranted(
                userId: userId,
                permissionName: permissionName
            );

            if(isGranted == false)
            {
                throw new ClientVisibleInformationException($"User does not have permission '{permissionName}'");
            }
        }

        public async Task<bool> IsGranted(
            Guid userId,
            string permissionName
        )
        {
            using(var qBuilder = QBuilderExtensions.GetQBuilder())
            {
                qBuilder
                    .UseTableBoundSelector<PermissionRoleView>()
                    .Select(permissionRoleView => permissionRoleView.RolePermissionId)
                    .Then()
                    .UseTableBoundJoinBuilder<Role, PermissionRoleView>()
                    .InnerJoin(role => role.Id, permissionRoleView => permissionRoleView.RoleId)
                    .UseTableBoundJoinBuilder<UserRole, Role>()
                    .InnerJoin(userRole => userRole.RoleId, role => role.Id)
                    .UseTableBoundJoinBuilder<User, UserRole>()
                    .InnerJoin(user => user.Id, userRole => userRole.UserId)
                    .UseTableBoundFilter<User>()
                    .WhereEqualTo(user => user.Id, userId)
                    .And<PermissionRoleView>()
                    .WhereEqualTo(permissionRoleView => permissionRoleView.PermissionName, permissionName);

                var results = await qBuilder.GetManyAsync<PermissionRoleView>(databaseHelper);
                var hasGrantedResult = results.Any(a => a.IsGranted == true);
                return hasGrantedResult;
            }
        }
    }
}