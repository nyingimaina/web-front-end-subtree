import LogicBase from "@/State/LogicBase";
import { IUnreleasedPropManUnitContact } from "../Data/IUnreleasedPropManUnitContact";
import UnreleasedPropManUnitContactRepository from "./UnreleasedPropManUnitContactRepository";

export default class UnreleasedPropManUnitContactLogic extends LogicBase<
  UnreleasedPropManUnitContactRepository,
  IUnreleasedPropManUnitContact
> {
  repository = new UnreleasedPropManUnitContactRepository();
  // Add any specific logic for this submodule here
}
