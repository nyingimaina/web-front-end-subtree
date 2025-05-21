import RepositoryBase from "@/State/RepositoryBase";
import IPropManUnitContact from "../Data/IPropManUnitContact";

export default class PropManUnitContactRepository extends RepositoryBase {
  contacts: IPropManUnitContact[] = [];
}
