import InvoiceTypeNames from "../Data/InvoiceTypeNames";

export default class InvoiceHelper {
  public static getInvoiceTypeDisplayLabel(args: {
    invoiceTypeName: InvoiceTypeNames;
  }): string {
    switch (args.invoiceTypeName) {
      case "Customer":
        return "Customer Invoice";
      case "Supplier":
        return "Supplier Invoice";
      default:
        throw new Error("Unknown invoice type name: " + args.invoiceTypeName);
    }
  }

  public static getInvoiceTypeContactDisplayLabel(args: {
    invoiceTypeName: InvoiceTypeNames;
  }): string {
    switch (args.invoiceTypeName) {
      case "Customer":
        return "Customer";
      case "Supplier":
        return "Supplier";
      default:
        throw new Error("Unknown invoice type name: " + args.invoiceTypeName);
    }
  }
}
