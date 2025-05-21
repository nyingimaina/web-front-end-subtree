export default interface IPayment {
  id: string;
  created: Date;
  modified: Date;
  deleted: boolean;
  userId: string;
  invoiceLineItemId: string;
  companyId: string;
  dated: Date;
  amount: number;
}
