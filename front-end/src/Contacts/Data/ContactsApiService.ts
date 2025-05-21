import CrudApiService from "@/ApiService/CrudApiService";
import IContact from "./IContact";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class ContactApiService extends CrudApiService<IContact> {
  protected route: string = "Contacts";

  override async searchAsync(args: {
    searchText: string;
    invoiceType: InvoiceTypeNames;
    page?: number;
    pageSize?: number;
  }): Promise<IContact[]> {
    const queryParamsAndPaging = this.getQueryParamsAndPaging(args);
    return await this.getOrThrowAsync({
      endpoint: "search-by-invoice-type",
      queryParams: queryParamsAndPaging.args,
      paging: queryParamsAndPaging.paging,
    });
  }

  public async getSingleByIdAsync(args: {
    contactId: string;
  }): Promise<IContact> {
    return await this.getOrThrowAsync({
      endpoint: "get-single-by-id",
      queryParams: { contactId: args.contactId },
    });
  }
}
