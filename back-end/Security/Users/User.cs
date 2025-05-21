using Dapper.Contrib.Extensions;
using Rocket.Libraries.FormValidationHelper.Attributes.InBuilt.Strings;

namespace Jattac.Apps.CompanyMan.Security.Users
{
    public class User : Model
    {
        public const string SuperAdminEmail = "nyingimaina@gmail.com";

        public const string ApiUserName = "api";
        
        [StringIsNonNullable]
            public string Email { get; set; } = string.Empty;
        public virtual string Password { get; set; } = string.Empty;

        public Guid CompanyId { get; set; }

        [Computed]
        internal string CompanyName { get; set; } = string.Empty;

        [Computed]
        public HashSet<Guid> UserRoleIds { get; set; } = new HashSet<Guid>();

        [Computed]
        public HashSet<string> UserRoleNames { get; set; } = new HashSet<string>();
        
        [Computed]
        public string CompanyDisplayLabel { get;  set; } = string.Empty;

        [Computed]
        public string CompanyType { get; set; } = string.Empty;
        
        
    }
}