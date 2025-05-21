import CrudApiService from "@/ApiService/CrudApiService";
import IInvoiceLineItem from "./IInvoiceLineItem";

export default class InvoiceLineItemApiService extends CrudApiService<IInvoiceLineItem> {
  protected route: string = "InvoiceLineItems";
}
