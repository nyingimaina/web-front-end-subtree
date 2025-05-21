import ModuleStateManager from "module-state-manager";
import ContactRepository from "./ContactRepository";
import IContact from "../Data/IContact";
import ContactAddressTypeNames from "@/ContactAddresses/Data/ContactAddressTypeNames";
import IContactAddress from "@/ContactAddresses/Data/IContactAddress";
import ArSh from "@/ArSh/ArSh";
import CustomerApiService from "../Data/ContactsApiService";
import ContactTypeNames from "@/ContactTypes/Data/ContactTypeNames";

export default class ContactLogic extends ModuleStateManager<
  ContactRepository,
  IContact
> {
  repository = new ContactRepository();
  model = {} as IContact;
  private customerTemplate = {
    customerAddresses: ([] = [
      {
        value: "",
        addressType: "PhoneNumber",
        created: new Date(),
      } as IContactAddress,
      {
        value: "",
        addressType: "Email",
        created: new Date(),
      } as IContactAddress,
    ]),
  } as unknown as IContact;

  public initialize(args: {
    contact?: IContact;
    contactType: ContactTypeNames;
  }) {
    if (args.contact) {
      args.contact.contactType = args.contactType;
    }
    this.updateModel({ ...this.customerTemplate, ...args.contact });

    this.updateRepository({ initialized: true });
  }

  public get canSave() {
    return this.model &&
      ArSh.isNotEmpty(this.model.contactAddresses) &&
      this.model.contactAddresses.some((a) => (a.value ? true : false)) &&
      this.model.displayLabel
      ? true
      : false;
  }

  public async saveAsync() {
    try {
      this.updateRepository({ busy: true });
      const savedModel = await new CustomerApiService().upsertOrThrowAsync(
        this.model
      );
      this.updateModel(savedModel);
    } finally {
      this.updateRepository({ busy: false });
    }
  }

  public getFirstAddressByType(args: {
    addressType: ContactAddressTypeNames;
  }): IContactAddress {
    if (!this.model.contactAddresses) {
      this.model.contactAddresses = [];
    }
    const target = ArSh.getFirst({
      arr: this.model.contactAddresses,
      matcher: (a) => a.addressType === args.addressType,
      onNotFound: () => {
        return {
          addressType: args.addressType,
          value: "",
        } as IContactAddress;
      },
      sorter(a, b) {
        return a.created.getTime() < b.created.getTime() ? -1 : 1;
      },
    });
    return target;
  }
}
