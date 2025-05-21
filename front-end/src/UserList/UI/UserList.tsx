import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import { WebShellButton, WebShellTextBox } from "jattac.libs.webshell";
import { PureComponent, ReactNode } from "react";
import UserListLogic from "../State/UserListLogic";
import ICompany from "@/Companies/Data/ICompany";
import toast from "react-hot-toast";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import IUser from "@/Users/Data/IUser";
import BasicModal from "@/Modals/UI/BasicModal";
import styles from "../Styles/UserList.module.css";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddButton from "@/Forms/Buttons/Standard/UI/AddButton";
import PasswordTextbox from "@/Forms/PasswordTextbox/UI/PasswordTextbox";
import FastLayout from "@/layouts/ui/FastLayout";

interface IProps {
  companyId: string;
}

interface IState {
  userForModal?: IUser;
  userForPasswordReset?: IUser;
}

const logic = new UserListLogic();
export default class UserList extends PureComponent<IProps, IState> {
  state = {} as IState;

  private manageUser(user: IUser) {
    logic.model = user;
    this.setState({
      userForModal: user,
    });
  }

  private get passwordResetModal(): ReactNode {
    if (!this.state.userForPasswordReset) {
      return null;
    } else {
      const doClose = () => {
        this.setState({
          userForPasswordReset: undefined,
        });
      };
      return (
        <BasicModal
          isOpen={true}
          onClose={doClose}
          title="Change User Password"
        >
          <div>
            Enter new password for
            <br /> {`${this.state.userForPasswordReset.email}`}
          </div>
          <HorizontalDivider />
          <PasswordTextbox
            width="340px"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                this.state.userForPasswordReset!.password = value;
              }
            }}
          />
          <HorizontalDivider />
          <ActionPanel>
            <WebShellButton
              buttonType="positive"
              onClick={async () => {
                logic.updateModel(this.state.userForPasswordReset!);
                await toast.promise(
                  logic.upsertAsync(),
                  {
                    loading: "Changing Password",
                    error: "Failed To Change Password",
                    success: "Password Changed",
                  },
                  {
                    id: "change-password",
                  }
                );
                doClose();
              }}
            >
              Save
            </WebShellButton>
          </ActionPanel>
        </BasicModal>
      );
    }
  }

  private get editModal(): ReactNode {
    if (!this.state.userForModal) {
      return;
    }
    const doClose = () =>
      this.setState({
        userForModal: undefined,
      });

    logic.model = this.state.userForModal;

    return (
      <BasicModal
        title={"Manage User"}
        isOpen={true}
        onClose={doClose}
        width="40vw"
      >
        Email
        <WebShellTextBox
          type="email"
          onChange={(e) => {
            this.setState({
              userForModal: {
                ...this.state.userForModal!,
                email: e.target.value,
              },
            });
          }}
          required={true}
          value={this.state.userForModal.email ?? ""}
        />
        {this.state.userForModal.id ? undefined : (
          <>
            Password
            <WebShellTextBox
              type="password"
              onChange={(e) => {
                this.setState({
                  userForModal: {
                    ...this.state.userForModal!,
                    password: e.target.value,
                  },
                });
              }}
              required={true}
              value={this.state.userForModal.password ?? ""}
            />
          </>
        )}
        Roles
        <HorizontalDivider />
        <div className={styles.checkboxes}>
          {logic.repository.roles.map((role, index) => {
            return (
              <div key={index}>
                <span className={styles.checkBoxDiv}>
                  {role.roleDisplayLabel}
                </span>
                <input
                  type="checkbox"
                  checked={logic.model.userRoleIds.includes(role.id)}
                  onChange={() => {
                    logic.toggleRole(role.id);
                  }}
                />
              </div>
            );
          })}
        </div>
        <ActionPanel>
          <WebShellButton
            buttonType="positive"
            onClick={async () => {
              logic.updateModel(this.state.userForModal!);
              await logic.upsertAsync();
              doClose();
            }}
          >
            Save
          </WebShellButton>
        </ActionPanel>
      </BasicModal>
    );
  }

  private get modals(): ReactNode {
    return (
      <>
        {this.editModal} {this.passwordResetModal}
      </>
    );
  }

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    logic.repository.company = {
      id: this.props.companyId,
      name: "...",
    } as ICompany;
    await toast.promise(logic.initializeAsync(), {
      loading: "Preparing",
      error: "Error occured",
      success: "Ready",
    });
  }

  private getTable(args: { users: IUser[]; action: string }) {
    const { users, action } = args;
    return (
      <ResponsiveTable
        onRowClick={(item) => {
          this.setState({
            userForModal: item,
          });
        }}
        data={users}
        columnDefinitions={[
          {
            cellRenderer: (item) => item.email,
            displayLabel: "Email",
          },
          {
            cellRenderer: (user) => {
              if (user.userRoleIds) {
                const roleDisplayLabels = logic.repository.roles
                  .filter((role) =>
                    user.userRoleIds.some((roleId) => role.id == roleId)
                  )
                  .map((role) => role.roleDisplayLabel);
                return roleDisplayLabels.join(", ");
              }
            },
            displayLabel: "Roles",
          },
          {
            cellRenderer: (item) => {
              return (
                <div className={styles.actions}>
                  <WebShellButton
                    buttonType="negative"
                    onClick={async () => {
                      await toast.promise(
                        logic.toggleUserAsync({
                          userId: item.id,
                          deleted: !item.deleted,
                        }),
                        {
                          loading: "Toggling User State",
                          error: "Unable to toggle user state.",
                          success: "User toggled",
                        }
                      );
                    }}
                  >
                    {action}
                  </WebShellButton>

                  <WebShellButton
                    buttonType="neutral"
                    onClick={() => {
                      this.setState({
                        userForPasswordReset: item,
                      });
                    }}
                  >
                    Change Password
                  </WebShellButton>
                </div>
              );
            },
            displayLabel: <div className={styles.actionsTitle}>Actions</div>,
          },
        ]}
      />
    );
  }

  render() {
    return (
      <FastLayout title={`${logic.repository.company.name} Users`}>
        <ActionPanel>
          <AddButton
            type="success"
            onClick={() => {
              this.manageUser({
                email: "",
                userRoleIds: [] as string[],
              } as IUser);
            }}
          >
            Add User
          </AddButton>
        </ActionPanel>
        <Tabs>
          <TabList>
            <Tab>Active</Tab>
            <Tab>Archived</Tab>
          </TabList>
          <TabPanel>
            {this.getTable({
              users: logic.activeUsers,
              action: "Archive",
            })}
          </TabPanel>
          <TabPanel>
            {this.getTable({
              users: logic.deletedUsers,
              action: "Restore",
            })}
          </TabPanel>
        </Tabs>
        {this.modals}
      </FastLayout>
    );
  }
}
