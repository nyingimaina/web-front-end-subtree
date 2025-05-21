import { PureComponent, ReactNode } from "react";
import ConditionalRender from "./ConditionalRender";
import ConditionalRendererHelpers from "../Logic/ConditionalRendererHelpers";
import PermissionNames from "@/Permissions/Data/PermissionNames";
import RoleNames from "@/Roles/Data/RoleNames";

interface IProps {
  children: ReactNode;
  mustHavePermissions: PermissionNames[];
  permissionEvaluationMode: "any" | "all";
  roleNames: RoleNames[];
  grantToAdmin?: boolean;
}
export default class ForPermittedRolesOnly extends PureComponent<IProps> {
  private async hasRequiredPermission() {
    if (this.props.permissionEvaluationMode === "any") {
      for (const permission of this.props.mustHavePermissions) {
        if (
          await ConditionalRendererHelpers.currentUserHasPermissionsAsync(
            permission
          )
        ) {
          return true;
        }
      }
      return false;
    } else {
      let hasRequiredPermission = false;
      for (const permission of this.props.mustHavePermissions) {
        if (
          await ConditionalRendererHelpers.currentUserHasPermissionsAsync(
            permission
          )
        ) {
          hasRequiredPermission = true;
        } else {
          hasRequiredPermission = false;
          break;
        }
      }
      return hasRequiredPermission;
    }
  }

  render() {
    return (
      <ConditionalRender
        condition={async () => {
          const implicitlyAllowed =
            this.props.grantToAdmin === true &&
            this.props.roleNames.includes("Admin");

          if (implicitlyAllowed) {
            return true;
          }

          const hasRequiredPermission = await this.hasRequiredPermission();
          return hasRequiredPermission;
        }}
      >
        {this.props.children}
      </ConditionalRender>
    );
  }
}
