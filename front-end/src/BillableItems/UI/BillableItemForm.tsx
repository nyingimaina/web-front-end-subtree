import {
  Form,
  FormControl,
  FormControlGroup,
  FormLabel,
} from "@/Forms/Form/UI/Form";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import { PureComponent, ReactNode } from "react";
import IBillableItem from "../Data/IBillableItem";
import IFormProps from "@/Forms/Form/Data/IFormProps";
import BillableItemLogic from "../State/BillableItemLogic";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";

const logic = new BillableItemLogic();
export default class BillableItemForm extends PureComponent<
  IFormProps<IBillableItem>
> {
  componentDidMount(): void {
    logic.setRerender(() => this.forceUpdate());
    logic.initialize({
      model: this.props.model,
    });
  }

  render(): ReactNode {
    if (!logic.initialize) {
      return null;
    }
    return (
      <Form>
        <FormControlGroup>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <WebShellTextBox
              onChange={(e) => {
                logic.updateModel({
                  displayLabel: e.target.value,
                });
              }}
              autoFocus={true}
              placeholder="Add name of billable item"
              required={true}
              type="text"
              value={logic.model.displayLabel}
            />
          </FormControl>
        </FormControlGroup>
        <HorizontalDivider />
        <ActionPanel>
          <WebShellButton
            buttonType="positive"
            disabled={logic.canSave === false}
            isDefault={true}
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
