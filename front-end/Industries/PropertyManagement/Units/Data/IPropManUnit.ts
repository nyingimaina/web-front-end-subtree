import IPropManUnitContact from "../../PropManUnitContacts/Data/IPropManUnitContact";

export default interface IPropManUnit {
  id: string;
  displayLabel: string;
  companyId: string;
  modified: Date;
  propManUnitContacts: IPropManUnitContact[];
  balance: number;
}
