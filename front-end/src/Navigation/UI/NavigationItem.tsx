import { PureComponent, ReactNode } from "react";
import styles from "../Styles/NavigationItem.module.css";
import Link from "next/link";
import React from "react";
import { FaAngleDown } from "react-icons/fa";

interface IProps {
  icon: ReactNode;
  displayLabel: ReactNode;
  submenuItems?: ReactNode[];
  onClick?: () => void;
  url?: string;
  isOpen?: boolean;
}

interface IState {
  keepOpen: boolean;
  childrenLeft: number;
}

export default class NavigationItem extends PureComponent<IProps, IState> {
  state = {
    keepOpen: false,
    childrenLeft: -200,
  } as IState;
  containerDiv: string = "container-div";
  // Create the main UI without the portal

  private collapseChildren() {
    if (this.parentShouldStayOpen) {
      return;
    }
    this.setState({
      childrenLeft: -200,
    });
  }

  private get coreUi(): ReactNode {
    const isOpen = this.parentShouldStayOpen;
    const containerClass = isOpen
      ? `${styles.container} ${styles.open}`
      : styles.container;

    return (
      <div
        id={this.containerDiv}
        className={containerClass}
        onClick={() => this.onClickDelegate()}
        onMouseEnter={() => {
          this.setState({
            childrenLeft: 70,
          });
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            this.collapseChildren();
          }, 500);
        }}
      >
        {this.props.icon}
        <div className={styles.labelAndDownArrow}>
          {this.props.displayLabel}
          {this.hasSubmenuItems && <FaAngleDown />}
        </div>
      </div>
    );
  }

  private get noSubmenuItems(): boolean {
    return (
      !this.props.submenuItems ||
      !Array.isArray(this.props.submenuItems) ||
      this.props.submenuItems.length === 0
    );
  }

  private get hasSubmenuItems(): boolean {
    return this.noSubmenuItems === false;
  }

  private onClickDelegate() {
    if (this.hasSubmenuItems) {
      return;
    } else {
      if (this.props.onClick) {
        this.props.onClick();
      }
    }
  }

  // Wrap the UI in a link if URL is provided
  private get wrappedInLink(): ReactNode {
    const containerClass = this.props.isOpen
      ? `${styles.container} ${styles.open}`
      : styles.container;

    return (
      <div className={containerClass} onClick={this.props.onClick}>
        {this.props.icon}
        <div>
          <Link href={this.props.url!}>{this.props.displayLabel}</Link>
        </div>
      </div>
    );
  }

  private get parentShouldStayOpen() {
    return this.props.isOpen || this.state.keepOpen;
  }

  private get withChildren(): ReactNode {
    let top = 0;

    const position = this.props.isOpen ? "relative" : "absolute";
    return (
      <div className={styles.withSubMenuItemsContainer}>
        {this.coreUi}
        {this.props.submenuItems?.map((subMenuItem, index) => {
          top += this.props.isOpen ? -15 : 56;

          return (
            <div
              key={index}
              className={styles.subMenuItem}
              style={{
                top: top,
                position: position,
                left: this.state.childrenLeft,
              }}
              onMouseEnter={() => {
                this.setState({
                  keepOpen: true,
                });
              }}
              onMouseLeave={() => {
                this.setState(
                  {
                    keepOpen: false,
                  },
                  () => {
                    this.collapseChildren();
                  }
                );
              }}
            >
              {subMenuItem}
            </div>
          );
        })}
      </div>
    );
  }

  private get noChildren(): ReactNode {
    // We render the component through React Portal to a different DOM node
    const content = this.props.url ? this.wrappedInLink : this.coreUi;

    return content;
  }

  render() {
    if (this.hasSubmenuItems === false) {
      return this.noChildren;
    } else {
      return this.withChildren;
    }
  }
}
