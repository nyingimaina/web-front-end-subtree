import ModuleStateManager from "module-state-manager";
import RolePermissionRepository from "./RolePermissionRepository";
import IRolePermission from "../Data/IRolePermission";
import RolePermissionApiService from "../Data/RolePermissionApiService";
import IRole from "@/Roles/Data/IRole";
import IPermission from "@/Permissions/Data/IPermission";

export default class RolePermissionLogic extends ModuleStateManager<
  RolePermissionRepository,
  IRolePermission
> {
  repository: RolePermissionRepository = new RolePermissionRepository();
  model: IRolePermission = {} as IRolePermission;

  public async initializeAsync(args: { companyId: string }) {
    await Promise.all([
      this.getRolePermissionsAsync({ companyId: args.companyId }),
    ]);
    this.updateRepository({ companyId: args.companyId });
  }

  public isPermissionGranted(rolePermission: IRolePermission): boolean {
    const result = this.repository.rolePermissions.some(
      (rp) =>
        this.getRolePermissionCompositeId(rp) ==
          this.getRolePermissionCompositeId(rolePermission) && rp.isGranted
    );
    return result;
  }

  public async togglePermissionAsync(rolePermission: IRolePermission) {
    rolePermission.companyId = this.repository.companyId;
    if (this.isPermissionGranted(rolePermission)) {
      this.denyPermissionAsync(rolePermission);
    } else {
      this.grantPermissionAsync(rolePermission);
    }
  }

  private async grantPermissionAsync(rolePermission: IRolePermission) {
    await new RolePermissionApiService().grantPermission(rolePermission);
    const rolePermissions = this.repository.rolePermissions.filter(
      (a) =>
        this.getRolePermissionCompositeId(a) !=
        this.getRolePermissionCompositeId(rolePermission)
    );
    rolePermission.isGranted = true;
    rolePermissions.push(rolePermission);
    this.repository.rolePermissions = rolePermissions;
    this.rerender();
  }

  private getRolePermissionCompositeId(rolePermission: IRolePermission) {
    return `${rolePermission.roleId}-${rolePermission.permissionId}`.toLocaleLowerCase();
  }

  private async denyPermissionAsync(rolePermission: IRolePermission) {
    await new RolePermissionApiService().denyPermission(rolePermission);
    const rolePermissions = this.repository.rolePermissions.filter(
      (a) =>
        this.getRolePermissionCompositeId(a) !=
        this.getRolePermissionCompositeId(rolePermission)
    );
    this.repository.rolePermissions = rolePermissions;
    this.rerender();
  }

  private async getRolePermissionsAsync(args: { companyId: string }) {
    
    this.repository.rolePermissions =
      await new RolePermissionApiService().getByCompanyId({
        companyId: args.companyId,
      });
    this.repository.rolePermissions.sort((a, b) =>
      a.permissionDisplayLabel.localeCompare(b.permissionDisplayLabel)
    );
    this.setUniqueRoles();
    this.setUniquePermissions();
  }

  private setUniqueRoles() {
    this.repository.roles = [];
    this.repository.rolePermissions.forEach((rolePermission) => {
      const addedInstance = this.repository.roles.find(
        (role) => role.id === rolePermission.roleId
      );
      if (!addedInstance && rolePermission.roleDisplayLabel) {
        this.repository.roles.push({
          id: rolePermission.roleId,
          roleDisplayLabel: rolePermission.roleDisplayLabel,
        } as IRole);
      }
    });
    this.repository.roles.sort((a, b) =>
      a.roleDisplayLabel.localeCompare(b.roleDisplayLabel)
    );
  }

  private setUniquePermissions() {
    this.repository.permissions = [];
    this.repository.rolePermissions.forEach((rolePermission) => {
      const addedInstance = this.repository.permissions.find(
        (permission) => permission.id === rolePermission.permissionId
      );
      if (!addedInstance && rolePermission.permissionDisplayLabel) {
        this.repository.permissions.push({
          id: rolePermission.permissionId,
          displayLabel: rolePermission.permissionDisplayLabel,
        } as IPermission);
      }
    });

    this.repository.permissions.sort((a, b) =>
      a.displayLabel.localeCompare(b.displayLabel)
    );
  }
}
