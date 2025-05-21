using System.Collections.Immutable;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.Companies;
using Jattac.Apps.CompanyMan.Security.Permissions;
using Jattac.Apps.CompanyMan.Security.RolePermissions;
using Jattac.Apps.CompanyMan.Security.UserRoles;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.Qurious;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public interface IUserReader : IDatabaseReaderBase<User>
    {
        Task<User?> GetByEmailAsync(
            string email,
            bool preservePassword
        );

        Task<ImmutableList<User>> GetByCompanyIdAsync(
            Guid companyId,
            bool preservePassword
        );

        Task<ImmutableList<User>> GetWithPermissionAsync(
            string permissionName,
            bool preservePassword
        );

        Task<User?> GetApiUserAsync(Guid companyId, bool preservePassword);
    }
    public class UserReader : DatabaseReaderBase<User>, IUserReader
    {
        private readonly IUserRoleReader userRoleReader;
        private readonly IHeaderReader headerReader;

        public UserReader(
            IDatabaseHelper<Guid> databaseHelper,
            IUserRoleReader userRoleReader,
            IHeaderReader headerReader)
             : base(databaseHelper)
        {
            this.userRoleReader = userRoleReader;
            this.headerReader = headerReader;
        }


        
        public async Task<User?> GetByEmailAsync(
            string email,
            bool preservePassword
        )
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                CommonSelectAndJoin(qBuilder)
                    .UseTableBoundFilter<User>()
                    .WhereEqualTo(user => user.Email, email)
                    .Then()
                    .HandleDeletedRecords<User>(
                        showDeleted: false
                    );

                var result = await qBuilder.GetSingleAsync<User>(DatabaseHelper);
                if (result != null)
                {
                    await EnrichAsync(new List<User> { result }, preservePassword: preservePassword);
                }
                return result;
            }
        }

        public async Task<User?> GetApiUserAsync(Guid companyId, bool preservePassword)
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                CommonSelectAndJoin(qBuilder)
                    .UseTableBoundFilter<User>()
                    .WhereEqualTo(user => user.CompanyId, companyId)
                    .And<User>()
                    .WhereEqualTo(user => user.Email, User.ApiUserName)
                    .Then()
                    .HandleDeletedRecords<User>(
                        showDeleted: false
                    );

                var result = await qBuilder.GetSingleAsync<User>(DatabaseHelper);
                if (result != null)
                {
                    await EnrichAsync(new List<User> { result }, preservePassword);
                }
                return result;
            }
        }


        public async Task<ImmutableList<User>> GetByCompanyIdAsync(
            Guid companyId, 
            bool preservePassword
        )
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                CommonSelectAndJoin(qBuilder)
                    .UseTableBoundFilter<User>()
                    .WhereEqualTo(user => user.CompanyId, companyId)
                    .Then()
                    .HandleDeletedRecords<User>(
                        showDeleted: true
                    );

                var result = await qBuilder.GetManyAsync<User>(DatabaseHelper);
                await EnrichAsync(result, preservePassword: preservePassword);
                return result;
            }
        }


        private async Task  EnrichAsync(IEnumerable<User> users, bool preservePassword)
        {
            var userIds = users.Select(u => u.Id).ToList();
            var userRoles = await userRoleReader.GetUserRolesAsync(
                userIds
            );

            foreach (var specificUser in users)
            {
                specificUser.Password = preservePassword ? specificUser.Password : string.Empty;
                specificUser.UserRoleIds = userRoles.Where
                    (a => a.UserId == specificUser.Id)
                    .Select(a => a.RoleId)
                    .ToHashSet();
                specificUser.UserRoleNames = userRoles
                    .Where(a => a.UserId == specificUser.Id)
                    .Select(a => a.RoleName)
                    .ToHashSet();
                
            }
        }

        public async Task<ImmutableList<User>> GetWithPermissionAsync(
            string permissionName,
            bool preservePassword
        )
        {
            using (var qBuilder = new QBuilder(parameterize: true))
            {
                CommonSelectAndJoin(qBuilder)
                    .UseTableBoundJoinBuilder<UserRole, User>()
                    .InnerJoin(userRole => userRole.UserId, user => user.Id)
                    .UseTableBoundJoinBuilder<RolePermission, UserRole>()
                    .InnerJoin(rolePermission => rolePermission.RoleId, userRole => userRole.RoleId)
                    .UseTableBoundJoinBuilder<Permission, RolePermission>()
                    .InnerJoin(permission => permission.Id, rolePermission => rolePermission.PermissionId)
                    .UseTableBoundFilter<Permission>()
                    .WhereEqualTo(permission => permission.Name, permissionName)
                    .And<User>()
                    .WhereEqualTo(user => user.CompanyId, headerReader.GetHeaderValue(headerName: HeaderNames.CompanyId));

                var users = await qBuilder
                    .GetManyAsync<User>(databaseHelper: DatabaseHelper);

                await EnrichAsync(users, preservePassword);
                return users;
            }
        }

        private QBuilder CommonSelectAndJoin(
            QBuilder qBuilder
        )
        {
            qBuilder
                .UseTableBoundSelector<User>()
                .Select(user => user.Password)
                .Select(user => user.Email)
                .Select(user => user.Id)
                .Select(user => user.Deleted)
                .Then()
                .UseTableBoundSelector<Company>()
                .Select(company => company.Name, nameof(User.CompanyDisplayLabel))
                .Select(company => company.CompanyType, nameof(User.CompanyType))
                .Select(company => company.Id, nameof(User.CompanyId))
                .Then()
                .UseTableBoundJoinBuilder<Company, User>()
                .InnerJoin(company => company.Id, user => user.CompanyId);
            return qBuilder;
        }
    }
}