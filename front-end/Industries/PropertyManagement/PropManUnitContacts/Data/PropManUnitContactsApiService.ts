import CrudApiService from "@/ApiService/CrudApiService";
import IPropManUnitContact from "./IPropManUnitContact";

export default class PropManUnitContactsApiService extends CrudApiService<IPropManUnitContact> {
  protected route: string = "prop-man-unit-contacts";

  public async getByPropManUnitIdAsync(args: {
    propManUnitId: string;
  }): Promise<IPropManUnitContact[]> {
    return await this.getOrThrowAsync({
      endpoint: "get-by-prop-man-unit-id",
      queryParams: { propManUnitId: args.propManUnitId },
    });
  }
}
