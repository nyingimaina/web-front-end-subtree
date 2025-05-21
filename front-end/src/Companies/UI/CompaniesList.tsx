import { PureComponent, ReactNode } from "react";
import CompaniesLogic from "../State/CompaniesLogic";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import styles from "../Styles/Company.module.css";
import ICompany from "../Data/ICompany";
import BasicModal from "@/Modals/UI/BasicModal";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import toast, { Toaster } from "react-hot-toast";
import AddButton from "@/Forms/Buttons/Standard/UI/AddButton";
import StandardButton from "@/Forms/Buttons/Standard/UI/StandardButton";
import { FormControlGroup, FormLabel } from "@/Forms/Form/UI/Form";
import SelectPrimitive from "@/Forms/SelectWrapper/UI/SelectPrimitive";
import { getIndustries, Industries } from "../Data/Industries";
import Portify from "@/Portify/UI/Portify";
import ArSh from "@/ArSh/ArSh";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import FastLayout from "@/layouts/ui/FastLayout";

const logic = new CompaniesLogic();

interface IState {
  companyToEdit?: ICompany;
}
export default class CompaniesList extends PureComponent<object, IState> {
  state = {} as IState;
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.paginator.fetchPage();
  }

  private get editModal(): ReactNode {
    const doClose = () => this.setState({ companyToEdit: undefined });
    return (
      <BasicModal
        isOpen={this.state.companyToEdit ? true : false}
        onClose={doClose}
        title={this.state.companyToEdit?.name}
      >
        Name
        <WebShellTextBox
          type="text"
          onChange={(e) => {
            if (this.state.companyToEdit) {
              this.setState({
                companyToEdit: {
                  ...this.state.companyToEdit,
                  name: e.target.value,
                },
              });
            }
          }}
          value={this.state.companyToEdit?.name ?? ""}
        />
        <FormControlGroup>
          <FormLabel>Industry</FormLabel>
          <div className={styles.industrySelect} />
          <Portify>
            <SelectPrimitive
              items={getIndustries()}
              onChange={(industries) => {
                if (ArSh.isNotEmpty(industries)) {
                  if (this.state.companyToEdit) {
                    this.setState({
                      companyToEdit: {
                        ...this.state.companyToEdit,
                        industry: industries[0] as Industries,
                      },
                    });
                  }
                } else {
                  if (this.state.companyToEdit) {
                    this.setState({
                      companyToEdit: {
                        ...this.state.companyToEdit,
                        industry: "Other",
                      },
                    });
                  }
                }
              }}
              selectedResolver={(item) =>
                item === this.state.companyToEdit?.industry
              }
              isClearable={true}
            />
          </Portify>
        </FormControlGroup>
        <FormControlGroup>
          <FormLabel>Api Key</FormLabel>
          <WebShellTextBox
            type="text"
            onChange={() => {}}
            value={this.state.companyToEdit?.apiKey ?? ""}
          />
        </FormControlGroup>
        <HorizontalDivider />
        <div className={styles.industrySelect} />
        <StandardButton
          type="success"
          onClick={async () => {
            const saveResponse = await toast.promise(
              logic.saveAsync(this.state.companyToEdit!),
              {
                loading: "Saving company",
                success: "Saved",
                error: "Failed to save company. Notify support.",
              }
            );
            if (saveResponse) {
              toast.error(saveResponse);
            } else {
              doClose();
            }
          }}
        >
          Save
        </StandardButton>
      </BasicModal>
    );
  }

  private get modals(): ReactNode {
    return <>{this.editModal}</>;
  }

  render() {
    return (
      <FastLayout title="Companies Management">
        <Toaster />
        <ActionPanel>
          <AddButton
            type="success"
            onClick={() => {
              this.setState({
                companyToEdit: {
                  companyType: "Customer",
                  modified: new Date(),
                } as ICompany,
              });
            }}
          >
            Add Company
          </AddButton>
        </ActionPanel>
        <ResponsiveTable
          onRowClick={(item) => {
            if (logic.canEditCompany(item) === false) {
              toast(`${item.name} is not editable`);
              return;
            }
            this.setState({ companyToEdit: item });
          }}
          data={logic.repository.companies}
          columnDefinitions={[
            GetRowNumberColumn(),
            {
              cellRenderer: (item) => item.name,
              displayLabel: "Company",
            },
            {
              cellRenderer: (item) => item.companyType,
              displayLabel: "Company Type",
            },
            {
              cellRenderer: (item) => item.industry,
              displayLabel: "Industry",
            },
            // {
            //   cellRenderer: (item) => item.apiKey,
            //   displayLabel: "API Key",
            // },
            {
              displayLabel: (
                <div className={styles.actionsColumnHeader}>Actions</div>
              ),
              cellRenderer: (item) => (
                <div className={styles.actionButtons}>
                  <WebShellButton
                    buttonType="positive"
                    onClick={() => {
                      window.location.href = `/common/roles/${item.id}`;
                    }}
                  >
                    Manage Roles
                  </WebShellButton>
                  <WebShellButton
                    buttonType="positive"
                    onClick={() => {
                      window.location.href = `/backoffice/users/${item.id}`;
                    }}
                  >
                    Manage Users
                  </WebShellButton>
                  <WebShellButton
                    buttonType="positive"
                    onClick={async () => {
                      await toast.promise(logic.rotateApiKeyAsync(item.id), {
                        loading: "Rotating Api Key",
                        success: "Rotated Api Key",
                        error: "Failed to rotate Api Key. Notify support.",
                      });
                    }}
                  >
                    Rotate Api Key
                  </WebShellButton>
                  <StandardButton
                    type="primary"
                    disabled={logic.canEditCompany(item) === false}
                  >
                    Delete
                  </StandardButton>
                </div>
              ),
            },
          ]}
        />
        {this.modals}
      </FastLayout>
    );
  }
}
