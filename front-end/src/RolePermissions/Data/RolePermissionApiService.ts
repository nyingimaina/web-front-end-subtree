import CrudApiService from "@/ApiService/CrudApiService";
import IRolePermission from "./IRolePermission";

export default class RolePermissionApiService extends CrudApiService<IRolePermission> {
  protected route: string = "RolePermissions";

  public async getByCompanyId(args: {
    companyId: string;
  }): Promise<IRolePermission[]> {
    if (args.companyId === "company-list") {
      throw new Error("Company id is wrong");
    }
    const result = await this.getOrThrowAsync<IRolePermission[]>({
      endpoint: "get-by-company-id",
      queryParams: {
        companyId: args.companyId,
      },
      cacheKey: "RolePermissions",
    });
    return result ?? [];
  }

  public async denyPermission(rolePermission: IRolePermission) {
    await this.postOrThrowAsync({
      endpoint: "deny-permission",
      body: rolePermission,
    });
  }

  public async grantPermission(rolePermission: IRolePermission) {
    await this.postOrThrowAsync({
      endpoint: "grant-permission",
      body: rolePermission,
    });
  }
}
