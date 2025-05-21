import { PureComponent, ReactNode } from "react";
import ConditionalRender from "./ConditionalRender";
import ConditionalRendererHelpers from "../Logic/ConditionalRendererHelpers";

interface IProps {
  children: ReactNode;
  showOnDev?: boolean;
}
export default class ForBackOfficeOnly extends PureComponent<IProps> {
  render() {
    const environment = process.env.NODE_ENV;
    const isNotProduction = environment.toLocaleLowerCase() !== "production";
    if (this.props.showOnDev === true && isNotProduction) {
      return this.props.children;
    }
    return (
      <ConditionalRender
        condition={async () =>
          await ConditionalRendererHelpers.isBackOfficeAsync()
        }
      >
        {this.props.children}
      </ConditionalRender>
    );
  }
}
