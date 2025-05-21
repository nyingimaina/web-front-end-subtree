using Jattac.Apps.CompanyMan.CompanyIncrementalNumbers;
using Jattac.Apps.CompanyMan.Settings;

namespace Jattac.Apps.CompanyMan.Invoices
{
    public interface IInvoiceIncrementalNumberSettingsHandler : ISettingsHandler
    {

    }
    public class InvoiceIncrementalNumberSettingsHandler : IInvoiceIncrementalNumberSettingsHandler
    {
        private readonly ICompanyIncrementalNumberReader companyIncrementalNumberReader;
        private readonly ICompanyIncrementalNumberWriter companyIncrementalNumberWriter;

        public InvoiceIncrementalNumberSettingsHandler(
            ICompanyIncrementalNumberReader companyIncrementalNumberReader,
            ICompanyIncrementalNumberWriter companyIncrementalNumberWriter
        )
        {
            this.companyIncrementalNumberReader = companyIncrementalNumberReader;
            this.companyIncrementalNumberWriter = companyIncrementalNumberWriter;
        }

        public string Name => "InvoiceIncrementalNumber";

        public async Task<List<Setting>> GetSettingsAsync()
        {
            var invoiceNumber = await companyIncrementalNumberReader.GetAsync(InvoiceConstants.IncrementalNumberKey);
            return new List<Setting>()
            {
                new Setting()
                {
                    Id = invoiceNumber.Id,
                    Key = InvoiceConstants.IncrementalNumberKey,
                    Value = (invoiceNumber.LatestValue + 1).ToString()
                }
            };
        }

        public Task<IEnumerable<Setting>> GetSettingsByKeysAsync(IEnumerable<string> keys)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SetSettingsAsync(List<Setting> settings)
        {
            var invoiceNumberSetting = settings.SingleOrDefault(setting => setting.Key == InvoiceConstants.IncrementalNumberKey);
            if (invoiceNumberSetting == null)
            {
                return false;
            }
            var invoiceNumber = await companyIncrementalNumberReader.GetAsync(InvoiceConstants.IncrementalNumberKey);
            invoiceNumber.LatestValue = Convert.ToInt32(invoiceNumberSetting.Value) - 1;
            var result = await companyIncrementalNumberWriter.UpsertAsync(invoiceNumber);
            result.FailReportClientVisibleMessagesIfAny();
            return true;
        }
    }
}