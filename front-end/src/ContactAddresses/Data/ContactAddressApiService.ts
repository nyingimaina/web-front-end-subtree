import CrudApiService from "@/ApiService/CrudApiService";
import IContactAddress from "./IContactAddress";

export default class ContactAddressApiService extends CrudApiService<IContactAddress> {
  protected route: string = "ContactAddresses";
}
