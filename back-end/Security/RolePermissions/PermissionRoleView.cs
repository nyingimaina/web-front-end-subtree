namespace Jattac.Apps.CompanyMan.Security.RolePermissions
{
    public class PermissionRoleView : RolePermission
    {
        public Guid RolePermissionId {get; set;}

        public bool IsGranted => RolePermissionId != Guid.Empty;
    }
}