import RepositoryBase from "@/State/RepositoryBase";
import ISetting from "../Data/ISetting";

export default class SettingsRepository extends RepositoryBase {
  public settings: ISetting[] = [];
  public isDirty = false;
}
