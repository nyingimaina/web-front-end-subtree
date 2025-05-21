import DefaultLayout from "@/layouts/ui/DefaultLayout";
import { PureComponent } from "react";
import SettingsLogic from "../State/SettingsLogic";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import {
  Form,
  FormControl,
  FormControlGroup,
  FormLabel,
  FormRow,
} from "@/Forms/Form/UI/Form";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import toast from "react-hot-toast";

const logic = new SettingsLogic();
export default class Settings extends PureComponent {
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.loadSettingsAsync();
  }

  render() {
    return (
      <DefaultLayout title="App Settings">
        <FrostedGlassOverlay show={logic.repository.busy}>
          <Form>
            <FormRow>
              <FormControlGroup>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <WebShellTextBox
                    type="text"
                    value={
                      logic.getSettingByOwnerAndKey({
                        owner: "Company",
                        key: "CompanyName",
                      })?.value
                    }
                    onChange={(e) =>
                      logic.updateSetting({
                        owner: "Company",
                        key: "CompanyName",
                        value: e.target.value,
                      })
                    }
                    required={true}
                    autoFocus={true}
                  />
                </FormControl>
              </FormControlGroup>
              <FormControlGroup>
                <FormLabel>Next Customer Invoice Number</FormLabel>
                <FormControl>
                  <WebShellTextBox
                    type="number"
                    value={
                      logic.getSettingByOwnerAndKey({
                        owner: "InvoiceIncrementalNumber",
                        key: "InvoiceNumber",
                      })?.value
                    }
                    onChange={(e) =>
                      logic.updateSetting({
                        owner: "InvoiceIncrementalNumber",
                        key: "InvoiceNumber",
                        value: e.target.value,
                      })
                    }
                    required={true}
                  />
                </FormControl>
              </FormControlGroup>
            </FormRow>
            <FormRow>
              <FormControlGroup>
                <FormLabel optional={true}>Footer Title</FormLabel>
                <FormControl>
                  <WebShellTextBox
                    type="text"
                    value={
                      logic.getSettingByOwnerAndKey({
                        owner: "KeyValueSetting",
                        key: "FooterTitle",
                      })?.value
                    }
                    onChange={(e) =>
                      logic.updateSetting({
                        owner: "KeyValueSetting",
                        key: "FooterTitle",
                        value: e.target.value,
                      })
                    }
                    required={false}
                  />
                </FormControl>
              </FormControlGroup>
            </FormRow>
            <FormRow>
              <FormControlGroup>
                <FormLabel optional={true}>Payment Instructions</FormLabel>
                <FormControl>
                  <textarea
                    rows={5}
                    value={
                      logic.getSettingByOwnerAndKey({
                        owner: "KeyValueSetting",
                        key: "PaymentInstructions",
                      })?.value
                    }
                    onChange={(e) =>
                      logic.updateSetting({
                        owner: "KeyValueSetting",
                        key: "PaymentInstructions",
                        value: e.target.value,
                      })
                    }
                    required={false}
                  />
                </FormControl>
              </FormControlGroup>
            </FormRow>
            <FormRow>
              <FormControlGroup>
                <FormLabel optional={true}>Footer Remarks</FormLabel>
                <FormControl>
                  <textarea
                    rows={5}
                    value={
                      logic.getSettingByOwnerAndKey({
                        owner: "KeyValueSetting",
                        key: "FooterRemarks",
                      })?.value
                    }
                    onChange={(e) =>
                      logic.updateSetting({
                        owner: "KeyValueSetting",
                        key: "FooterRemarks",
                        value: e.target.value,
                      })
                    }
                    required={false}
                  />
                </FormControl>
              </FormControlGroup>
            </FormRow>
            <HorizontalDivider />
            <ActionPanel>
              <WebShellButton
                buttonType="positive"
                onClick={async () => {
                  await logic.saveSettingsAsync();
                  await toast.success("Settings saved");
                }}
                disabled={logic.repository.isDirty !== true}
              >
                Save Settings
              </WebShellButton>
            </ActionPanel>
          </Form>
        </FrostedGlassOverlay>
      </DefaultLayout>
    );
  }
}
