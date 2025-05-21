import IInvoice from "@/Invoices/Data/IInvoice";
import LogicBase from "@/State/LogicBase";
import InvoiceDocumentRepository from "./InvoiceDocumentRepository";
import InvoiceApiService from "@/Invoices/Data/InvoiceApiService";
import SettingsApiService from "@/Settings/Data/SettingsApiService";
import Statics from "../../../Statics";

export default class InvoiceDocumentLogic extends LogicBase<
  InvoiceDocumentRepository,
  IInvoice
> {
  protected get modelTemplate(): IInvoice {
    return {} as IInvoice;
  }
  repository = new InvoiceDocumentRepository();
  model = {} as IInvoice;

  public async fetchDataAsync(args: { invoiceId: string }) {
    this.model.id = args.invoiceId;
    await this.proxyRunner.runAsync(async () => {
      await Promise.all([this.fetchInvoiceAsync()]);
      this.repository.initialized = true;
    });
  }

  private async fetchInvoiceAsync() {
    this.model = await new InvoiceApiService().getSingleByIdAsync({
      invoiceId: this.model.id,
    });
    if (this.model && this.model.companyId !== Statics.defaultv4Guid) {
      await this.fetchFooterSettingsAsync();
    }
  }

  private async fetchFooterSettingsAsync() {
    await this.proxyRunner.runAsync(async () => {
      this.repository.footerSettings =
        await new SettingsApiService().getSettingsByOwnerAndKeysAsync({
          owner: "KeyValueSetting",
          keys: ["FooterRemarks", "FooterTitle", "PaymentInstructions"],
          companyId: this.model.companyId,
        });
    });
  }
}
