import IInvoiceLineItem from "../Data/IInvoiceLineItem";
import InvoiceLineItemsRepository from "./InvoiceLineItemsRepository";
import IBillableItem from "@/BillableItems/Data/IBillableItem";
import BillableItemApiService from "@/BillableItems/Data/BillableItemApiService";
import ArSh from "@/ArSh/ArSh";
import ModelLogicBase from "@/State/ModelLogicBase";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default class InvoiceLineItemsLogic extends ModelLogicBase<
  InvoiceLineItemsRepository,
  IInvoiceLineItem
> {
  protected get modelTemplate(): IInvoiceLineItem {
    return {} as IInvoiceLineItem;
  }
  repository = new InvoiceLineItemsRepository();
  model = {} as IInvoiceLineItem;

  public async upsertBillableItem(args: {
    displayLabel: string;
    invoiceType: InvoiceTypeNames;
  }): Promise<IBillableItem> {
    const savedBillableItem = await this.proxyRunner.runAsync(async () => {
      return await new BillableItemApiService().upsertOrThrowAsync({
        displayLabel: args.displayLabel,
        invoiceType: args.invoiceType,
      } as IBillableItem);
    });
    ArSh.upsertItem({
      arr: this.repository.billableItems,
      matcher: (a, b) => a.id === b.id,
      item: savedBillableItem,
      onCompletion: () => this.rerender(),
    });
    return savedBillableItem;
  }

  override initialize(args: {
    model?: IInvoiceLineItem;
    invoiceType: InvoiceTypeNames;
  }) {
    this.repository.invoiceType = args.invoiceType;
    super.initialize({ model: args.model });
  }

  async searchForBillableItemAsync(args: { billableItem: string }) {
    const results = await new BillableItemApiService().searchAsync({
      searchText: args.billableItem,
      invoiceType: this.repository.invoiceType,
    });
    if (this.repositoryBillableItemsChanged(results)) {
      this.updateRepository({ billableItems: results });
    }
  }

  private repositoryBillableItemsChanged(
    searchResult: IBillableItem[]
  ): boolean {
    const sortBillableItems = (items: IBillableItem[]) => {
      items.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      });
    };
    sortBillableItems(this.repository.billableItems);
    sortBillableItems(searchResult);
    const changed =
      this.repository.billableItems.length !== searchResult.length ||
      this.repository.billableItems.some((item, index) => {
        return item.id !== searchResult[index].id;
      });

    return changed;
  }

  public get canSave(): boolean {
    return this.model.billableItemId &&
      this.model.unitPrice > 0 &&
      this.model.quantity > 0
      ? true
      : false;
  }
}
