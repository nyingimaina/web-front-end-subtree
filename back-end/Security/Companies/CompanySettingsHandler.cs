using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Settings;

namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public interface ICompanySettingsHandler : ISettingsHandler
    {

    }
    public class CompanySettingsHandler : ICompanySettingsHandler
    {
        private readonly ICompanyReader companyReader;
        private readonly ICompanyWriter companyWriter;
        private readonly IStandardHeaderReader standardHeaderReader;
        private const string KeyCompanyName = "CompanyName";

        public CompanySettingsHandler(
            ICompanyReader companyReader,
            ICompanyWriter companyWriter,
            IStandardHeaderReader standardHeaderReader
        )
        {
            this.companyReader = companyReader;
            this.companyWriter = companyWriter;
            this.standardHeaderReader = standardHeaderReader;
        }

        public string Name => "Company";

        public async Task<List<Setting>> GetSettingsAsync()
        {
            var company = await companyReader.GetCurrentCompanyAsync();
            if (company == null)
            {
                throw new Exception("Could not find current company");
            }
            return new List<Setting>
            {
                new Setting
                {
                    Id = company.Id,
                    Key = KeyCompanyName,
                    Value = company.Name
                },
            };
        }

        public async Task<bool> SetSettingsAsync(List<Setting> settings)
        {
            var companySetting = settings.FirstOrDefault(setting => setting.Key == KeyCompanyName);
            if (companySetting == null)
            {
                return false;
            }
            if (companySetting.Id != standardHeaderReader.CompanyId)
            {
                throw new Exception($"Company id {companySetting.Id} does not match standard header company id {standardHeaderReader.CompanyId}");
            }
            var currentCompany = await companyReader.GetCurrentCompanyAsync();
            if (currentCompany == null)
            {
                throw new Exception("Could not find current company");
            }
            currentCompany.Name = companySetting.Value;
            var result = await companyWriter.UpsertAsync(currentCompany);
            result.FailReportClientVisibleMessagesIfAny();
            return true;
        }

        public Task<IEnumerable<Setting>> GetSettingsByKeysAsync(IEnumerable<string> keys)
        {
            throw new NotImplementedException();
        }
    }
}