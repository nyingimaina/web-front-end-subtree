
namespace Jattac.Apps.CompanyMan.Settings
{
    public interface ISettingsHandler
    {
        string Name { get; }

        Task<List<Setting>> GetSettingsAsync();
        Task<IEnumerable<Setting>> GetSettingsByKeysAsync(IEnumerable<string> keys);
        Task<bool> SetSettingsAsync(List<Setting> settings);
    }
}