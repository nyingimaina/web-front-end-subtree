import ApiServiceBase from "@/ApiService/ApiServiceBase";
import ICompany from "./ICompany";
import IErrorResponse from "@/ApiService/IErrorResponse";
import ApiService from "@/ApiService/ApiService";
import IValidationResponse from "@/ValidationResponse/Data/IValidationResponse";

export default class CompanyApiService extends ApiServiceBase {
  protected route = "companies";

  public async upsertAsync(company: ICompany): Promise<ICompany | string> {
    const savedResponse = await this.postAsync<IValidationResponse<string>>({
      endpoint: "upsert",
      body: company,
    });
    if (!savedResponse) {
      return "Failed to save";
    }
    const errorResponse = ApiService.tryGetAsErrorResponse(savedResponse);
    if (errorResponse) {
      return errorResponse.message;
    } else {
      const validationResponse = savedResponse as IValidationResponse<string>;
      company.id = validationResponse.entity!;
      return company;
    }
  }

  public async getByIdAsync(args: { id: string }): Promise<ICompany | string> {
    if (!args.id) return "No id provided";
    const result = await this.getAsync<ICompany>({
      endpoint: "get-by-id",
      queryParams: {
        id: args.id,
      },
      cacheKey: "Company",
    });
    if (!result) {
      return "Unspecified error occured";
    }
    if (ApiService.isErrorResponse(result)) {
      return (
        ApiService.tryGetAsErrorResponse(result!)?.message ?? "Error Occured"
      );
    } else {
      return result as ICompany;
    }
  }

  public async getPage(args: {
    paging?: {
      page: number;
      pageSize: number;
    };
  }): Promise<ICompany[]> {
    const result = await this.getAsync({
      endpoint: "get-page",
      paging: args.paging,
    });

    if (!result) {
      return [];
    }
    if (ApiService.isErrorResponse(result)) {
      throw new Error((result as IErrorResponse).message);
    }
    return result as ICompany[];
  }

  public async rotateApiKeyAsync(args: {
    companyId: string;
  }): Promise<ICompany> {
    const result = await this.getOrThrowAsync<ICompany>({
      endpoint: "rotate-api-key",
      queryParams: { companyId: args.companyId },
    });
    return result;
  }
}
