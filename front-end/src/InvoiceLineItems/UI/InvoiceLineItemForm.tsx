import IBillableItem from "@/BillableItems/Data/IBillableItem";
import {
  Form,
  FormControl,
  FormControlGroup,
  FormLabel,
  GetNumericTextEntryValue,
} from "@/Forms/Form/UI/Form";
import SelectWrapper from "@/Forms/SelectWrapper/UI/SelectWrapper";
import { PureComponent } from "react";
import InvoiceLineItemsLogic from "../State/InvoiceLineItemsLogic";
import IInvoiceLineItem from "../Data/IInvoiceLineItem";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import IFormProps from "@/Forms/Form/Data/IFormProps";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

interface IState {
  billableItem?: IBillableItem;
}

interface IProps extends IFormProps<IInvoiceLineItem> {
  invoiceType: InvoiceTypeNames;
}

const logic = new InvoiceLineItemsLogic();

export default class InvoiceLineItemForm extends PureComponent<IProps, IState> {
  state = {} as IState;

  componentDidMount(): void {
    logic.setRerender(() => this.forceUpdate());
    logic.initialize({
      model: {} as IInvoiceLineItem,
      invoiceType: this.props.invoiceType,
    });
  }

  onUpdateSelectedBillableItem = (billableItem: IBillableItem) => {
    logic.updateModel({
      billableItemId: billableItem.id,
      billableItemDisplayLabel: billableItem.displayLabel,
    });
  };

  render() {
    return (
      <Form>
        <FormControlGroup>
          <FormLabel>Item</FormLabel>
          <FormControl>
            <SelectWrapper<IBillableItem>
              data={logic.repository.billableItems}
              // key={JSON.stringify(logic.repository.billableItems)} // Don't use this as it will cause the select to re-render every time the billable items change
              isMulti={false}
              labelResolver={(billableItem) => billableItem.displayLabel}
              selectedResolver={(billableItem) =>
                billableItem.id === logic.model.billableItemId
              }
              valueResolver={(billableItem) => billableItem.id}
              autoFocus={true}
              isClearable={true}
              isSearchable={true}
              onCreateNew={async (value: string) => {
                const billableItem = await logic.upsertBillableItem({
                  displayLabel: value,
                  invoiceType: this.props.invoiceType,
                });
                this.onUpdateSelectedBillableItem(billableItem);
              }}
              required={true}
              onChange={async (items: IBillableItem[]) => {
                const target =
                  items.length > 0 ? items[0] : ({} as IBillableItem);
                this.onUpdateSelectedBillableItem(target);
              }}
              onSearch={async (query) => {
                await logic.searchForBillableItemAsync({
                  billableItem: query,
                });
              }}
            />
          </FormControl>
        </FormControlGroup>
        <FormControlGroup>
          <FormLabel>Unit Price</FormLabel>
          <FormControl>
            <WebShellTextBox
              onChange={(e) => {
                logic.updateModel({ unitPrice: GetNumericTextEntryValue(e) });
              }}
              type="tel"
              value={
                logic.model.unitPrice
                  ? logic.model.unitPrice.toLocaleString()
                  : ""
              }
              placeholder="Price per unit"
              required={true}
            />
          </FormControl>
        </FormControlGroup>

        <FormControlGroup>
          <FormLabel>Quantity</FormLabel>
          <FormControl>
            <WebShellTextBox
              onChange={(e) => {
                logic.updateModel({ quantity: GetNumericTextEntryValue(e) });
              }}
              type="tel"
              value={
                logic.model.quantity
                  ? logic.model.quantity.toLocaleString()
                  : ""
              }
              placeholder="Number of units to bill"
              required={true}
            />
          </FormControl>
        </FormControlGroup>
        <HorizontalDivider />
        <ActionPanel>
          <WebShellButton
            buttonType="positive"
            onClick={async () => {
              this.props.onSaved?.(logic.model);
            }}
            disabled={logic.canSave === false}
          >
            Add
          </WebShellButton>
        </ActionPanel>
      </Form>
    );
  }
}
