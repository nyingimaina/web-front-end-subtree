import IIndustryEnvironment from "../../../_Integration/Account/IIndustryEnvironment";
import IIndustryNodeDescriber from "../../../_Integration/Account/IIndustryNodeDescriber";
import IndustrySidebarAdapter from "../../../_Integration/Account/IIndustrySidebarAdapter";
import { IconBuilding } from "@/IconsLibrary/Icons";

export default class PropertyManagementSidebarAdapter extends IndustrySidebarAdapter {
  public get industryNodes(): IIndustryNodeDescriber[] {
    return [
      {
        displayLabel: "Units",
        permissions: ["AddPayments", "CreateInvoices", "ViewAccountStatements"],
        onClick: () => {
          const fullPath = this.getFullPath({
            relativePath: `property-management/units/list/${
              this.environment!.companyId
            }`,
          });
          window.location.href = fullPath;
        },
        icon: <IconBuilding />,
      },
    ];
  }
}
