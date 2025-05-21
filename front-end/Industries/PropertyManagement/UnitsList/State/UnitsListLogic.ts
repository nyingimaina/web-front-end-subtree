import LogicBase from "@/State/LogicBase";
import UnitsListRepository from "./UnitsListRepository";
import IPropManUnit from "../../Units/Data/IPropManUnit";
import PropManUnitApiService from "../../Units/Data/PropManUnitApiService";
import Paginator from "@/Pagination/Paginator";
import CompanyApiService from "@/Companies/Data/CompanyApiService";
import ICompany from "@/Companies/Data/ICompany";

export default class UnitsListLogic extends LogicBase<
  UnitsListRepository,
  IPropManUnit
> {
  repository = new UnitsListRepository();
  model = {} as IPropManUnit;
  public paginator = new Paginator<IPropManUnit>({
    fetchFunction: async (args) => {
      return await this.proxyRunner.runAsync(async () => {
        const result = await new PropManUnitApiService().getByCompanyIdAsync({
          page: args.page,
          pageSize: args.pageSize,
          companyId: this.repository.companyId,
        });
        return result;
      });
    },
    onPageChanged: () => {
      this.rerender();
    },
    initialPage: 1,
    initialPageSize: 20,
  });

  async initializeAsync(args: { companyId: string }) {
    this.repository.companyId = args.companyId;

    await this.proxyRunner.runAsync(async () => {
      await Promise.all([
        this.fetchCompanyAsync({ companyId: args.companyId }),
        this.paginator.fetchPage(),
      ]);
    });
  }

  async fetchCompanyAsync(args: { companyId: string }) {
    const company = await new CompanyApiService().getByIdAsync({
      id: args.companyId,
    });
    this.repository.company = company as ICompany;
  }
}
