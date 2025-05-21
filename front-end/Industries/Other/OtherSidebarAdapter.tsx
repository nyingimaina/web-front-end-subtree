import IIndustryNodeDescriber from "../_Integration/Account/IIndustryNodeDescriber";
import IndustrySidebarAdapter from "../_Integration/Account/IIndustrySidebarAdapter";

export default class OtherSidebarAdapter extends IndustrySidebarAdapter {
  public get industryNodes(): IIndustryNodeDescriber[] {
    return [];
  }
}
