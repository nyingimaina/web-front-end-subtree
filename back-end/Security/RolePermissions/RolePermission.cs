using Dapper.Contrib.Extensions;

namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public class RolePermission : Model
    {
        [Computed]
        public string RoleDisplayLabel { get; internal set; } = string.Empty;
        public Guid RoleId { get; set; }

        public Guid PermissionId { get; set; }

        public Guid CompanyId { get; set; }

        [Computed]
        public string PermissionDisplayLabel { get; set; } = "";

        [Computed]
        public string RoleName { get; set; } = string.Empty;

        [Computed]
        public string PermissionName { get; set; } = string.Empty;
    }
}