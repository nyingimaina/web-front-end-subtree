export default interface IUnpaidInvoice {
  id: string;
  created: Date;
  modified: Date;
  deleted?: Date;
  userId: string;
  contactId: string;
  invoiceNumber: string;
  dated: Date;
  companyId: string;
  comment: string;
  currency: string;
  invoiceType: string;
  totalAmountDue: number;
  totalPaymentsMade: number;
  remainingAmount: number;
}
