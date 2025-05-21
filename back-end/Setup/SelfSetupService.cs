using Jattac.Apps.CompanyMan.Security.Companies;
using Jattac.Apps.CompanyMan.Security.CompanyTypes;
using Jattac.Apps.CompanyMan.Security.Permissions;
using Jattac.Apps.CompanyMan.Security.Roles;
using Jattac.Apps.CompanyMan.Security.Users;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.Setup
{
    public interface ISelfSetupService
    {
        Task SetupIfRequiredAsync();
    }
    public class SelfSetupService : ISelfSetupService
    {
        private readonly ICompanyReader companyReader;
        private readonly IDatabaseHelper<Guid> databaseHelper;
        private List<ISetupService> setupServices;
        public SelfSetupService(
            ICompanyReader companyReader,
            ICompanyWriter companyWriter,
            IUserCreator userCreator,
            IPermissionWriter permissionWriter,
            IRoleWriter roleWriter,
            IDatabaseHelper<Guid> databaseHelper
        )
        {
            this.companyReader = companyReader;
            this.databaseHelper = databaseHelper;
            setupServices = new List<ISetupService>
            {
                permissionWriter,
                roleWriter,
                companyWriter,
                userCreator
            };
        }

        public async Task SetupIfRequiredAsync()
        {
            var required = await CheckSetupRequiredAsync();
            if (required == false)
            {
                return;
            }
            await SetupAsync();
        }

        private async Task SetupAsync()
        {
            try
            {
                databaseHelper.BeginTransaction();
                foreach (var specificSetupService in setupServices)
                {
                    await specificSetupService.ExecuteAsync();
                }
                databaseHelper.CommitTransaction();
            }
            catch(Exception ex)
            {
                Program.ErrorLogger.Log(ex, "Could not self setup");
                databaseHelper.RollBackTransaction();
            }
        }

        private async Task<bool> CheckSetupRequiredAsync()
        {
            var backOfficeCompanies = await companyReader.GetByTypeAsync(
                companyType: CompanyTypeNames.BackOffice
            );
            return backOfficeCompanies == null || !backOfficeCompanies.Any();
        }
    }
}