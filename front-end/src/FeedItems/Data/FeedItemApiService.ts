import CrudApiService from "@/ApiService/CrudApiService";
import IFeedItem from "./IFeedItem";
import ApiService from "@/ApiService/ApiService";

export default class FeedItemApiService extends CrudApiService<IFeedItem> {
  protected route: string = "FeedItems";

  public async getForCurrentUserAsync(args?: {
    page?: number;
    pageSize?: number;
  }): Promise<IFeedItem[]> {
    const response = await this.getAsync<IFeedItem[]>({
      endpoint: "get-for-current-user",
      paging: {
        page: args?.page ?? 1,
        pageSize: args?.pageSize ?? 10000,
      },
    });

    if (!response) {
      return [];
    }
    const error = ApiService.tryGetAsErrorResponse(response as object);
    if (error) {
      throw new Error(error.message);
    }
    return response as IFeedItem[];
  }
}
