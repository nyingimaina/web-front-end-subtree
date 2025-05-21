import BillableItemRepository from "./BillableItemRepository";
import IBillableItem from "../Data/IBillableItem";
import BillableItemApiService from "../Data/BillableItemApiService";
import ModelLogicBase from "@/State/ModelLogicBase";

export default class BillableItemLogic extends ModelLogicBase<
  BillableItemRepository,
  IBillableItem
> {
  protected get modelTemplate(): IBillableItem {
    return {
      displayLabel: "",
    } as IBillableItem;
  }
  repository = new BillableItemRepository();
  model = {} as IBillableItem;

  public get canSave(): boolean {
    return true;
  }

  public async saveAsync(): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      const saveBillableItem =
        await new BillableItemApiService().upsertOrThrowAsync(this.model);
      this.updateModel(saveBillableItem);
    });
  }
}
