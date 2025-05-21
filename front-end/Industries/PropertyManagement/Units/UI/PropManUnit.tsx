import PropManUnitLogic from "../State/PropManUnitLogic";
import { Form, FormControlGroup, FormLabel } from "@/Forms/Form/UI/Form";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PropManUnitContactType from "../../PropManUnitContacts/Data/PropManUnitContactTypes";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import IPropManUnitContact from "../../PropManUnitContacts/Data/IPropManUnitContact";
import BasicModal from "@/Modals/UI/BasicModal";
import IContactAddress from "@/ContactAddresses/Data/IContactAddress";
import styles from "../Styles/PropManUnit.module.css";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import FastLayout from "@/layouts/ui/FastLayout";
import ConfirmationModal from "@/Modals/UI/ConfirmationModal";
import ContactAddressTypeNames from "@/ContactAddresses/Data/ContactAddressTypeNames";
import { PureComponent, ReactNode } from "react";

interface IProps {
  propManUnitId: string;
}

interface IState {
  propManUnitContactForEditModal?: IPropManUnitContact;
  propManUnitContactForRemoveModal?: IPropManUnitContact;
}

const logic = new PropManUnitLogic();
export default class PropManUnit extends PureComponent<IProps, IState> {
  state = {} as IState;

  private closeModal = () =>
    this.setState({ propManUnitContactForEditModal: undefined });

  addContactAddress = (value: string, addressType: ContactAddressTypeNames) => {
    this.setState((prevState) => {
      if (!prevState.propManUnitContactForEditModal) {
        return prevState; // Ensure the object exists before modifying
      }

      return {
        propManUnitContactForEditModal: {
          ...prevState.propManUnitContactForEditModal,
          contactAddresses: [{ value, addressType } as IContactAddress], // Overwrite with a single item
        },
      };
    });
  };

  editContactAddress = (
    value: string,
    addressType: ContactAddressTypeNames
  ) => {
    const contactAddresses =
      this.state.propManUnitContactForEditModal?.contactAddresses;
    if (!contactAddresses) return; // Ensure the array exists before modifying
    const targetAddress = contactAddresses.find(
      (x: IContactAddress) => x.addressType === addressType
    );
    if (targetAddress) {
      targetAddress.value = value;
      this.forceUpdate();
    }
  };

  private getRemovalLabel(propManUnitContact: IPropManUnitContact) {
    return propManUnitContact.propManUnitContactType === "Owner"
      ? "Remove Owner"
      : "Vacate Tenant";
  }

  private get confirmRemovalModal(): ReactNode {
    if (!this.state.propManUnitContactForRemoveModal) return null;
    const onClose = () => {
      this.setState({ propManUnitContactForRemoveModal: undefined });
    };
    return (
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        title={`Remove ${
          this.state.propManUnitContactForRemoveModal!.displayLabel
        }`}
        onConfirm={async () => {
          const succeeded = await logic.removeContactAsync(
            this.state.propManUnitContactForRemoveModal!
          );
          return succeeded;
        }}
        cancelButtonLabel={`Keep ${
          this.state.propManUnitContactForRemoveModal!.propManUnitContactType
        }`}
        confirmButtonLabel={this.getRemovalLabel(
          this.state.propManUnitContactForRemoveModal!
        )}
      >
        Would you like to remove{" "}
        {this.state.propManUnitContactForRemoveModal!.displayLabel} as{" "}
        {this.state.propManUnitContactForRemoveModal!.propManUnitContactType}{" "}
        from unit {logic.model.displayLabel}?
      </ConfirmationModal>
    );
  }

  private get editContactModal(): ReactNode {
    if (!this.state.propManUnitContactForEditModal) return null;
    const isExistingContact =
      this.state.propManUnitContactForEditModal.id &&
      this.state.propManUnitContactForEditModal.propManUnitId
        ? true
        : false;

    return (
      <BasicModal
        isOpen={true}
        onClose={() => this.closeModal()}
        title={`Manage ${this.state.propManUnitContactForEditModal.propManUnitContactType}`}
      >
        <Form>
          <FormControlGroup>
            <FormLabel>Name</FormLabel>

            <WebShellTextBox
              type="text"
              value={this.state.propManUnitContactForEditModal.displayLabel}
              onChange={(e) => {
                this.setState({
                  propManUnitContactForEditModal: {
                    ...this.state.propManUnitContactForEditModal!,
                    displayLabel: e.target.value,
                  },
                });
              }}
              placeholder="Name"
              required={true}
            />
          </FormControlGroup>
          <FormControlGroup>
            <FormLabel>Phone Number</FormLabel>

            <WebShellTextBox
              type="tel"
              onChange={(e) => {
                if (isExistingContact) {
                  this.editContactAddress(e.target.value, "PhoneNumber");
                } else {
                  this.addContactAddress(e.target.value, "PhoneNumber");
                }
              }}
              value={
                this.state.propManUnitContactForEditModal.contactAddresses[0]
                  ?.value
              }
              placeholder="Phone Number"
              required={true}
            />
          </FormControlGroup>
          <HorizontalDivider />
          <ActionPanel>
            <WebShellButton
              buttonType="positive"
              onClick={async () => {
                if (isExistingContact) {
                  await logic.upsertContactAsync(
                    this.state.propManUnitContactForEditModal!
                  );
                } else {
                  await logic.queueContact(
                    this.state.propManUnitContactForEditModal!
                  );
                }
                this.closeModal();
              }}
            >
              {isExistingContact ? "Edit" : "Add"}
            </WebShellButton>
          </ActionPanel>
        </Form>
      </BasicModal>
    );
  }

