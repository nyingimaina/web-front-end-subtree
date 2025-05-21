import { Industries } from "@/Companies/Data/Industries";
import PropertyManagementSidebarAdapter from "../../PropertyManagement/Account/UI/PropertyManagementSidebarAdapter";
import IndustrySidebarAdapter from "./IIndustrySidebarAdapter";
import OtherSidebarAdapter from "../../Other/OtherSidebarAdapter";
import AuthenticatedUserTracker from "@/Account/AuthenticatedUserTracker";

export default class SidebarAdapters {
  private static adapters: Record<Industries, IndustrySidebarAdapter> = {
    "Property Management Company": new PropertyManagementSidebarAdapter(),
    Other: new OtherSidebarAdapter(),
  };

  public getAdapter(args: {
    industry: Industries;
    companyId?: string;
  }): IndustrySidebarAdapter {
    if (!args.companyId) {
      args.companyId = AuthenticatedUserTracker.authenticatedUser?.companyId!;
    }
    let adapter: IndustrySidebarAdapter = SidebarAdapters.adapters["Other"];
    if (Object.keys(SidebarAdapters.adapters).includes(args.industry)) {
      adapter = SidebarAdapters.adapters[args.industry];
    }
    adapter.environment = {
      basePath: "/industries/",
      companyId: args.companyId,
    };
    return adapter;
  }
}
