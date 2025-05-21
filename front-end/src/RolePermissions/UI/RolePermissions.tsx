import { PureComponent } from "react";
import layoutStyles from "@/styles/layout.module.css";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import RolePermissionLogic from "../State/RolePermissionLogic";
import IRole from "@/Roles/Data/IRole";
import toast from "react-hot-toast";
import Card from "@/Forms/Card/UI/Card";
import styles from "../Styles/RolePermissions.module.css";
import IRolePermission from "../Data/IRolePermission";

interface IProps {
  companyId: string;
}

const logic = new RolePermissionLogic();

export default class RolePermissions extends PureComponent<IProps> {
  private getTable(role: IRole) {
    return (
      <Card title=" Permission Management">
        <div className={styles.container}>
          {logic.repository.permissions.map((permission) => {
            const rolePermission = {
              roleId: role.id,
              permissionId: permission.id,
            } as IRolePermission;
            return (
              <div key={permission.id} className={styles.checkboxAndLabel}>
                <input
                  type="checkbox"
                  checked={logic.isPermissionGranted(rolePermission)}
                  onClick={async () => {
                    await toast.promise(
                      logic.togglePermissionAsync(rolePermission),
                      {
                        error: "Unable to update permission",
                        success: "Permission updated",
                        loading: "Updating...",
                      }
                    );
                  }}
                />
                <label>{permission.displayLabel}</label>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await toast.promise(
      logic.initializeAsync({ companyId: this.props.companyId }),
      {
        error: "Could not fetch data",
        success: "Ready",
        loading: "Loading...",
      }
    );
  }

  render() {
    return (
      <DefaultLayout
        title="Roles Permissions"
        className={layoutStyles.pullUpContent}
      >
        <div className={layoutStyles.workspace}>
          <Tabs>
            <TabList>
              {logic.repository.roles.map((role) => (
                <Tab key={role.id}>{role.roleDisplayLabel}</Tab>
              ))}
            </TabList>
            {logic.repository.roles.map((role) => (
              <TabPanel key={role.id}>{this.getTable(role)}</TabPanel>
            ))}
          </Tabs>
        </div>
      </DefaultLayout>
    );
  }
}
