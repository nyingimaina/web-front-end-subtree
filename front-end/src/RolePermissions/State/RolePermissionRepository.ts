import IRole from "@/Roles/Data/IRole";
import IRolePermission from "../Data/IRolePermission";
import IPermission from "@/Permissions/Data/IPermission";

export default class RolePermissionRepository {
  rolePermissions: IRolePermission[] = [];
  roles: IRole[] = [];
  permissions: IPermission[] = [];
  companyId: string = "";
}
