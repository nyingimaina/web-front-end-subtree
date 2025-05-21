using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.Security.Authentication;
using Jattac.Apps.CompanyMan.Security.Companies;
using Jattac.Apps.CompanyMan.Security.Roles;
using Jattac.Apps.CompanyMan.Setup;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public interface IUserCreator : ISetupService
    {
        Task<User> CreateRootUser(string password);

        Task<User> CreateUserAsync(User user);

    }
    public class UserCreator : IUserCreator
    {
        private readonly IDatabaseHelper<Guid> databaseHelper;
        private readonly IPasswordHelper passwordHelper;
        private readonly ICompanyReader companyReader;
        private readonly ICompanyWriter companyWriter;
        private readonly IRoleReader roleReader;
        private readonly IUserRolesHandler userRolesHandler;

        public UserCreator(
            IDatabaseHelper<Guid> databaseHelper,
            IPasswordHelper passwordHelper,
            ICompanyReader companyReader,
            ICompanyWriter companyWriter,
            IRoleReader roleReader,
            IUserRolesHandler userRolesHandler
        )
        {
            this.databaseHelper = databaseHelper;
            this.passwordHelper = passwordHelper;
            this.companyReader = companyReader;
            this.companyWriter = companyWriter;
            this.roleReader = roleReader;
            this.userRolesHandler = userRolesHandler;
        }

        public async Task<User> CreateRootUser(string password)
        {
            
            var backOfficeCompany = await companyWriter.CreateBackOfficeAsync();
            if(backOfficeCompany == null)
            {
                throw new ClientVisibleInformationException(
                    message: "Cannot create back office company"
                );
            }
            var rootUserRole = await roleReader.GetByNameAsync(name: RoleNames.Root);
            if(rootUserRole == null)
            {
                throw new ClientVisibleInformationException(
                    message: $"Could not find role '{RoleNames.Root}'"
                );
            }
            var user = new User
            {
                Password = password,
                Email = User.SuperAdminEmail,
                UserRoleIds = new HashSet<Guid>{ rootUserRole.Id },
                CompanyName = backOfficeCompany.Name,
            };
           return await CreateUserAsync(user);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            
            await SetCompanyIdIfRequiredAsync(user);
            user.Password = passwordHelper.HashPassword(
                password: user.Password
            );
            user.Id = Guid.NewGuid();
            await databaseHelper.SaveAsync(user, isUpdate: false);
            await userRolesHandler.SetUserRolesAsync(user);
            return user;
        }



        public async Task ExecuteAsync()
        {
            await CreateRootUser("pentium1.2");
        }

        

        private async Task SetCompanyIdIfRequiredAsync(
            User user
        )
        {
            if(user.CompanyId != default)
            {
                return;
            }

            var company = await companyReader.GetByNameAsync(
                name: user.CompanyName
            );
            if(company == null)
            {
                throw new ClientVisibleInformationException(
                    message: $"Could not find company called '{user.CompanyName}' to associated user to"
                );
            }

            user.CompanyId = company.Id;
        }
    }
}