  private get modals(): ReactNode {
    return (
      <>
        {this.editContactModal}
        {this.confirmRemovalModal}
      </>
    );
  }

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync({ propManUnitId: this.props.propManUnitId });
  }

  private getTabContent(args: {
    propManUnitContactType: PropManUnitContactType;
  }): ReactNode {
    return (
      <>
        <ActionPanel>
          <WebShellButton
            buttonType="positive"
            onClick={() => {
              this.setState({
                propManUnitContactForEditModal: {
                  propManUnitContactType: args.propManUnitContactType,
                  contactType: "Customer",
                  contactAddresses: [],
                } as unknown as IPropManUnitContact,
              });
            }}
            disabled={logic.model.displayLabel ? false : true}
          >
            Add {args.propManUnitContactType}
          </WebShellButton>
        </ActionPanel>

        <HorizontalDivider />
        <ResponsiveTable
          data={logic.model.propManUnitContacts?.filter(
            (x) => x.propManUnitContactType === args.propManUnitContactType
          )}
          columnDefinitions={[
            GetRowNumberColumn(),
            {
              displayLabel: <div>Name</div>,
              cellRenderer: (item) => <div>{item.displayLabel}</div>,
            },
            {
              displayLabel: <div>Contacts</div>,
              cellRenderer: (item) => (
                <div>
                  <ul>
                    {item.contactAddresses.map((x, index) => (
                      <li key={index}>{x.value}</li>
                    ))}
                  </ul>
                </div>
              ),
            },
            {
              displayLabel: <div className={styles.rightAlign}>Actions</div>,
              cellRenderer: (item) => (
                <ActionPanel>
                  <WebShellButton
                    buttonType="positive"
                    onClick={() => {
                      this.setState({
                        propManUnitContactForEditModal: item,
                      });
                    }}
                  >
                    Edit
                  </WebShellButton>
                  <WebShellButton
                    buttonType="negative"
                    onClick={() => {
                      this.setState({
                        propManUnitContactForRemoveModal: item,
                      });
                    }}
                  >
                    {this.getRemovalLabel(item)}
                  </WebShellButton>
                </ActionPanel>
              ),
            },
          ]}
        />
      </>
    );
  }

  render() {
    return (
      <FastLayout title="Unit Management">
        <FrostedGlassOverlay show={logic.repository.busy}>
          <Form>
            <FormControlGroup>
              <FormLabel>Unit Name</FormLabel>

              <WebShellTextBox
                onChange={(e) => {
                  logic.updateModel({
                    displayLabel: e.target.value,
                  });
                }}
                value={logic.model.displayLabel}
                required={true}
                type="text"
                placeholder="Unit Name"
              />
            </FormControlGroup>
            <HorizontalDivider />

            <FormControlGroup>
              <Tabs>
                <TabList>
                  <Tab>Owner(s)</Tab>
                  <Tab>Tenant</Tab>
                </TabList>
                <TabPanel>
                  {this.getTabContent({
                    propManUnitContactType: "Owner",
                  })}
                </TabPanel>
                <TabPanel>
                  {this.getTabContent({
                    propManUnitContactType: "Tenant",
                  })}
                </TabPanel>
              </Tabs>
            </FormControlGroup>
            <HorizontalDivider />

            <ActionPanel>
              <WebShellButton
                buttonType="positive"
                onClick={() => {
                  logic.saveAsync();
                }}
                isDefault={true}
              >
                Save
              </WebShellButton>
            </ActionPanel>
          </Form>
          {this.modals}
        </FrostedGlassOverlay>
      </FastLayout>
    );
  }
}
