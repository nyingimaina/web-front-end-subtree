import LogicBase from "@/State/LogicBase";
import PropManUnitContactRepository from "./PropManUnitContactRepository";
import IPropManUnitContact from "../Data/IPropManUnitContact";
import PropManUnitContactsApiService from "../Data/PropManUnitContactsApiService";

export default class PropManUnitContactLogic extends LogicBase<
  PropManUnitContactRepository,
  IPropManUnitContact
> {
  repository = new PropManUnitContactRepository();
  model = {} as IPropManUnitContact;

  public async initializeAsync(args: { propManUnitId: string }) {
    await this.proxyRunner.runAsync(async () => {
      this.repository.contacts =
        await new PropManUnitContactsApiService().getByPropManUnitIdAsync({
          propManUnitId: args.propManUnitId,
        });
    });
  }

  public async saveContactAsync(contact: IPropManUnitContact): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      const savedContact =
        await new PropManUnitContactsApiService().upsertOrThrowAsync(contact);
      this.repository.contacts = this.repository.contacts.filter(
        (c) => c.id !== savedContact.id
      );
      this.repository.contacts.push(savedContact);
      this.rerender();
    });
  }

  public get contactList(): IPropManUnitContact[] {
    return this.repository.contacts;
  }
}
