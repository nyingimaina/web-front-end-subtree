import IContact from "@/Contacts/Data/IContact";
import PropManUnitContactType from "./PropManUnitContactTypes";

export default interface IPropManUnitContact extends IContact {
  id: string;
  propManUnitId: string;
  contactId: string;
  propManUnitContactType: PropManUnitContactType;
}
