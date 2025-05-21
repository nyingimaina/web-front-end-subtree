using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.UrlShortening
{
    public class ShortUrlCode : CompanyModel
    {
        [StringIsNonNullable("Code")]
        [StringMaxLength(15, "Code")]
        public required string Code { get; set; }
        
        [StringIsNonNullable("Url")]
        public required string Url { get; set; }
    }
}