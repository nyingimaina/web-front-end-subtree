import { ChangeEvent, PureComponent, ReactNode } from "react";
import InvoiceLogic from "../State/InvoiceLogic";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import {
  Form,
  FormControl,
  FormControlGroup,
  FormLabel,
  FormRow,
  FormSection,
  GetNumericTextEntryValue,
} from "@/Forms/Form/UI/Form";
import styles from "../Styles/Invoices.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import formStyles from "@/Forms/Form/Styles/Forms.module.css";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import IInvoiceLineItem from "@/InvoiceLineItems/Data/IInvoiceLineItem";
import BasicModal from "@/Modals/UI/BasicModal";
import IBillableItem from "@/BillableItems/Data/IBillableItem";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import SelectWrapper from "@/Forms/SelectWrapper/UI/SelectWrapper";
import ArSh from "@/ArSh/ArSh";
import BillableItemForm from "@/BillableItems/UI/BillableItemForm";
import InvoiceLineItemForm from "@/InvoiceLineItems/UI/InvoiceLineItemForm";
import Formatting from "@/Formatting";
import Checkbox from "@/Forms/Checkbox/UI/Checkbox";
import SelectPrimitive from "@/Forms/SelectWrapper/UI/SelectPrimitive";
import InvoiceTypeNames from "../Data/InvoiceTypeNames";
import InvoiceHelper from "../State/InvoiceHelper";
import ContactForm from "@/Contacts/UI/ContactForm";
import IContact from "@/Contacts/Data/IContact";
import HotterToast from "@/HotterToast/HotterToast";
import FastLayout from "@/layouts/ui/FastLayout";

const logic = new InvoiceLogic();

interface IState {
  invoiceLineItem?: IInvoiceLineItem;
  contact?: IContact;
  billableItem?: IBillableItem;
  invoiceRecurs: boolean;
}

interface IProps {
  invoiceTypeName: InvoiceTypeNames;
  contactId?: string;
}

export default class Invoice extends PureComponent<IProps, IState> {
  state = {
    invoiceRecurs: false,
  } as IState;

  private get billableItemForm(): ReactNode {
    const onClose = () => this.setState({ billableItem: undefined });
    if (!this.state.billableItem) {
      return;
    }
    return (
      <BillableItemForm
        model={this.state.billableItem}
        onSaved={(billableItem) => {
          ArSh.upsertItem({
            arr: logic.repository.billableItems,
            item: billableItem,
            matcher(a, b) {
              return a.id === b.id;
            },
            onCompletion: () => this.forceUpdate(),
          });
          onClose();
        }}
      />
    );
  }

  private get contactForm(): ReactNode {
    const onClose = () => this.setState({ contact: undefined });
    if (!this.state.contact) {
      return;
    }
    return (
      <BasicModal
        isOpen={true}
        onClose={onClose}
        title={`Add ${this.contactTypeDisplayLabel}`}
      >
        <ContactForm
          model={this.state.contact}
          invoiceTypeName={this.props.invoiceTypeName}
          onSaved={(contact) => {
            logic.updateModel({ contactId: contact.id });
            ArSh.upsertItem({
              arr: logic.repository.contacts,
              item: contact,
              matcher(a, b) {
                return a.id === b.id;
              },
              onCompletion: () => this.forceUpdate(),
            });
            onClose();
          }}
        />
      </BasicModal>
    );
  }

  private get invoiceLineItemsModal(): ReactNode {
    if (!this.state.invoiceLineItem) {
      return null;
    }
    const onClose = () => this.setState({ invoiceLineItem: undefined });

    return (
      <BasicModal isOpen={true} onClose={() => onClose()} title={"Line Item"}>
        <InvoiceLineItemForm
          onSaved={(invoiceLineItem: IInvoiceLineItem) => {
            logic.addLineItem(invoiceLineItem);
            onClose();
          }}
          invoiceType={this.props.invoiceTypeName}
        />
      </BasicModal>
    );
  }

  private get modals(): ReactNode {
    return (
      <>
        {this.invoiceLineItemsModal} {this.contactForm} {this.billableItemForm}
      </>
    );
  }

