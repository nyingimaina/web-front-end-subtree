using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Jattac.Apps.CompanyMan.Settings;

namespace Jattac.Apps.CompanyMan.KeyValueSettings
{
    public interface IKeyValueSettingsHandler : ISettingsHandler
    {
        
    }
    public class KeyValueSettingsHandler : IKeyValueSettingsHandler
    {
        private readonly IKeyValueSettingReader keyValueSettingReader;
        private readonly IKeyValueSettingWriter keyValueSettingWriter;

        public KeyValueSettingsHandler(
            IKeyValueSettingReader keyValueSettingReader,
            IKeyValueSettingWriter keyValueSettingWriter
        )
        {
            this.keyValueSettingReader = keyValueSettingReader;
            this.keyValueSettingWriter = keyValueSettingWriter;
        }

        public string Name => nameof(KeyValueSetting);


        


        public async Task<List<Setting>> GetSettingsAsync()
        {
            var keyValueSettings = await keyValueSettingReader.GetPageableAsync(
                page: 1,
                pageSize: ushort.MaxValue,
                pagingField: keyValueSetting => keyValueSetting.Key,
                orderAscending: true
                
            );

            return keyValueSettings.Select(keyValueSetting => new Setting
            {
                Key = keyValueSetting.Key,
                Value = keyValueSetting.Value,
                Owner = Name,
                Id = keyValueSetting.Id
            }).ToList();
        }

        public async Task<IEnumerable<Setting>> GetSettingsByKeysAsync(IEnumerable<string> keys)
        {
            var keyValueSettings = await keyValueSettingReader.GetManyByKeysAsync(keys);
            return keyValueSettings.Select(kv => new Setting
            {
                Key = kv.Key,
                Value = kv.Value,
                Owner = Name
            });
        }

        public async Task<bool> SetSettingsAsync(List<Setting> settings)
        {
            var keyValueSettings = settings.Where(setting => setting.Owner == Name).ToList();
            var keys = keyValueSettings.Select(setting => setting.Key).ToList();
            var existingKeyValueSettings = await keyValueSettingReader.GetManyByKeysAsync(keys);

            foreach (var keyValueSetting in keyValueSettings)
            {
                var specificKeyValueSetting = existingKeyValueSettings.SingleOrDefault(a => a.Key == keyValueSetting.Key);
                if (specificKeyValueSetting == null)
                {
                    var saveResponse = await keyValueSettingWriter.UpsertAsync(new KeyValueSetting
                    {
                        Key = keyValueSetting.Key,
                        Value = keyValueSetting.Value
                    });
                    saveResponse.FailReportClientVisibleMessagesIfAny();
                }
                else
                {
                    specificKeyValueSetting.Value = keyValueSetting.Value;
                    var saveResponse = await keyValueSettingWriter.UpsertAsync(specificKeyValueSetting);
                    saveResponse.FailReportClientVisibleMessagesIfAny();
                }
            }

            return true;
        }
    }
}