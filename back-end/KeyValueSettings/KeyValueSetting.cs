using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.KeyValueSettings
{
    public class KeyValueSetting : UserModel
    {
        [StringMaxLength(45, "Setting Key")]
        [StringIsNonNullable("Setting Key")]
        public required string Key { get; set; }
        public required string Value { get; set; }
    }
}