  private get recurrenceDays(): { day: number }[] {
    const result: { day: number }[] = [];
    for (let i = 0; i < 28; i++) {
      result.push({ day: i + 1 });
    }
    return result;
  }

  componentDidMount(): void {
    logic.setRerender(() => this.forceUpdate());
    logic.initializeAsync({
      invoiceType: this.props.invoiceTypeName,
      contactId: this.props.contactId,
    });
  }

  private get invoiceTypeDisplayLabel(): string {
    return InvoiceHelper.getInvoiceTypeDisplayLabel({
      invoiceTypeName: this.props.invoiceTypeName,
    });
  }

  private get contactTypeDisplayLabel(): string {
    return InvoiceHelper.getInvoiceTypeContactDisplayLabel({
      invoiceTypeName: this.props.invoiceTypeName,
    });
  }
  render() {
    if (logic.repository.initialized !== true) {
      return null;
    }
    const repetitionSelectDivId = "repetitionSelectDivId";
    return (
      <FastLayout title={`Manage ${this.invoiceTypeDisplayLabel}`}>
        <FrostedGlassOverlay show={logic.repository.busy}>
          <Form>
            <FormSection title="Invoice Header">
              <FormRow>
                {this.props.invoiceTypeName === "Supplier" && (
                  <FormControlGroup>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <WebShellTextBox
                        type="text"
                        value={
                          logic.model.invoiceNumber
                            ? logic.model.invoiceNumber.toString()
                            : ""
                        }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const asNumber = GetNumericTextEntryValue(e);
                          logic.updateModel({
                            invoiceNumber: asNumber,
                          });
                        }}
                        required={true}
                        placeholder="Invoice Number"
                      />
                    </FormControl>
                  </FormControlGroup>
                )}

                <FormControlGroup>
                  <FormLabel>Dated</FormLabel>

                  <DatePicker
                    selected={logic.model.dated}
                    onChange={(date) => {
                      logic.updateModel({
                        dated: Formatting.adjustDateToTimezone({
                          date: date ?? new Date(),
                          timezoneOffsetHours: 3,
                        }),
                      });
                    }}
                    dateFormat="MMMM dd, yyyy "
                    className={formStyles.dateTimePicker}
                  />
                </FormControlGroup>
                <FormControlGroup>
                  <FormLabel>Currency</FormLabel>
                  <SelectPrimitive
                    items={["USD", "KSH", "EUR", "GBP"].sort((a, b) =>
                      a.localeCompare(b)
                    )}
                    isClearable={true}
                    selectedResolver={(item) =>
                      item.toLocaleLowerCase() ===
                      logic.model.currency.toLocaleLowerCase()
                    }
                    onChange={(items) => {
                      if (ArSh.isEmpty(items)) {
                        logic.updateModel({ currency: "" });
                      } else {
                        logic.updateModel({ currency: items[0] + "" });
                      }
                    }}
                  />
                </FormControlGroup>
                <FormControlGroup>
                  <FormLabel>{this.contactTypeDisplayLabel}</FormLabel>

