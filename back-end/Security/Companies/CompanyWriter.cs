using Jattac.Apps.CompanyMan.ApiKeys;
using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Security.CompanyTypes;
using Jattac.Apps.CompanyMan.Setup;
using Rocket.Libraries.DatabaseIntegrator;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public interface ICompanyWriter : IDatabaseWriterBase<Company>, ISetupService
    {
        Task<Company> CreateBackOfficeAsync();

        Task<Company> RotateApiKeyAsync(Guid companyId);
    }
    public class CompanyWriter : DatabaseWriterBase<Company>, ICompanyWriter
    {
        private readonly ICompanyReader companyReader;
        private readonly IApiKeyManager apiKeyManager;

        public CompanyWriter(
            IDatabaseHelper<Guid> databaseHelper,
            ICompanyReader companyReader,
            IStandardHeaderReader headerReader,
            IApiKeyManager apiKeyManager)
             : base(databaseHelper, companyReader, headerReader)
        {
            this.companyReader = companyReader;
            this.apiKeyManager = apiKeyManager;
        }


        public async Task<Company> CreateBackOfficeAsync()
        {
            var company = await companyReader.GetByNameAsync(
                name: CompanyTypeNames.BackOffice
            );
            if (company != null)
            {
                return company;
            }

            company = new Company
            {
                Name = CompanyTypeNames.BackOffice,
                CompanyType = CompanyTypeNames.BackOffice,
            };
            var saveResult = await UpsertAsync(company);

            if (saveResult.HasErrors)
            {
                throw new ClientVisibleInformationException(
                    message: saveResult.ValidationErrors.First().Errors.First()
                );
            }
            company.Id = saveResult.Entity;
            return company;
        }

        public async Task ExecuteAsync()
        {
            await CreateBackOfficeAsync();
        }

        public override Task<ValidationResponse<Guid>> UpsertAsync(Company model)
        {
            if (model.Id == default)
            {
                model.ApiKey = apiKeyManager.GenerateApiKey();
            }
            return base.UpsertAsync(model);
        }

        public async Task<Company> RotateApiKeyAsync(Guid companyId)
        {
            var company = await companyReader.GetByIdAsync(id: companyId, showDeleted: true);
            company.ApiKey = apiKeyManager.GenerateApiKey();
            await UpsertAsync(company);
            return company;
        }
    }
}