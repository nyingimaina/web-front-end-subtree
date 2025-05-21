import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default interface IBillableItem {
  id: string;
  created: string;
  modified: string;
  deleted: boolean;
  userId: string;
  displayLabel: string;
  companyId: string;
  invoiceType: InvoiceTypeNames;
}
