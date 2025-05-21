import CrudApiService from "@/ApiService/CrudApiService";
import IShortUrlCode from "./IShortUrlCode";

export default class ShortUrlCodeApiService extends CrudApiService<IShortUrlCode> {
  protected route: string = "short-codes";

  public async getByCodeAsync(args: {
    code: string;
  }): Promise<IShortUrlCode | undefined> {
    try {
      return await this.getOrThrowAsync<IShortUrlCode>({
        endpoint: "get-by-code",
        queryParams: { code: args.code },
      });
    } catch (error) {
      console.error("GET request error:", error);
      return undefined;
    }
  }
}
