import LogicBase from "@/State/LogicBase";
import AccountRepository from "./AccountRepository";
import CompanyApiService from "@/Companies/Data/CompanyApiService";
import AuthenticatedUserTracker from "../AuthenticatedUserTracker";
import ICompany from "@/Companies/Data/ICompany";

export default class AccountLogic extends LogicBase<AccountRepository>{
    repository = new AccountRepository();
    model = {};



    public async initializeAsync(): Promise<void> {
        await this.proxyRunner.runAsync(async () => {
            await this.fetchCompanyAsync();
        });
    }

    private async fetchCompanyAsync(){
        const companyId = AuthenticatedUserTracker.authenticatedUser?.companyId;
        this.repository.company = await new CompanyApiService().getByIdAsync(
            {id: companyId!}
        ) as ICompany;
    }
}