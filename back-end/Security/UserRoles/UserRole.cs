using Dapper.Contrib.Extensions;

namespace Jattac.Apps.CompanyMan.Security.UserRoles
{
    public class UserRole : Model
    {
        public Guid UserId { get; set; }

        public Guid RoleId { get; set; }

        [Computed]
        public string RoleName { get; set; } = string.Empty;
    }
}