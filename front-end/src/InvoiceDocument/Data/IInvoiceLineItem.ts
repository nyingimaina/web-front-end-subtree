export default interface IInvoiceLineItem {
  billableItemDisplayLabel: string;
  quantity: number;
  unitPrice: number;
  lineGrossTotal: number;
}