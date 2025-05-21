import InvoicesListRepository from "./InvoicesListRepository";
import IInvoice from "@/Invoices/Data/IInvoice";
import Paginator from "@/Pagination/Paginator";
import InvoiceApiService from "@/Invoices/Data/InvoiceApiService";
import IPayment from "@/Payments/Data/IPayment";
import LogicBase from "@/State/LogicBase";
import PaymentApiService from "@/Payments/Data/PaymentApiService";
import InvoicePaymentStatus from "../Data/InvoicePaymentStatus";
import ArSh from "@/ArSh/ArSh";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import InvoiceWindows from "../Data/InvoiceWindows";

export default class InvoicesListLogic extends LogicBase<
  InvoicesListRepository,
  IInvoice
> {
  repository = new InvoicesListRepository();
  model: IInvoice = {} as IInvoice;
  private paginatorMap: Map<InvoiceWindows, Paginator<IInvoice>> = new Map<
    InvoiceWindows,
    Paginator<IInvoice>
  >();

  public get paginator(): Paginator<IInvoice> {
    if (!this.paginatorMap.has(this.repository.invoiceWindow)) {
      const paginator = this.getNewPaginator(this.repository.invoiceWindow);
      paginator.fetchPage();
      this.paginatorMap.set(this.repository.invoiceWindow, paginator);
    }
    return this.paginatorMap.get(this.repository.invoiceWindow)!;
  }

  public async initializeAsync(args: { invoiceType: InvoiceTypeNames }) {
    this.repository.invoiceType = args.invoiceType;
    await Promise.all([this.paginator.fetchPage()]);
  }

  public async handlePaymentAsync(invoice: IInvoice): Promise<boolean> {
    return await this.proxyRunner.runAsync(async () => {
      const status = this.getInvoiveStatus(invoice);
      const payments =
        status === "Fully Paid"
          ? []
          : invoice.invoiceLineItems.map((invoiceLineItem) => {
              return {
                amount: invoiceLineItem.lineGrossTotal,
                dated: invoice.paymentDate,
                invoiceLineItemId: invoiceLineItem.id,
              } as IPayment;
            });
      const succeeded =
        status === "Fully Paid"
          ? await new InvoiceApiService().unPayAsync({ invoiceId: invoice.id })
          : await new PaymentApiService().payAsync(payments);
      if (succeeded) {
        invoice.paidAmount =
          status === "Fully Paid"
            ? 0
            : payments.reduce((total, payment) => total + payment.amount, 0);
        invoice.balance =
          status === "Fully Paid"
            ? invoice.grossTotal
            : invoice.grossTotal - invoice.paidAmount;
        invoice.status = status === "Fully Paid" ? "Unpaid" : "Fully Paid";
      }
      ArSh.upsertItem({
        arr: this.paginator.currentPageItems,
        item: invoice,
        matcher(a, b) {
          return a.id === b.id;
        },
        onCompletion: () => {
          this.rerender();
        },
      });
      return succeeded;
    });
  }

  public getInvoiveStatus(invoice: IInvoice): InvoicePaymentStatus {
    if (invoice.balance === 0) {
      return "Fully Paid";
    } else {
      return "Unpaid";
    }
  }

  public setDates(args: { startDate?: Date; endDate?: Date }): void {
    const startDate = args.startDate ?? this.repository.startDate;
    const endDate = args.endDate ?? this.repository.endDate;

    if (endDate && startDate && endDate < startDate) {
      this.updateRepository({
        startDate,
        endDate: startDate,
      });
    } else {
      this.updateRepository({
        startDate,
        endDate,
      });
    }
    this.paginatorMap.clear();
    this.paginator.fetchPage();
  }

  public async toggleArchivalAsync(invoice: IInvoice): Promise<boolean> {
    await this.proxyRunner.runAsync(async () => {
      const deleted = await new InvoiceApiService().toggleArchivalAsync({
        invoiceId: invoice.id,
      });
      return deleted;
    });
    invoice.deleted = !invoice.deleted;
    ArSh.removeItem({
      arr: this.paginator.currentPageItems,
      item: invoice,
      matcher(a, b) {
        return a.id === b.id;
      },
      onCompletion: () => {
        this.rerender();
      },
    });
    return true;
  }

  public async markAsBadDebt(invoice: IInvoice): Promise<boolean> {
    await this.proxyRunner.runAsync(async () => {
      const marked = await new InvoiceApiService().markAsBadDebt({
        invoiceId: invoice.id,
      });
      return marked;
    });
    invoice.badDebt = true;
    ArSh.removeItem({
      arr: this.paginator.currentPageItems,
      item: invoice,
      matcher(a, b) {
        return a.id === b.id;
      },
      onCompletion: () => {
        this.rerender();
      },
    });
    return true;
  }

  public canMarkAsBadDebt(invoice: IInvoice): boolean {
    const result =
      invoice.status.trim().toLocaleLowerCase() ===
        "Unpaid".toLocaleLowerCase() &&
      invoice.badDebt === false &&
      invoice.deleted === false
        ? true
        : false;
    return result;
  }

  public canToggleArchival(invoice: IInvoice): boolean {
    const result =
      invoice.status.trim().toLocaleLowerCase() ===
        "Unpaid".toLocaleLowerCase() && invoice.badDebt === false
        ? true
        : false;
    return result;
  }

  public canTogglePaid(invoice: IInvoice): boolean {
    const result =
      invoice.deleted === false && invoice.badDebt === false ? true : false;
    return result;
  }

  public set invoiceWindow(invoiceWindow: InvoiceWindows) {
    this.updateRepository({ invoiceWindow });
  }

  public async sendToCustomerAsync(args: {
    invoiceId: string;
  }): Promise<boolean> {
    return await this.proxyRunner.runAsync(async () => {
      return await new InvoiceApiService().sendWhatsAppAsync({
        invoiceId: args.invoiceId,
      });
    });
  }

  private getNewPaginator(invoiceWindow: InvoiceWindows): Paginator<IInvoice> {
    return new Paginator<IInvoice>({
      fetchFunction: async (args) => {
        try {
          this.updateRepository({ busy: true });
          const result = await new InvoiceApiService().getPageByTypeAsync({
            page: args.page,
            pageSize: args.pageSize,
            invoiceType: this.repository.invoiceType,
            include: [invoiceWindow] as unknown as InvoiceWindows[],
            startDate: this.repository.startDate,
            endDate: this.repository.endDate,
          });
          return result;
        } finally {
          this.updateRepository({ busy: false });
        }
      },
      onPageChanged: () => {
        this.rerender();
      },
      initialPage: 1,
      initialPageSize: 20,
    });
  }
}
