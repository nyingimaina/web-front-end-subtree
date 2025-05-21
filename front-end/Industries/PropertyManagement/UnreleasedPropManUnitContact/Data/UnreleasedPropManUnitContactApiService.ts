import CrudApiService from "@/ApiService/CrudApiService";
import { IUnreleasedPropManUnitContact } from "./IUnreleasedPropManUnitContact";

export default class UnreleasedPropManUnitContactApiService extends CrudApiService<IUnreleasedPropManUnitContact> {
  route = "unreleased-prop-man-unit-contacts";
}
