import CompanyTypes from "./CompanyTypes";
import { Industries } from "./Industries";

export default interface ICompany {
  id: string;
  modified: Date;
  name: string;
  companyType: CompanyTypes;
  industry: Industries;
  apiKey: string;
}
