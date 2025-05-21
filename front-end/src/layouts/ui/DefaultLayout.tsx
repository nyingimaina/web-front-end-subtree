import { PureComponent, ReactNode } from "react";
import styles from "../styles/DefaultLayout.module.css";
import { Toaster } from "react-hot-toast";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";

interface ILayoutProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export type { ILayoutProps };

/** @deprecated This layout is deprecated and will be removed in future versions. Use the FastLayout instead */
export default class DefaultLayout extends PureComponent<ILayoutProps> {
  componentDidMount(): void {
    window.document.title = `${this.props.title}`;
  }

  render() {
    return (
      <>
        <Toaster />

        <div className={styles.title}>
          {this.props.title}
          <HorizontalDivider />
        </div>

        <div className={`${styles.content} ${this.props.className}`}>
          {this.props.children}
        </div>
      </>
    );
  }
}
