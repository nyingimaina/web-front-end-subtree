import ApiServiceBase from "@/ApiService/ApiServiceBase";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import IUnpaidInvoice from "./IUnpaidInvoice";

export default class UnpaidInvoiceApiService extends ApiServiceBase {
  protected route: string = "unpaid-invoices";

  public async getByInvoiceTypeAndPeriodAsync(args: {
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }): Promise<IUnpaidInvoice[]> {
    const paramsAndPaging = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync({
      endpoint: "get-by-invoice-type-and-period",
      queryParams: paramsAndPaging.args,
      paging: paramsAndPaging.paging,
    });
  }
}
