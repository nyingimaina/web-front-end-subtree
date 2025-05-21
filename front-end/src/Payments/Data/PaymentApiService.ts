import CrudApiService from "@/ApiService/CrudApiService";
import IPayment from "./IPayment";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class PaymentApiService extends CrudApiService<IPayment> {
  protected route: string = "Payments";

  public async payAsync(payments: IPayment[]): Promise<boolean> {
    return await this.postOrThrowAsync<boolean>({
      endpoint: "pay",
      body: payments,
    });
  }

  public async getByInvoiceTypeAndPeriodAsync(args: {
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }): Promise<IPayment[]> {
    const paramsAndPaging = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync({
      endpoint: "get-by-invoice-type-and-period",
      queryParams: paramsAndPaging.args,
      paging: paramsAndPaging.paging,
    });
  }

  public async getSumByInvoiceTypeAndPeriodAsync(args: {
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    const params = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync({
      endpoint: "sum-by-invoice-type-and-period",
      queryParams: params.args,
    });
  }
}
