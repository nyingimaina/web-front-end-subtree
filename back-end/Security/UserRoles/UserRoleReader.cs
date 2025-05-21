using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.Security.Roles;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.UserRoles
{
    public interface IUserRoleReader : IDatabaseReaderBase<UserRole>
    {
        Task<ImmutableList<UserRole>> GetUserRolesAsync(
            List<Guid> userIds
        );

        Task<UserRole?> GetByNameAsync(string name);
    }
    public class UserRoleReader : DatabaseReaderBase<UserRole>, IUserRoleReader
    {
        public UserRoleReader(
            IDatabaseHelper<Guid> databaseHelper)
             : base(databaseHelper)
        {
        }

        public async Task<ImmutableList<UserRole>> GetUserRolesAsync(
            List<Guid> userIds
        )
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<UserRole>("*")
                    .Then()
                    .UseTableBoundSelector<Role>()
                    .Select(role => role.RoleName, nameof(UserRole.RoleName))
                    .Then()
                    .UseTableBoundJoinBuilder<Role, UserRole>()
                    .InnerJoin(role => role.Id, userRole => userRole.RoleId)
                    .UseTableBoundFilter<UserRole>()
                    .WhereIn(userRole => userRole.UserId, userIds);

                return await qBuilder.GetManyAsync<UserRole>(DatabaseHelper);
            }
        }

        public async Task<UserRole?> GetByNameAsync(string name)
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                qBuilder
                    .UseSelector()
                    .Select<UserRole>("*")
                    .Then()
                    .UseTableBoundFilter<UserRole>()
                    .WhereEqualTo(userRole => userRole.RoleName, name);

                return await qBuilder.GetSingleAsync<UserRole>(DatabaseHelper);
            }
        }
    }
}