                  <SelectWrapper<IContact>
                    data={logic.repository.contacts}
                    labelResolver={(item) => item.displayLabel}
                    valueResolver={(item) => item.id}
                    selectedResolver={(candidate) =>
                      candidate.id === logic.model.contactId
                    }
                    onChange={(items: IContact[]) => {
                      const target =
                        items.length > 0 ? items[0] : ({} as IContact);
                      logic.updateModel({ contactId: target.id });
                    }}
                    autoFocus={true}
                    isClearable={true}
                    isSearchable={true}
                    menuPortalTarget={document.body}
                    placeholder={`Select a ${this.contactTypeDisplayLabel}`}
                    required={true}
                    onSearch={async (query) => {
                      await logic.searchForContactAsync({
                        contactName: query,
                      });
                    }}
                    disabled={
                      this.props.contactId &&
                      this.props.contactId === logic.model.contactId
                        ? true
                        : false
                    }
                    onCreateNew={(value: string) => {
                      this.setState({
                        contact: {
                          displayLabel: value,
                        } as IContact,
                      });
                    }}
                  />
                </FormControlGroup>
              </FormRow>
            </FormSection>
            <HorizontalDivider />
            <ActionPanel>
              <WebShellButton
                buttonType="neutral"
                disabled={logic.canAddLineItems === false}
                onClick={() => {
                  this.setState({
                    invoiceLineItem: {
                      billableItemId: "",
                      unitPrice: 0,
                      quantity: 0,
                    } as IInvoiceLineItem,
                  });
                }}
              >
                Add Line Item
              </WebShellButton>
            </ActionPanel>
            <FormSection title="Line Items">
              {logic.model.invoiceLineItems &&
                logic.model.invoiceLineItems.length > 0 && (
                  <ResponsiveTable
                    data={logic.model.invoiceLineItems}
                    columnDefinitions={[
                      GetRowNumberColumn(),
                      {
                        displayLabel: <div>Item</div>,
                        cellRenderer: (item) => item.billableItemDisplayLabel,
                      },
                      {
                        displayLabel: (
                          <div className={styles.alignRight}>Quantity</div>
                        ),
                        cellRenderer: (item) => (
                          <div className={styles.alignRight}>
                            {item.quantity}
                          </div>
                        ),
                      },
                      {
                        displayLabel: (
                          <div className={styles.alignRight}>Unit Price</div>
                        ),
                        cellRenderer: (item) => (
                          <div className={styles.alignRight}>
                            {Formatting.toMoney({
                              amount: item.unitPrice,
                            })}
                          </div>
                        ),
                      },
                      {
                        displayLabel: (
                          <div className={styles.alignRight}>Total</div>
                        ),
                        cellRenderer: (item) => (
                          <div className={styles.alignRight}>
                            {Formatting.toMoney({
                              amount: item.quantity * item.unitPrice,
                            })}
                          </div>
                        ),
                      },
                    ]}
                  />
                )}
            </FormSection>
            <FormSection
              title="Repetition"
              description="In this section you can specify if you wish the customer to be invoiced on a recurring basis"
            >
              <FormControlGroup>
                <FormLabel optional={true}>Recurs Monthly</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={this.state.invoiceRecurs}
                    onChange={(e) => {
                      this.setState({
                        invoiceRecurs: e.target.checked,
                      });
                    }}
                    label=""
                  />
                </FormControl>
              </FormControlGroup>
              <FormControlGroup>
                <FormLabel optional={this.state.invoiceRecurs !== true}>
                  On Date
                </FormLabel>
                <SelectWrapper
                  data={this.recurrenceDays}
                  labelResolver={(item) => item.day + ""}
                  onChange={(item: { day: number }[]) => {
                    const day = ArSh.isEmpty(item) ? 0 : item[0].day;
                    logic.updateModel({
                      invoiceRepetitionTemplate: {
                        ...logic.model.invoiceRepetitionTemplate,
                        ...{ day: day },
                      },
                    });
                  }}
                  selectedResolver={(item) => {
                    return (
                      logic.model.invoiceRepetitionTemplate.day === item.day
                    );
                  }}
                  valueResolver={(item) => item.day + ""}
                  disabled={this.state.invoiceRecurs === false}
                  isClearable={true}
                  required={this.state.invoiceRecurs}
                  menuPortalTarget={
                    document.getElementById(repetitionSelectDivId)!
                  }
                />
              </FormControlGroup>
            </FormSection>
            <ActionPanel>
              <WebShellButton
                buttonType="positive"
                onClick={async () => {
                  await logic.upsertAsync();
                  await HotterToast.success({
                    message: "Invoice Saved",
                    durationMilliseconds: 1000,
                    onClose: () => {
                      window.history.back();
                    },
                  });
                }}
              >
                Save Invoice
              </WebShellButton>
            </ActionPanel>
          </Form>
        </FrostedGlassOverlay>
        {this.modals}
        <div id={repetitionSelectDivId} />
      </FastLayout>
    );
  }
}
