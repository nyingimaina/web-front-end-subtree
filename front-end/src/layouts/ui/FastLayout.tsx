import { PureComponent } from "react";
import { ILayoutProps } from "./DefaultLayout";
import styles from "../styles/FastLayout.module.css";

export default class FastLayout extends PureComponent<ILayoutProps> {
  render() {
    return (
      <div className={styles.workspace}>
        <div className={styles.title}>{this.props.title}</div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
