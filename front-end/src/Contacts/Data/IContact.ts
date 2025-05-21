import ContactTypeNames from "@/ContactTypes/Data/ContactTypeNames";
import IContactAddress from "@/ContactAddresses/Data/IContactAddress";

export default interface IContact {
  id: string;
  created: Date;
  modified: Date;
  deleted: boolean;
  userId: string;
  displayLabel: string;
  companyId: string;
  contactAddresses: IContactAddress[];
  contactType: ContactTypeNames;
}
