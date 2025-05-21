import ApiService from "./ApiService";
import CachedDataNames from "./Caching/CachedDataNames";
import LocalCache from "./Caching/LocalCache";
import ErrorResponseHandler from "./ErrorResponseHandler";
import IErrorResponse from "./IErrorResponse";

export default abstract class ApiServiceBase {
  protected abstract route: string;

  private apiService = new ApiService();

  // Helper method to build full endpoint URL
  /**
   * Builds a full URL endpoint with optional query parameters and paging.
   * Ensures correct URL encoding and validates paging constraints.
   *
   * @param args - An object containing the following parameters:
   *   @param args.endpoint - The endpoint path (required, non-empty).
   *   @param args.queryParams - An optional object of query parameters as key-value pairs.
   *      Values can be of types string, number, boolean, or Date.
   *      Dates are automatically formatted to ISO strings for compatibility.
   *   @param args.paging - An optional object defining pagination, containing:
   *      - page: The page number (must be a positive integer).
   *      - pageSize: The number of items per page (must be a positive integer).
   *
   * @returns A complete URL string with query parameters and pagination if provided.
   *
   * @throws Error - Throws an error if `endpoint` is empty.
   * @throws Error - Throws an error if `paging` is provided with either `page` or `pageSize` missing or non-positive.
   *
   * @example
   * ```typescript
   * buildEndpoint({
   *   endpoint: "products",
   *   queryParams: { category: "books", sortBy: "price", isAvailable: true },
   *   paging: { page: 2, pageSize: 10 }
   * });
   * // Returns: "/base/products?category=books&sortBy=price&isAvailable=true&page=2&pageSize=10"
   * ```
   */
  private buildEndpoint(args: {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean | Date>;
    paging?: { page: number; pageSize: number };
  }): string {
    const { endpoint, queryParams, paging } = args;

    if (!endpoint) {
      throw new Error("The 'endpoint' parameter must be a non-empty string.");
    }

    // Ensure the base route ends with a slash for proper concatenation
    const properRoute = this.route.endsWith("/")
      ? this.route
      : `${this.route}/`;

    let url = `${properRoute}${endpoint}`;
    const params = new URLSearchParams();

    // Validate paging constraints
    if (paging) {
      const { page, pageSize } = paging;

      if (!Number.isInteger(page) || page <= 0) {
        throw new Error(
          "The 'page' parameter in 'paging' must be a positive integer."
        );
      }
      if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new Error(
          "The 'pageSize' parameter in 'paging' must be a positive integer."
        );
      }

      // Append paging parameters
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
    }

    // Process additional query parameters, encoding values appropriately
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        let formattedValue;

        if (value instanceof Date) {
          formattedValue = value.toISOString();
        } else {
          if (value) {
            formattedValue = encodeURIComponent(value.toString());
          } else {
            formattedValue = "";
          }
        }

        params.append(key, formattedValue);
      });
    }

    // Append query string to the URL if parameters are present
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  protected getQueryParamsAndPaging<T extends object>(
    args: T
  ): { args: T; paging?: { page: number; pageSize: number } } {
    const justQueryParams = { ...args };

    let paging: { page: number; pageSize: number } | undefined;
    if ("page" in args && "pageSize" in args) {
      const page = Number((args as any).page);
      const pageSize = Number((args as any).pageSize);

      paging = {
        page: page > 0 ? page : 1,
        pageSize: pageSize > 0 ? pageSize : 10,
      };
    }

    delete (justQueryParams as any).page;
    delete (justQueryParams as any).pageSize;

    return { args: justQueryParams, paging };
  }

  // DRY method to handle API requests
  private async executeRequest<T>(
    method: "get" | "post",
    args: {
      endpoint: string;
      body?: object;
      headers?: Record<string, string>;
      queryParams?: Record<string, string | number | boolean | Date>;
      paging?: { page: number; pageSize: number };
      cacheKey?: CachedDataNames;
    }
  ): Promise<T | undefined | IErrorResponse> {
    const fullEndpoint = this.buildEndpoint(args);

    if (method === "get") {
      if (args.cacheKey) {
        const cachedValue = LocalCache.get<T>(args.cacheKey);
        if (cachedValue) {
          return cachedValue;
        }
      }
      const fetchedValue = (await this.apiService.get({
        endpoint: fullEndpoint,
        headers: args.headers,
      })) as T | undefined | IErrorResponse;

      const validValue =
        ErrorResponseHandler.getResponseOrThrowError<T>(fetchedValue);
      if (validValue && args.cacheKey) {
        LocalCache.set(args.cacheKey, validValue);
      }
      return validValue;
    } else if (method === "post") {
      return await this.apiService.post({
        endpoint: fullEndpoint,
        body: args.body || {},
        headers: args.headers,
      });
    }
  }

  // Public GET request method
  protected async getAsync<T>(args: {
    endpoint: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | Date>;
    paging?: { page: number; pageSize: number };
    cacheKey?: CachedDataNames;
  }): Promise<T | undefined | IErrorResponse> {
    return this.executeRequest<T>("get", args);
  }

  protected async getOrThrowAsync<T>(args: {
    cacheKey?: CachedDataNames;
    endpoint: string;
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | Date>;
    paging?: { page: number; pageSize: number };
  }): Promise<T> {
    const result = await this.getAsync<T>(args);
    return ErrorResponseHandler.getResponseOrThrowError<T>(result)!;
  }

  // Public POST request method
  protected async postAsync<U>(args: {
    endpoint: string;
    body: object;
    headers?: Record<string, string>;
  }): Promise<U | undefined | IErrorResponse> {
    return this.executeRequest<U>("post", args);
  }

  protected async postOrThrowAsync<U>(args: {
    endpoint: string;
    body: object;
    headers?: Record<string, string>;
  }): Promise<U> {
    const result = await this.executeRequest<U>("post", args);
    return ErrorResponseHandler.getResponseOrThrowError<U>(result)!;
  }

  protected generateListQueryParam<T>(args: {
    name: string;
    values: T[];
  }): string {
    return this.apiService.generateListQueryParam(args);
  }

  protected async downloadFileAsync(args: {
    endpoint: string;
    filename: string;
  }) {
    const blob = await this.apiService.downloadFile(args);
    if (blob) {
      this.apiService.downloadBlobToDisk(blob, args.filename);
    }
  }
}
