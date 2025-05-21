import { PureComponent, ReactNode } from "react";
import UnitsListLogic from "../State/UnitsListLogic";
import layoutStyles from "@/styles/layout.module.css";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import { WebShellButton } from "jattac.libs.webshell";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import Formatting from "@/Formatting";
import IPropManUnitContact from "../../PropManUnitContacts/Data/IPropManUnitContact";
import PropManUnitContactType from "../../PropManUnitContacts/Data/PropManUnitContactTypes";
import styles from "../Styles/UnitsList.module.css";
import { MenuItem } from "@leafygreen-ui/menu";
import { SplitButton } from "@leafygreen-ui/split-button";
import StandardButton from "@/Forms/Buttons/Standard/UI/StandardButton";
import Link from "next/link";

interface IProps {
  companyId: string;
}

type unitContactDescriber = {
  displayLabel: string;
  phoneNumber: string;
  propManUnitContactType: PropManUnitContactType;
  contactId: string;
};

const logic = new UnitsListLogic();
export default class UnitsList extends PureComponent<IProps> {
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync({ companyId: this.props.companyId });
  }

  private getContacts = (args: {
    contacts: IPropManUnitContact[];
  }): unitContactDescriber[] => {
    return args.contacts.map((specificContact) => {
      return {
        displayLabel: specificContact.displayLabel,
        phoneNumber: specificContact.contactAddresses?.find(
          (x) => x.addressType === "PhoneNumber"
        )?.value,
        propManUnitContactType: specificContact.propManUnitContactType,
        contactId: specificContact.contactId,
      } as unitContactDescriber;
    });
  };

  getContactsCell = (args: {
    contacts: IPropManUnitContact[];
    propManUnitContactType: PropManUnitContactType;
  }): ReactNode => {
    const { contacts, propManUnitContactType } = args;

    const targetContacts = this.getContacts({
      contacts,
    }).filter((a) => a.propManUnitContactType === propManUnitContactType);

    return (
      <div>
        <ul>
          {targetContacts.map((contact, index) => {
            const displayLabel = contact.displayLabel;
            const phone = contact.phoneNumber;
            return (
              <li key={index}>
                <Link
                  href={
                    "/company/account-statements/contact/" + contact.contactId
                  }
                >
                  {displayLabel} - {phone}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  render() {
    if (!logic.repository.company.name) return null;
    return (
      <FrostedGlassOverlay show={logic.repository.busy}>
        <div className={layoutStyles.workspace}>
          <DefaultLayout
            title={`${logic.repository.company.name} Units`}
            className={layoutStyles.pullUpContent}
          >
            <ActionPanel>
              <WebShellButton
                buttonType="positive"
                onClick={() => {
                  const v4EmptyGuid = "00000000-0000-0000-0000-000000000000";
                  window.location.href = `/industries/property-management/units/manage/${v4EmptyGuid}`;
                }}
              >
                Add Unit
              </WebShellButton>
            </ActionPanel>
            <HorizontalDivider />
            <ResponsiveTable
              data={logic.paginator.currentPageItems}
              columnDefinitions={[
                GetRowNumberColumn(),
                {
                  displayLabel: <div>Unit</div>,
                  cellRenderer: (item) => <div>{item.displayLabel}</div>,
                },
                {
                  displayLabel: <div>Owners</div>,
                  cellRenderer: (item) => {
                    return this.getContactsCell({
                      contacts: item.propManUnitContacts,
                      propManUnitContactType: "Owner",
                    });
                  },
                },
                {
                  displayLabel: <div>Tenant</div>,
                  cellRenderer: (item) => {
                    return this.getContactsCell({
                      contacts: item.propManUnitContacts,
                      propManUnitContactType: "Tenant",
                    });
                  },
                },

                {
                  displayLabel: (
                    <div className={styles.rightAlign}>Balance</div>
                  ),
                  cellRenderer: (item) => (
                    <div className={styles.rightAlign}>
                      {Formatting.toMoney({ amount: item.balance })}
                    </div>
                  ),
                },
                {
                  displayLabel: (
                    <div className={styles.rightAlign}>Actions</div>
                  ),
                  cellRenderer: (item) => {
                    const unitContacts = this.getContacts({
                      contacts: item.propManUnitContacts,
                    });
                    return (
                      <div className={`${styles.rightAlign} ${styles.actions}`}>
                        <WebShellButton
                          buttonType="positive"
                          onClick={() => {
                            window.location.href = `/industries/property-management/units/manage/${item.id}`;
                          }}
                        >
                          Edit Unit
                        </WebShellButton>

                        <SplitButton
                          darkMode={false}
                          label="Raise Invoice"
                          renderDarkMenu={false}
                          menuItems={unitContacts?.map(
                            (specificContact, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  onClick={() => {
                                    window.location.href = `/company/invoices/customer-invoice/${specificContact.contactId}`;
                                  }}
                                >
                                  Invoice{" "}
                                  {`${specificContact.displayLabel} - ${specificContact.propManUnitContactType}`}
                                </MenuItem>
                              );
                            }
                          )}
                        />
                      </div>
                    );
                  },
                },
              ]}
            />
          </DefaultLayout>
        </div>
      </FrostedGlassOverlay>
    );
  }
}
