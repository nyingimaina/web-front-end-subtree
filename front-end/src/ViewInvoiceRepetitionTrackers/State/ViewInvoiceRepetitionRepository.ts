import RepositoryBase from "@/State/RepositoryBase";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class ViewInvoiceRepetitionRepository extends RepositoryBase {
  invoiceType: InvoiceTypeNames = "Customer";
}
