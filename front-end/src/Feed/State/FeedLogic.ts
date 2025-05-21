import ModuleStateManager from "module-state-manager";
import FeedRepository from "./FeedRepository";
import FeedItemApiService from "@/FeedItems/Data/FeedItemApiService";

export default class FeedLogic extends ModuleStateManager<FeedRepository> {
  repository: FeedRepository = new FeedRepository();
  model = {};

  public async initializeAsync() {
    await Promise.all([this.getForCurrentUserAsync()]);
    this.rerender();
  }

  private async getForCurrentUserAsync() {
    this.repository.feedItems =
      await new FeedItemApiService().getForCurrentUserAsync();
  }
}
