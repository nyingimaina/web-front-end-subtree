import RepositoryBase from "@/State/RepositoryBase";
import IPropManUnit from "../../Units/Data/IPropManUnit";
import ICompany from "@/Companies/Data/ICompany";

export default class UnitsListRepository extends RepositoryBase {
  companyId: string = "";
  company = {} as ICompany;
}
