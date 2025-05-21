import ModuleStateManager from "module-state-manager";
import Paginator from "../../../Pagination/Paginator";
import ICompany from "../Data/ICompany";
import CompanyApiService from "../Data/CompanyApiService";
import CompaniesRepository from "./CompaniesRepository";
import CompanyTypes from "../Data/CompanyTypes";
import ArSh from "@/ArSh/ArSh";

export default class CompaniesLogic extends ModuleStateManager<
  CompaniesRepository,
  object
> {
  repository = new CompaniesRepository();
  model = {};

  public paginator = new Paginator<ICompany>({
    fetchFunction: async (page, pageSize) => {
      const result = await new CompanyApiService().getPage({
        paging: {
          page: page,
          pageSize: pageSize,
        },
      });
      this.updateRepository({ companies: result });
      return result;
    },
    onPageChanged: () => {
      try {
        this.rerender();
      } catch (e) {
        console.error(`Rerender failed on page change`);
        console.error(e);
      }
    },
    initialPage: 1,
    initialPageSize: 10,
  });

  public canEditCompany(company: ICompany): boolean {
    const notEditable: CompanyTypes[] = ["Back Office"];
    return !notEditable.some(
      (a) => a.toLocaleLowerCase() === company.companyType.toLocaleLowerCase()
    );
  }

  public async saveAsync(company: ICompany): Promise<string | undefined> {
    const saveResult = await new CompanyApiService().upsertAsync(company);
    if (saveResult == typeof "string") {
      return saveResult;
    } else {
      const savedCompany = saveResult as ICompany;
      this.repository.companies = this.repository.companies.filter(
        (a) => a.id !== savedCompany.id
      );
      this.repository.companies.splice(0, 0, savedCompany);
      this.updateRepository({});
    }
  }

  public async rotateApiKeyAsync(companyId: string): Promise<void> {
    const targetCompany = this.repository.companies.find(
      (a) => a.id === companyId
    );
    if (!targetCompany) {
      return;
    }
    const updatedCompany = await new CompanyApiService().rotateApiKeyAsync({
      companyId,
    });

    targetCompany.apiKey = updatedCompany.apiKey;
    ArSh.upsertItem({
      arr: this.repository.companies,
      item: targetCompany,
      matcher: (a, b) => a.id === b.id,
      onCompletion: () => this.rerender(),
    });
  }
}
