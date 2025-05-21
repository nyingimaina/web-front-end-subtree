import LogicBase from "@/State/LogicBase";
import SettingsRepository from "./SettingsRepository";
import SettingsApiService from "../Data/SettingsApiService";
import ISetting from "../Data/ISetting";
import SettingsOwners from "../Data/SettingsOwners";
import SettingKeys from "../Data/SettingKeys";
import ArSh from "@/ArSh/ArSh";

interface ISettingsModel {
  selectedKey?: string;
}

export default class SettingsLogic extends LogicBase<
  SettingsRepository,
  ISettingsModel
> {
  repository = new SettingsRepository();
  private apiService = new SettingsApiService();
  model: ISettingsModel = this.modelTemplate;

  protected get modelTemplate(): ISettingsModel {
    return {
      selectedKey: undefined,
    };
  }

  public async loadSettingsAsync(): Promise<string | undefined> {
    return await this.proxyRunner.runAsync(async () => {
      const result = await this.apiService.getSettingsAsync();
      if (typeof result === "string") {
        return result;
      }

      this.repository.settings = result;
      this.updateRepository({});
      return undefined;
    });
  }

  public async saveSettingsAsync(): Promise<string | undefined> {
    return await this.proxyRunner.runAsync(async () => {
      const result = await this.apiService.setSettingsAsync({
        settings: this.repository.settings,
      });
      if (result) {
        return result;
      }

      this.repository.settings = this.repository.settings;
      this.updateRepository({ isDirty: false });
      return undefined;
    });
  }

  public getSettingByOwnerAndKey(args: {
    owner: SettingsOwners;
    key: SettingKeys;
  }): ISetting | undefined {
    return this.repository.settings.find(
      (s) =>
        s.owner.toLowerCase() === args.owner.toLowerCase() &&
        s.key.toLowerCase() === args.key.toLowerCase()
    );
  }

  public async updateSetting(args: {
    owner: SettingsOwners;
    key: SettingKeys;
    value: string;
  }) {
    const setting = this.getSettingByOwnerAndKey({
      owner: args.owner,
      key: args.key,
    }) ?? {
      owner: args.owner,
      key: args.key,
      value: args.value,
    };

    setting.value = args.value;
    ArSh.upsertItem({
      arr: this.repository.settings,
      item: setting,
      matcher(a, b) {
        return (
          a.key.toLocaleLowerCase() === b.key.toLocaleLowerCase() &&
          a.owner.toLocaleLowerCase() === b.owner.toLocaleLowerCase()
        );
      },
      onCompletion: () => this.updateRepository({ isDirty: true }),
    });
  }
}
