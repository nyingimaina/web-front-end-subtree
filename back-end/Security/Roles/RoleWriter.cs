using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Setup;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Security.Roles
{

    public interface IRoleWriter : IDatabaseWriterBase<Role>, ISetupService
    {

    }
    public class RoleWriter : DatabaseWriterBase<Role> , IRoleWriter
    {
        public RoleWriter(
            IDatabaseHelper<Guid> databaseHelper, 
            IRoleReader reader,
            IStandardHeaderReader headerReader)
             : base(databaseHelper, reader,headerReader)
        {
        }

        public async Task ExecuteAsync()
        {
            var roles = new List<Role>
            {
                new Role
                {
                    RoleName = RoleNames.Manager,
                    RoleDisplayLabel = "Manager"
                },
                new Role
                {
                    RoleName = RoleNames.Admin,
                    RoleDisplayLabel = "Admin"
                },
                new Role
                {
                    RoleName = RoleNames.Root,
                    RoleDisplayLabel = "Root"
                },
                new Role
                {
                    RoleName = RoleNames.Accountant,
                    RoleDisplayLabel = "Accountant"
                },
                new Role
                {
                    RoleName = RoleNames.CustomerServiceAgent,
                    RoleDisplayLabel = "Customer Service Agent"
                }
            };

            foreach (var specificRole in roles)
            {
                var saveResponse = await UpsertAsync(specificRole);
                saveResponse.FailReportClientVisibleMessagesIfAny();
            }
        }
    }
}