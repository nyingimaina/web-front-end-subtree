import IIndustryEnvironment from "./IIndustryEnvironment";
import IIndustryNodeDescriber from "./IIndustryNodeDescriber";

export default abstract class IndustrySidebarAdapter {
  environment: IIndustryEnvironment =
    undefined as unknown as IIndustryEnvironment;
  abstract industryNodes: IIndustryNodeDescriber[];

  getFullPath(args: { relativePath: string }): string {
    const hasLeadingSlash = args.relativePath.startsWith("/");
    return `${this.environment.basePath}${hasLeadingSlash ? "" : "/"}${
      args.relativePath
    }`;
  }
}
