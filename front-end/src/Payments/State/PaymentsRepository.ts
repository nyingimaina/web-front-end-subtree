import IInvoice from "@/Invoices/Data/IInvoice";
import RepositoryBase from "@/State/RepositoryBase";

export default class PaymentsRepository extends RepositoryBase{
    invoiceId: string = "";
    invoice: IInvoice = {} as IInvoice;
}

