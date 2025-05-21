using Jattac.Apps.CompanyMan.Security.UserRoles;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public interface IUserRolesHandler
    {
        Task SetUserRolesAsync(User user);
    }
    public class UserRolesHandler : IUserRolesHandler
    {
        private readonly IUserRoleWriter userRoleWriter;
        private readonly IDatabaseHelper<Guid> databaseHelper;

        public UserRolesHandler(            
            IUserRoleWriter userRoleWriter,
            IDatabaseHelper<Guid> databaseHelper
        )
        {
            this.userRoleWriter = userRoleWriter;
            this.databaseHelper = databaseHelper;
        }

        public async Task SetUserRolesAsync(User user)
        {
            await HardDeleteUserRolesAsync(user.Id);
            foreach (var specificUserRoleId in user.UserRoleIds)
            {
                var userRole = new UserRole
                {
                    UserId = user.Id,
                    RoleId = specificUserRoleId,
                };
                var userRoleSaveResponse = await userRoleWriter.UpsertAsync(userRole);
                userRoleSaveResponse.FailReportClientVisibleMessagesIfAny();
            }
        }

        private async Task HardDeleteUserRolesAsync(Guid userId)
        {
            var query = $"Delete from {nameof(UserRole)} where {nameof(UserRole.UserId)} = @UserId";
            await databaseHelper.ExecuteAsync(query, new { UserId = userId });

        }
    }
}