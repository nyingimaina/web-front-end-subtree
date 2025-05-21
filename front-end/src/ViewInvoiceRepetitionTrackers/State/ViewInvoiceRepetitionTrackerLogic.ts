import ViewInvoiceRepetitionRepository from "./ViewInvoiceRepetitionRepository";
import LogicBase from "@/State/LogicBase";
import ViewInvoiceRepetitionTrackerApiService from "../Data/ViewInvoiceRepetitionTrackerApiService";
import Paginator from "@/Pagination/Paginator";
import IViewInvoiceRepetitionTracker from "../Data/IViewInvoiceRepetitionTracker";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class ViewInvoiceRepetitionTrackerLogic extends LogicBase<ViewInvoiceRepetitionRepository> {
  repository = new ViewInvoiceRepetitionRepository();
  model: any;

  public paginator = new Paginator<IViewInvoiceRepetitionTracker>({
    fetchFunction: async (args: { page: number; pageSize: number }) => {
      return await this.proxyRunner.runAsync(async () => {
        const data =
          await new ViewInvoiceRepetitionTrackerApiService().getByInvoiceTypeAsync(
            {
              invoiceType: this.repository.invoiceType,
              page: args.page,
              pageSize: args.pageSize,
            }
          );
        debugger;
        return data;
      });
    },
    onPageChanged: () => {
      this.rerender();
    },
    initialPage: 1,
    initialPageSize: 20,
  });

  public initialize(args: { invoiceType: InvoiceTypeNames }) {
    this.repository.invoiceType = args.invoiceType;
  }
}
