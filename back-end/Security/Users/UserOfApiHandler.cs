using Jattac.Apps.CompanyMan.Security.Roles;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public interface IUserOfApiHandler
    {
        Task<User> GetByCompanyIdAsync(Guid companyId);
    }
    public class UserOfApiHandler : IUserOfApiHandler
    {
        private readonly IUserReader userReader;
        private readonly IUserCreator userCreator;
        private readonly IRoleReader roleReader;

        public UserOfApiHandler(
            IUserReader userReader,
            IUserCreator userCreator,
            IRoleReader roleReader
        )
        {
            this.userReader = userReader;
            this.userCreator = userCreator;
            this.roleReader = roleReader;
        }

        public async Task<User> GetByCompanyIdAsync(Guid companyId)
        {
            var user = await userReader.GetApiUserAsync(
                companyId: companyId,
                preservePassword: false);
            if (user == null)
            {
                var adminRole = await roleReader.GetByNameAsync(RoleNames.Admin);
                user = await userCreator.CreateUserAsync(new User
                {
                    Email = User.ApiUserName,
                    CompanyId = companyId,
                    Password = DateTime.Now.ToString(),
                    UserRoleIds = new HashSet<Guid> { adminRole!.Id },

                });
            }
            return user;
        }
    }
}