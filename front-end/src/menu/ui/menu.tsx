import { PureComponent, ReactNode } from "react";
import IMenuItem from "../data/IMenuItem";
import styles from "../styles/menu.module.css";
import Search from "@/search/ui/Search";

interface IProps {
  menuItems: IMenuItem[];
  title?: ReactNode;
}

export default class Menu extends PureComponent<IProps> {
  private get menuItems() {
    return this.props.menuItems.map((a) => {
      return this.getMenus({ menuItem: a, isTopLevel: true });
    });
  }

  private getMenus(args: {
    menuItem: IMenuItem;
    isTopLevel: boolean;
  }): ReactNode {
    const { menuItem, isTopLevel } = args;
    return (
      <div
        className={isTopLevel ? styles.topLevelMenuItem : undefined}
        onClick={() => {
          if (menuItem.onClick) {
            menuItem.onClick();
          }
        }}
      >
        {menuItem.label}
        {this.getMenuSheet({ menuItem: menuItem })}
      </div>
    );
  }

  private getMenuSheet(args: { menuItem: IMenuItem }) {
    const { menuItem } = args;
    if (!menuItem.submenu) {
      return null;
    } else {
      return (
        <div className={styles.menuSheet}>
          {menuItem.submenu!.map((a) =>
            this.getMenus({ menuItem: a, isTopLevel: false })
          )}
        </div>
      );
    }
  }

  handleSearch = (query: string) => {
    window.location.href = `/common/telex-release-search/${query}`;
  };
  render() {
    return (
      <div className={styles.menuBar}>
        <div className={styles.title}>{this.props.title}</div>
        {this.menuItems}
        <div className={styles.searchContainer}>
          <Search onSearch={this.handleSearch} />{" "}
          {/* Place the Search component */}
        </div>
      </div>
    );
  }
}
