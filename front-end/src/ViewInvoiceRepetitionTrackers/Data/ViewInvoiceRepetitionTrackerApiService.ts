import CrudApiService from "@/ApiService/CrudApiService";
import IViewInvoiceRepetitionTracker from "./IViewInvoiceRepetitionTracker";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class ViewInvoiceRepetitionTrackerApiService extends CrudApiService<IViewInvoiceRepetitionTracker> {
  protected route: string = "view-invoice-repetition-tracker";

  public async getByInvoiceTypeAsync(args: {
    invoiceType: InvoiceTypeNames;
    page: number;
    pageSize: number;
  }): Promise<IViewInvoiceRepetitionTracker[]> {
    const params = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync<IViewInvoiceRepetitionTracker[]>({
      endpoint: "get-by-invoice-type",
      queryParams: params.args,
      paging: params.paging,
    });
  }
}
