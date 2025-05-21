using Jattac.Apps.CompanyMan.Invoices;
using Jattac.Apps.CompanyMan.KeyValueSettings;
using Jattac.Apps.CompanyMan.Security.Companies;

namespace Jattac.Apps.CompanyMan.Settings
{
    public interface ISettingsMarshler
    {
        Task<List<Setting>> GetSettings();
        Task<bool> SetSettings(List<Setting> settings);

        Task<List<Setting>> GetSettingsByOwnerAndKeys(string owner, IEnumerable<string> keys);
    }
    public class SettingsMarshler : ISettingsMarshler
    {
        private HashSet<ISettingsHandler> settingsHandlers;
        public SettingsMarshler(
            ICompanySettingsHandler companySettingsHandler,
            IInvoiceIncrementalNumberSettingsHandler invoiceIncrementalNumberSettingsHandler,
            IKeyValueSettingsHandler keyValueSettingsHandler
        )
        {
            settingsHandlers = new HashSet<ISettingsHandler>
            {
                companySettingsHandler,
                invoiceIncrementalNumberSettingsHandler,
                keyValueSettingsHandler
            };
        }

        public async Task<List<Setting>> GetSettings()
        {
            var settings = new List<Setting>();
            foreach (var settingsHandler in settingsHandlers)
            {
                var handlerSettings = await settingsHandler.GetSettingsAsync();
                handlerSettings.ForEach(a => a.Owner = settingsHandler.Name);
                settings.AddRange(handlerSettings);
            }
            return settings;
        }

        public async Task<bool> SetSettings(List<Setting> settings)
        {
            foreach (var settingsHandler in settingsHandlers)
            {
                var handlerSettings = settings.Where(setting => setting.Owner == settingsHandler.Name).ToList();
                if (await settingsHandler.SetSettingsAsync(handlerSettings) == false)
                {
                    throw new Exception($"Failed to set settings for {settingsHandler.Name}");
                }
            }
            return true;
        }

        public async Task<List<Setting>> GetSettingsByOwnerAndKeys(string owner, IEnumerable<string> keys)
        {
            var settingHandler = settingsHandlers.SingleOrDefault(a => a.Name == owner);
            if (settingHandler == null)
            {
                throw new Exception($"Could not find settings handler for '{owner}'");
            }
            var handlerSettings = await settingHandler.GetSettingsByKeysAsync(keys);
            return handlerSettings.ToList();
        }
    }
}