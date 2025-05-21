import CrudApiService from "@/ApiService/CrudApiService";
import IActionedTelexReleaseRequest from "./IActionedTelexReleaseRequest";

export default class ActionedTelexReleaseRequestApiService extends CrudApiService<IActionedTelexReleaseRequest> {
  protected route: string = "actioned-telex-release-requests";

  public async cancel(args: {
    telexReleaseRequestBatchHouseBillOfLadingNumberId: string;
  }): Promise<void> {
    await this.getOrThrowAsync({
      endpoint: "cancel",
      queryParams: {
        telexReleaseRequestBatchHouseBillOfLadingNumberId:
          args.telexReleaseRequestBatchHouseBillOfLadingNumberId,
      },
    });
  }
}
