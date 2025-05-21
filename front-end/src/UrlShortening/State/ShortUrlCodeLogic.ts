import LogicBase from "@/State/LogicBase";
import ShortUrlCodeRepository from "./ShortUrlCodeRepository";
import ShortUrlCodeApiService from "../Data/ShortUrlCodeApiService";

export default class ShortUrlCodeLogic extends LogicBase<ShortUrlCodeRepository> {
  repository = new ShortUrlCodeRepository();

  async initializeAsync(args: { shortUrlCode: string }) {
    await this.proxyRunner.runAsync(async () => {
      this.repository.shortUrlCode =
        await new ShortUrlCodeApiService().getByCodeAsync({
          code: args.shortUrlCode,
        });
    });
  }
}
