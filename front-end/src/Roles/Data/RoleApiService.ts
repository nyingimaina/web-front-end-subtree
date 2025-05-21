import CrudApiService from "@/ApiService/CrudApiService";
import IRole from "./IRole";

export default class RoleApiService extends CrudApiService<IRole> {
  protected route: string = "roles";
}
