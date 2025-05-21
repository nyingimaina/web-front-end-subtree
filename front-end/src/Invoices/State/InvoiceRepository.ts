import IBillableItem from "@/BillableItems/Data/IBillableItem";
import IContact from "@/Contacts/Data/IContact";

export default class InvoiceRepository {
  busy: boolean = false;
  contacts: IContact[] = [];
  billableItems: IBillableItem[] = [];
  initialized: boolean = false;
}
