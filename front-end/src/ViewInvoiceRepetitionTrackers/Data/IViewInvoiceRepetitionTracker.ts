import IInvoice from "@/Invoices/Data/IInvoice";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

export default interface IViewInvoiceRepetitionTracker extends IInvoice {
  invoiceRepetitionTemplateId: string;
  invoiceId: string;
  nextScheduledDate: Date;
  contactId: string;
  contactDisplayLabel: string;
  invoiceType: InvoiceTypeNames;
  lastInvoiceNumber: string;
  lastInvoiceDate?: Date;
  lastInvoiceNumberPadded: string;
}
