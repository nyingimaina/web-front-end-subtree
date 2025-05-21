import IValidationResponse from "@/web-front-end-subtree/ValidationResponse/Data/IValidationResponse";
import ApiServiceBase from "./ApiServiceBase";
import ApiService from "./ApiService";

export default abstract class CrudApiService<
  T extends object
> extends ApiServiceBase {
  public async upsertOrThrowAsync(model: T): Promise<T> {
    const result = await this.upsertAsync(model);
    if (typeof result === "string") {
      throw new Error(result);
    }
    return result as T;
  }

  public async upsertAsync(model: T): Promise<T | string> {
    const savedResponse = await this.postAsync<IValidationResponse<string>>({
      endpoint: "upsert",
      body: model,
    });
    if (!savedResponse) {
      return "Failed to save";
    }
    const errorResponse = ApiService.tryGetAsErrorResponse(savedResponse);
    if (errorResponse) {
      return errorResponse.message;
    } else {
      const validationResponse = savedResponse as IValidationResponse<string>;

      if ("id" in model) {
        const idValue = (model as any).id;
        if (!idValue || idValue === "00000000-0000-0000-0000-000000000000") {
          // Set the 'id' if it doesn't have a value or is the default GUID
          Reflect.set(model, "id", validationResponse.entity!);
        }
      } else {
        Reflect.set(model, "id", validationResponse.entity!);
      }
      return model;
    }
  }

  public async searchAsync(args: {
    searchText: string;
    page?: number;
    pageSize?: number;
  }): Promise<T[]> {
    const effectiveQueryParams = { ...args };
    delete effectiveQueryParams.page;
    delete effectiveQueryParams.pageSize;
    const result = await this.getAsync<T[]>({
      endpoint: "search",
      queryParams: effectiveQueryParams,
      paging: {
        page: args?.page ?? 1,
        pageSize: args?.pageSize ?? 50,
      },
    });
    if (!result) {
      return [];
    }
    const errorResponse = ApiService.tryGetAsErrorResponse(result);
    if (errorResponse) {
      return [];
    }
    return result as T[];
  }

  public async getPageOrThrowAsync(args?: {
    page?: number;
    pageSize?: number;
  }): Promise<T[]> {
    const results = await this.getPage(args);
    if (results === typeof "string") {
      throw new Error(results);
    } else {
      return results as T[];
    }
  }

  public async getPage(args?: {
    page?: number;
    pageSize?: number;
  }): Promise<T[] | string> {
    const result = await this.getAsync<T[]>({
      endpoint: "get-page",
      paging: {
        page: args?.page ?? 1,
        pageSize: args?.pageSize ?? 10000,
      },
    });
    if (!result) {
      return `Unable to get page from route ${this.route}`;
    }
    const errorResponse = ApiService.tryGetAsErrorResponse(result);
    if (errorResponse) {
      return errorResponse.message;
    }
    return result as T[];
  }
}
