import IBillableItem from "@/BillableItems/Data/IBillableItem";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import RepositoryBase from "@/State/RepositoryBase";

export default class InvoiceLineItemsRepository extends RepositoryBase {
  billableItems: IBillableItem[] = [];
  invoiceType: InvoiceTypeNames = "" as unknown as InvoiceTypeNames;
}
