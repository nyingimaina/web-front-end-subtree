import LogicBase from "@/State/LogicBase";
import PropManUnitRepository from "./PropManUnitRepository";
import IPropManUnit from "../Data/IPropManUnit";
import PropManUnitApiService from "../Data/PropManUnitApiService";
import ArSh from "@/ArSh/ArSh";
import IPropManUnitContact from "../../PropManUnitContacts/Data/IPropManUnitContact";
import PropManUnitContactsApiService from "../../PropManUnitContacts/Data/PropManUnitContactsApiService";
import PropManUnitContactReleaseApiService from "../../PropManUnitContactReleases/Data/PropManUnitContactReleaseApiService";
import Statics from "../../../../Statics";

export default class PropManUnitLogic extends LogicBase<
  PropManUnitRepository,
  IPropManUnit
> {
  async saveAsync() {
    await this.proxyRunner.runAsync(async () => {
      const result = await new PropManUnitApiService().upsertOrThrowAsync(
        this.model
      );
    });
  }
  repository = new PropManUnitRepository();

  public async initializeAsync(args: { propManUnitId?: string }) {
    await this.proxyRunner.runAsync(async () => {
      if (args.propManUnitId) {
        await Promise.all([
          this.fetchPropManUnitAsync({ propManUnitId: args.propManUnitId }),
          //   this.fetchContactsAsync({ propManUnitId: args.propManUnitId }),
        ]);
      }
      if (ArSh.isEmpty(this.model.propManUnitContacts)) {
        this.model.propManUnitContacts = [];
      }
    });
  }

  public queueContact(contact: IPropManUnitContact) {
    this.model.propManUnitContacts.push(contact);
  }

  public async removeContactAsync(
    contact: IPropManUnitContact
  ): Promise<boolean> {
    const succeeded = await this.proxyRunner.runAsync(async () => {
      const result =
        await new PropManUnitContactReleaseApiService().upsertOrThrowAsync({
          propManUnitContactId: contact.id,
          releaseDate: new Date(),
          id: Statics.defaultv4Guid,
        });

      if (!result.id) {
        return false;
      }
      const indexOfContact = this.model.propManUnitContacts.findIndex(
        (c) => c.id === contact.id
      );
      if (indexOfContact !== -1) {
        this.model.propManUnitContacts.splice(indexOfContact, 1);
      }
      return true;
    });
    return succeeded;
  }

  public async upsertContactAsync(contact: IPropManUnitContact): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      const savedContact =
        await new PropManUnitContactsApiService().upsertOrThrowAsync(contact);
      const indexOfContact = this.model.propManUnitContacts.findIndex(
        (c) => c.id === savedContact.id
      );
      if (indexOfContact !== -1) {
        this.model.propManUnitContacts[indexOfContact] = savedContact;
      } else {
        this.model.propManUnitContacts.push(savedContact);
      }

      this.rerender();
    });
  }

  private async fetchPropManUnitAsync(args: { propManUnitId: string }) {
    const result = await new PropManUnitApiService().getSingleByIdAsync({
      propManUnitId: args.propManUnitId,
    });
    this.model = result ?? {
      displayLabel: "",
    };
  }

  //   private async fetchContactsAsync(args: { propManUnitId: string }) {
  //     this.repository.propManUnitContacts =
  //       await new PropManUnitContactsApiService().getByPropManUnitIdAsync({
  //         propManUnitId: args.propManUnitId,
  //       });
  //   }
}
