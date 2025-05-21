import LogicBase from "@/State/LogicBase";
import AccountStatementRepository from "./AccountStatementRepository";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import TransactionApiService from "../../../Transactions/Data/TransactionApiService";

export default class AccountStatementLogic extends LogicBase<AccountStatementRepository> {
  repository = new AccountStatementRepository();

  public async initializeAsync(args: {
    contactId: string;
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }) {
    await this.proxyRunner.runAsync(async () => {
      await this.fetchTransactionsAsync(args);
    });
  }

  private async fetchTransactionsAsync(args: {
    contactId: string;
    invoiceType: InvoiceTypeNames;
    startDate: Date;
    endDate: Date;
  }) {
    this.repository.transactions =
      await new TransactionApiService().getByContactIdAsync(args);
  }
}
