using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.DatabaseIntegrator;

namespace Jattac.Apps.CompanyMan.KeyValueSettings
{

    public interface IKeyValueSettingWriter : IDatabaseWriterBase<KeyValueSetting>
    {

    }

    public class KeyValueSettingWriter : DatabaseWriterBase<KeyValueSetting> , IKeyValueSettingWriter
    {
        public KeyValueSettingWriter(
            IDatabaseHelper<Guid> databaseHelper,
            IKeyValueSettingReader reader,
            IStandardHeaderReader standardHeaderReader)
             : base(databaseHelper, reader, standardHeaderReader)
        {
        }
    }
}