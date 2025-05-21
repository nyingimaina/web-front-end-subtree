import CrudApiService from "@/ApiService/CrudApiService";
import IBillableItem from "./IBillableItem";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class BillableItemApiService extends CrudApiService<IBillableItem> {
  protected route: string = "BillableItems";

  override async searchAsync(args: {
    searchText: string;
    invoiceType: InvoiceTypeNames;
    page?: number;
    pageSize?: number;
  }): Promise<IBillableItem[]> {
    const queryParamsAndPaging = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync({
      endpoint: "search-by-invoice-type",
      queryParams: queryParamsAndPaging.args,
      paging: queryParamsAndPaging.paging,
    });
  }
}
