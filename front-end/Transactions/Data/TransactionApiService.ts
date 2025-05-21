import ApiServiceBase from "@/ApiService/ApiServiceBase";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import ITransaction from "./ITransaction";

export default class TransactionApiService extends ApiServiceBase {
  protected route: string = "transactions";
  public async getByContactIdAsync(args: {
    contactId: string;
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }): Promise<ITransaction[]> {
    return await this.getOrThrowAsync<ITransaction[]>({
      endpoint: "get-by-contact-id",
      queryParams: args,
    });
  }
}
