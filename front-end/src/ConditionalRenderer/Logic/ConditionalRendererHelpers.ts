import AuthenticatedUserTracker from "@/Account/AuthenticatedUserTracker";
import CompanyApiService from "@/Companies/Data/CompanyApiService";
import ICompany from "@/Companies/Data/ICompany";
import PermissionNames from "@/Permissions/Data/PermissionNames";
import IRolePermission from "@/RolePermissions/Data/IRolePermission";
import RolePermissionApiService from "@/RolePermissions/Data/RolePermissionApiService";

export default class ConditionalRendererHelpers {
  static async isBackOfficeAsync(): Promise<boolean> {
    const result = await new CompanyApiService().getByIdAsync({
      id: AuthenticatedUserTracker.authenticatedUser?.companyId ?? "",
    });
    if (typeof result === "string") return false;
    return (result as ICompany).name === "Back Office";
  }

  static async isCustomerAsync(): Promise<boolean> {
    const isBackOffice = await ConditionalRendererHelpers.isBackOfficeAsync();
    return !isBackOffice;
  }

  static async conditionalAction<T>(args: {
    permission: PermissionNames;
    hasPermission: () => T | Promise<T>;
    lacksPermission: () => T | Promise<T>;
  }): Promise<T> {
    if (await this.currentUserHasPermissionsAsync(args.permission)) {
      return await args.hasPermission();
    } else {
      return await args.lacksPermission();
    }
  }

  static async currentUserHasPermissionsAsync(
    permission: PermissionNames
  ): Promise<boolean> {
    const authenticatedUser = AuthenticatedUserTracker.authenticatedUser;
    if (!authenticatedUser) {
      return false;
    }
    const rolePermissions = await new RolePermissionApiService().getByCompanyId(
      {
        companyId: authenticatedUser.companyId,
      }
    );

    for (let i = 0; i < authenticatedUser.userRoleIds.length; i++) {
      const userRoleId = authenticatedUser.userRoleIds[i];
      const grantedUserPermissionRoles = rolePermissions.filter(
        (a) => a.roleId === userRoleId && a.isGranted === true
      );

      for (let j = 0; j < grantedUserPermissionRoles.length; j++) {
        const specificRolePermission = grantedUserPermissionRoles[j];
        if (specificRolePermission.permissionName === permission) {
          return specificRolePermission.isGranted;
        }
      }
    }
    return false;
  }

  private static getRolePermissionCompositeId(rolePermission: IRolePermission) {
    return `${rolePermission.roleId}-${rolePermission.permissionId}`.toLocaleLowerCase();
  }
}
