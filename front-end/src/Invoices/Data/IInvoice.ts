import IInvoiceLineItem from "@/InvoiceLineItems/Data/IInvoiceLineItem";
import IInvoiceRepetitionTemplate from "@/InvoiceRepetitionTemplates/Data/InvoiceRepetitionTemplate";
import InvoiceTypeNames from "./InvoiceTypeNames";
import InvoicePaymentStatus from "@/InvoicesList/Data/InvoicePaymentStatus";

export default interface Invoice {
  id: string;
  created: Date;
  modified: Date;
  deleted: boolean;
  userId: string;
  contactId: string;
  invoiceNumber: number;
  dated: Date;
  companyId: string;
  comment: string;
  contactDisplayLabel: string;
  invoiceLineItemIds: string[];
  grossTotal: number;
  currency: string;
  invoiceLineItems: IInvoiceLineItem[];
  invoiceRepetitionTemplate: IInvoiceRepetitionTemplate;
  status: InvoicePaymentStatus;
  paidAmount: number;
  invoiceNumberPadded: string;
  companyDisplayLabel: string;
  balance: number;
  paymentDate: Date;
  invoiceType: InvoiceTypeNames;
  badDebt: boolean;
}
