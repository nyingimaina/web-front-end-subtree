import ModuleStateManager from "module-state-manager";
import InvoiceRepository from "./InvoiceRepository";
import IInvoice from "../Data/IInvoice";
import ArSh from "@/ArSh/ArSh";
import AsyncProxy from "@/AsyncProxy/AsyncProxy";
import IInvoiceLineItem from "@/InvoiceLineItems/Data/IInvoiceLineItem";
import InvoiceApiService from "../Data/InvoiceApiService";
import ContactApiService from "@/Contacts/Data/ContactsApiService";
import InvoiceTypeNames from "../Data/InvoiceTypeNames";

export default class InvoiceLogic extends ModuleStateManager<
  InvoiceRepository,
  IInvoice
> {
  addLineItem(invoiceLineItem: IInvoiceLineItem) {
    ArSh.upsertItem({
      arr: this.model.invoiceLineItems,
      matcher: (a, b) => a.billableItemId === b.billableItemId,
      item: invoiceLineItem,
      onCompletion: () => this.rerender(),
    });
  }
  private proxyRunner = new AsyncProxy((busy) =>
    this.updateRepository({ busy })
  );

  repository = new InvoiceRepository();
  model = {} as IInvoice;

  private get templateInvoice(): IInvoice {
    return {
      invoiceLineItems: [],
      invoiceRepetitionTemplate: {},
      currency: "Ksh",
    } as unknown as IInvoice;
  }

  public async initializeAsync(args: {
    invoiceType: InvoiceTypeNames;
    contactId?: string;
  }) {
    this.updateModel(JSON.parse(JSON.stringify(this.templateInvoice)));
    this.model!.invoiceType = args.invoiceType;
    await this.fetchContactAsync({ contactId: args.contactId });
    this.updateRepository({ initialized: true });
  }

  public async searchForContactAsync(args: { contactName: string }) {
    const results = await new ContactApiService().searchAsync({
      searchText: args.contactName,
      invoiceType: this.model.invoiceType,
    });
    ArSh.upsertMany({
      arr: this.repository.contacts,
      items: results,
      matcher(a, b) {
        return a.id === b.id;
      },
      onCompletion: () => this.rerender(),
    });
  }

  public get canAddLineItems() {
    return this.model.contactId && this.model.dated ? true : false;
  }

  public async upsertAsync(): Promise<boolean> {
    return await this.proxyRunner.runAsync(async () => {
      const saved = await new InvoiceApiService().writeAsync(this.model);
      return saved.id ? true : false;
    });
  }

  private async fetchContactAsync(args: { contactId?: string }) {
    if (!args.contactId) return;
    const contact = await new ContactApiService().getSingleByIdAsync({
      contactId: args.contactId,
    });
    if (contact) {
      this.repository.contacts = [contact];
      this.model.contactId = contact.id;
    }
  }
}
