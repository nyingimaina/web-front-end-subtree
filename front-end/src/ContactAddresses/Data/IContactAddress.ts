import ContactAddressTypeNames from "./ContactAddressTypeNames";

export default interface IContactAddress {
  id: string;
  created: Date;
  modified: Date;
  deleted: boolean;
  userId: string;
  customerId: string;
  companyId: string;
  addressType: ContactAddressTypeNames;
  value: string;
}
