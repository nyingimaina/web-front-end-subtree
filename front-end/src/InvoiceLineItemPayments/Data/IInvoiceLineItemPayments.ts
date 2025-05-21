export default interface InvoiceLineItemPayment {
  id: string;
  created: Date;
  modified: Date;
  deleted: boolean;
  userId: string;
  companyId: string;
  invoiceLineItemId: string;
  paymentId: string;
  amount: number;
}
