import {
  Form,
  FormControl,
  FormControlGroup,
  FormLabel,
} from "@/Forms/Form/UI/Form";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import { PureComponent } from "react";
import ArSh from "@/ArSh/ArSh";
import IContact from "../Data/IContact";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import IFormProps from "@/Forms/Form/Data/IFormProps";
import ContactLogic from "../State/ContactLogic";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";

const logic = new ContactLogic();

interface IContactFormProps extends IFormProps<IContact> {
  invoiceTypeName: InvoiceTypeNames;
}
export default class ContactForm extends PureComponent<IContactFormProps> {
  componentDidMount(): void {
    logic.setRerender(() => this.forceUpdate());
    logic.initialize({
      contact: this.props.model,
      contactType:
        this.props.invoiceTypeName === "Customer" ? "Customer" : "Supplier",
    });
  }

  render() {
    if (logic.repository.initialized !== true) {
      return <>...</>;
    }
    const phoneNumber = logic.getFirstAddressByType({
      addressType: "PhoneNumber",
    });

    const emailAddress = logic.getFirstAddressByType({
      addressType: "Email",
    });

    return (
      <Form>
        <FormControlGroup>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <WebShellTextBox
              autoFocus={true}
              onChange={(e) => {
                logic.updateModel({
                  displayLabel: e.target.value,
                });
              }}
              type="text"
              value={logic.model.displayLabel}
              placeholder="Customer Name"
              required={true}
            />
          </FormControl>
        </FormControlGroup>

        <FormControlGroup>
          <FormLabel optional={false}>Phone Number</FormLabel>
          <FormControl>
            <WebShellTextBox
              onChange={(e) => {
                phoneNumber.value = e.target.value;
                ArSh.upsertItem({
                  arr: logic.model.contactAddresses,
                  item: phoneNumber,
                  matcher: (a, b) => a === b,
                  onCompletion: () => this.forceUpdate(),
                });
              }}
              type="tel"
              value={phoneNumber.value}
              placeholder="Phone Number"
              required={true}
            />
          </FormControl>
        </FormControlGroup>

        <FormControlGroup>
          <FormLabel optional={true}>Email</FormLabel>
          <FormControl>
            <WebShellTextBox
              onChange={(e) => {
                emailAddress.value = e.target.value;
                ArSh.upsertItem({
                  arr: logic.model.contactAddresses,
                  item: emailAddress,
                  matcher: (a, b) => a === b,
                  onCompletion: () => this.forceUpdate(),
                });
              }}
              type="text"
              value={emailAddress.value}
              placeholder="Email Address"
              required={false}
            />
          </FormControl>
        </FormControlGroup>
        <HorizontalDivider />
        <ActionPanel>
          <WebShellButton
            buttonType="positive"
            disabled={logic.canSave === false}
            onClick={async () => {
              await logic.saveAsync();
              this.props.onSaved?.(logic.model);
            }}
          >
            Save
          </WebShellButton>
        </ActionPanel>
      </Form>
    );
  }
}
