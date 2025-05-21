import CrudApiService from "@/ApiService/CrudApiService";
import IPropManUnitContactRelease from "./IPropManUnitContactRelease";

export default class PropManUnitContactReleaseApiService extends CrudApiService<IPropManUnitContactRelease> {
  protected route: string = "prop-man-unit-contact-releases";
}
