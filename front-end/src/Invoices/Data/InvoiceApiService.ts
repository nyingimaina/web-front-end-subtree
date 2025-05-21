import CrudApiService from "@/ApiService/CrudApiService";
import IInvoice from "./IInvoice";
import InvoiceTypeNames from "./InvoiceTypeNames";
import InvoiceWindows from "@/InvoicesList/Data/InvoiceWindows";

export default class InvoiceApiService extends CrudApiService<IInvoice> {
  protected route: string = "Invoices";

  public async getSingleByIdAsync(args: {
    invoiceId: string;
  }): Promise<IInvoice> {
    return await this.getOrThrowAsync({
      endpoint: "get-single-by-id",
      queryParams: { invoiceId: args.invoiceId },
    });
  }
  public async unPayAsync(args: { invoiceId: string }): Promise<boolean> {
    return await this.getOrThrowAsync({
      endpoint: "unpay",
      queryParams: {
        invoiceId: args.invoiceId,
      },
    });
  }

  public async getPageByTypeAsync(args: {
    invoiceType: InvoiceTypeNames;
    page: number;
    pageSize: number;
    include: InvoiceWindows[];
    startDate: Date;
    endDate: Date;
  }): Promise<IInvoice[]> {
    const toFlatString = args.include
      .map((i: InvoiceWindows) => i.toString())
      .join(",");
    return await this.getOrThrowAsync({
      endpoint: "get-page-by-type",
      queryParams: {
        invoiceType: args.invoiceType,
        includeList: toFlatString,
        startDate: args.startDate,
        endDate: args.endDate,
      },
      paging: {
        page: args.page,
        pageSize: args.pageSize,
      },
    });
  }

  public async getByInvoiceTypeAndPeriodAsync(args: {
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }): Promise<IInvoice[]> {
    const paramsAndPaging = this.getQueryParamsAndPaging(args);

    return await this.getOrThrowAsync({
      endpoint: "get-by-type-and-date",
      queryParams: paramsAndPaging.args,
      paging: paramsAndPaging.paging,
    });
  }

  public async toggleArchivalAsync(args: {
    invoiceId: string;
  }): Promise<boolean> {
    return await this.getOrThrowAsync({
      endpoint: "toggle-archival",
      queryParams: { invoiceId: args.invoiceId },
    });
  }

  public async markAsBadDebt(args: { invoiceId: string }): Promise<boolean> {
    await this.getOrThrowAsync({
      endpoint: "mark-as-bad-debt",
      queryParams: { invoiceId: args.invoiceId },
    });
    return true;
  }

  public async sendWhatsAppAsync(args: {
    invoiceId: string;
  }): Promise<boolean> {
    await this.getOrThrowAsync({
      endpoint: "send-whatsapp-message",
      queryParams: { invoiceId: args.invoiceId },
    });
    return true;
  }

  public async writeAsync(invoice: IInvoice): Promise<IInvoice> {
    const result = await this.postOrThrowAsync({
      endpoint: "write",
      body: invoice,
    });
    if (typeof result === "string") {
      throw new Error(result);
    }
    return result as IInvoice;
  }
}
