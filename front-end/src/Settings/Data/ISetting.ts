import SettingKeys from "./SettingKeys";
import SettingsOwners from "./SettingsOwners";

export default interface ISetting {
  id: number;
  owner: SettingsOwners;
  key: SettingKeys;
  value: string;
}
