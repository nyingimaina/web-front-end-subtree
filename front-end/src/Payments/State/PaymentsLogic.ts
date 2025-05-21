import PaymentsRepository from "./PaymentsRepository";
import IPayment from "../Data/IPayment";
import InvoiceApiService from "@/Invoices/Data/InvoiceApiService";
import ModelLogicBase from "@/State/ModelLogicBase";

export default class PaymentsLogic extends ModelLogicBase<PaymentsRepository, IPayment>{
    protected get modelTemplate() : IPayment {
        return {
            id: "",
            created: new Date(),
            modified: new Date(),
            deleted: false,
            userId: "",
            invoiceLineItemId: "",
            companyId: "",
            dated: new Date(),
            amount: 0
        } as IPayment;
    }
    repository = new PaymentsRepository();
    model = { ...this.modelTemplate } as IPayment;


    public async bootstrapAsync(args: {invoiceId: string, payment?: IPayment}){
        this.repository.invoiceId = args.invoiceId;
        if(args.payment){
            this.initialize({model: args.payment});
        }
        await Promise.all([this.fetchInvoiceAsync()]);
    }

    private async fetchInvoiceAsync(){
        await this.proxyRunner.runAsync(async () => {
            this.repository.invoice = await new InvoiceApiService().getSingleByIdAsync({invoiceId: this.repository.invoiceId})

        })
    }

}