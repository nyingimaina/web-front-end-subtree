import CrudApiService from "@/ApiService/CrudApiService";
import IPropManUnit from "./IPropManUnit";

export default class PropManUnitApiService extends CrudApiService<IPropManUnit> {
  protected route: string = "property-management-units";

  public async getByCompanyIdAsync(args: {
    companyId: string;
    page: number;
    pageSize: number;
  }): Promise<IPropManUnit[]> {
    return await this.getOrThrowAsync({
      endpoint: "get-by-company-id",
      paging: { page: args.page, pageSize: args.pageSize },
      queryParams: { companyId: args.companyId },
    });
  }

  public async getSingleByIdAsync(args: {
    propManUnitId: string;
  }): Promise<IPropManUnit> {
    return await this.getOrThrowAsync({
      endpoint: "get-single-by-id",
      queryParams: { propManUnitId: args.propManUnitId },
    });
  }
}
