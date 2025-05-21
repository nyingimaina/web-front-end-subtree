import PermissionNames from "@/Permissions/Data/PermissionNames";

export default interface IRolePermission {
  roleDisplayLabel: string;
  id: string;
  roleId: string;
  permissionId: string;
  companyId: string;
  permissionDisplayLabel: string;
  rolePermissionId: string;
  isGranted: boolean;
  permissionName: PermissionNames;
}
