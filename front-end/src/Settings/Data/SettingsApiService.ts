import ApiServiceBase from "@/ApiService/ApiServiceBase";
import ApiService from "@/ApiService/ApiService";
import ISetting from "./ISetting";
import SettingKeys from "./SettingKeys";
import SettingsOwners from "./SettingsOwners";

export default class SettingsApiService extends ApiServiceBase {
  protected route = "settings";

  public async getSettingsAsync(): Promise<ISetting[] | string> {
    const result = await this.getAsync<ISetting[]>({
      endpoint: "get-settings",
    });

    if (!result) {
      return "Failed to fetch settings";
    }

    const errorResponse = ApiService.tryGetAsErrorResponse(result);
    if (errorResponse) {
      return errorResponse.message;
    }

    return result as ISetting[];
  }

  public async setSettingsAsync(args: {
    settings: ISetting[];
  }): Promise<string | undefined> {
    const result = await this.postAsync<void>({
      endpoint: "set-settings",
      body: args.settings,
    });

    if (!result) {
      return undefined;
    }

    const errorResponse = ApiService.tryGetAsErrorResponse(result);
    if (errorResponse) {
      return errorResponse.message;
    }

    return undefined;
  }

  public async getSettingsByOwnerAndKeysAsync(args: {
    owner: SettingsOwners;
    keys: SettingKeys[];
    companyId: string;
  }): Promise<ISetting[]> {
    const keysQueryParams = this.generateListQueryParam({
      name: "keys",
      values: args.keys,
    });
    const result = await this.getOrThrowAsync<ISetting[]>({
      endpoint: `get-settings-by-owner-and-keys?companyId=${args.companyId}&owner=${args.owner}&${keysQueryParams}`,
    });

    return result;
  }
}
