export default interface ITransaction {
  description: string;
  contactId: string;
  invoiceAmount: number;
  paymentAmount: number;
  dated: Date;
}
