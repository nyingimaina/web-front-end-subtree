using Jattac.Apps.CompanyMan.Security.CompanyTypes;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.Security.Companies
{
    public class Company : Model
    {


        public string Name { get; set; } = string.Empty;

        [StringIsInSet(
            StringComparison.InvariantCulture,
            CompanyTypeNames.Customer,
            CompanyTypeNames.BackOffice
        )]
        public string CompanyType { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string ApiKey { get; set; } = string.Empty;

        public string TimezoneCode { get; set; } = string.Empty;
    }
}