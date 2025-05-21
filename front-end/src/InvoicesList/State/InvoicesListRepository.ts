import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import RepositoryBase from "@/State/RepositoryBase";
import ReportingHelper from "../../../Reporting/ReportingHelper";
import InvoiceWindows from "../Data/InvoiceWindows";

export default class InvoicesListRepository extends RepositoryBase {
  invoiceType: InvoiceTypeNames = "" as unknown as InvoiceTypeNames;
  startDate: Date = ReportingHelper.firstDayOfThisMonth;
  endDate: Date = new Date();
  invoiceWindow: InvoiceWindows = "Active";
}
