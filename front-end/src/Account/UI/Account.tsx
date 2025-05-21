import { PureComponent, ReactNode } from "react";
import AuthenticatedUserTracker from "../AuthenticatedUserTracker";
import Authentication from "@/Authentication/UI/Authentication";
import styles from "../Styles/Account.module.css";
import sideBarStyles from "../Styles/SidebarStyles.module.css";
import { MenuItem, WebShell } from "jattac.libs.webshell";
import Navbar from "./Navbar";
import { GiOrganigram } from "react-icons/gi";
import ForBackOfficeOnly from "@/ConditionalRenderer/UI/ForBackOfficeOnly";
import { TiGroup } from "react-icons/ti";
import { RiShieldUserLine } from "react-icons/ri";
import ForCustomersOnly from "@/ConditionalRenderer/UI/ForCustomersOnly";
import ForPermittedRolesOnly from "@/ConditionalRenderer/UI/ForPermittedRolesOnly";
import { OnBrowserLocationTracker } from "jattac.react.recents";
import {
  IconExpense,
  IconInvoice,
  IconLog,
  IconSettings,
} from "@/IconsLibrary/Icons";
import AccountLogic from "../State/AccountLogic";
import SidebarAdapters from "../../../Industries/_Integration/Account/SidebarAdapters";
import {
  Sidebar,
  Menu,
  MenuItem as ReactProMenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { MdHome } from "react-icons/md";
import { IoIosArrowForward, IoMdMenu } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import Statics from "../../../Statics";
import IAuthenticationResponse from "@/Authentication/Data/IAuthenticationResponse";
import ConditionalRender from "@/ConditionalRenderer/UI/ConditionalRender";

interface IProps {
  children?: ReactNode;
  allowAnonymous?: boolean;
}

interface IState {
  signInState: "unknown" | "in" | "out";
  menuOpen: boolean;
}

const logic = new AccountLogic();

export default class Account extends PureComponent<IProps, IState> {
  state = {
    signInState: "unknown",
    menuOpen: false,
  } as IState;

  async componentDidMount() {
    this.setState(
      {
        signInState: AuthenticatedUserTracker.hasUser ? "in" : "out",
      },
      () => this.trackRecents()
    );
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync();
  }

  trackRecents() {
    if (this.state.signInState != "in") {
      return;
    }
    const tracker = new OnBrowserLocationTracker({
      maxRecents: 10,
      namespace: AuthenticatedUserTracker.authenticatedUser?.email,

      dontTrack: {
        withPrefix: [
          {
            urlOrTitle: "404: This page could not be found",
          },
          {
            urlOrTitle: "Search",
          },
        ],
        contains: [
          { urlOrTitle: "Sign In" },
          {
            urlOrTitle: "/company/invoices/document/",
          },
          {
            urlOrTitle: "Roles Permissions",
          },
        ],
      },
    });
    tracker.trackVisit({
      url: window.location.href, // Current page URL
      windowTitle: document.title, // Current page title
      lastVisited: new Date().toISOString(), // Current timestamp
    });
  }

  handleSearch = (query: string) => {
    window.location.href = `/common/telex-release-search/${query}`;
  };

  private get anonymousUser(): IAuthenticationResponse {
    return {
      companyDisplayLabel: "Anonymous",
      companyId: Statics.defaultv4Guid,
      companyType: "Anonymous",
      email: "anonymous@example.com",
      userRoleNames: [],
      deleted: false,
      id: Statics.defaultv4Guid,
      modified: new Date().toDateString(),
    } as unknown as IAuthenticationResponse;
  }

  private get menuItems(): Omit<MenuItem<string>, "id">[] {
    const authenticatedUser =
      AuthenticatedUserTracker.authenticatedUser ?? this.props.allowAnonymous
        ? this.anonymousUser
        : undefined;
    const industryItems: ReactNode[] = [];
    const userRoleNames = authenticatedUser?.userRoleNames ?? [];
    const isAnonymous =
      !authenticatedUser || authenticatedUser.id === Statics.defaultv4Guid;
    if (logic.repository.company) {
      const sidebarAdapter = new SidebarAdapters().getAdapter({
        industry: logic.repository.company.industry,
        companyId: logic.repository.company.id,
      });

      const industryNodes = sidebarAdapter.industryNodes.map((item, index) => {
        return (
          <ForPermittedRolesOnly
            key={index}
            grantToAdmin={true}
            mustHavePermissions={item.permissions}
            permissionEvaluationMode="any"
            roleNames={userRoleNames}
          >
            <ForCustomersOnly>
              <ReactProMenuItem
                onClick={() => item.onClick()}
                icon={<div className={styles.menuIcon}>{item.icon}</div>}
                title={item.displayLabel}
              >
                {item.displayLabel}
              </ReactProMenuItem>
            </ForCustomersOnly>
          </ForPermittedRolesOnly>
        );
      });
      industryItems.push(...industryNodes);
    }

    const menuItems = [
      {
        node: (
          <Sidebar
            collapsed={!this.state.menuOpen}
            collapsedWidth="70px"
            className={sideBarStyles.sidebar}
          >
            <Menu
              renderExpandIcon={({ open }) => <span>{open ? "" : ""}</span>}
            >
              <ConditionalRender
                condition={() => Promise.resolve(isAnonymous === false)}
              >
                <ReactProMenuItem>
                  <div
                    className={styles.menuIcon}
                    onClick={() => {
                      this.setState({ menuOpen: !this.state.menuOpen });
                    }}
                  >
                    {this.state.menuOpen ? <IoArrowBack /> : <IoMdMenu />}
                  </div>
                </ReactProMenuItem>
              </ConditionalRender>
              {industryItems}
              <ConditionalRender
                condition={() => Promise.resolve(isAnonymous === false)}
              >
                <ReactProMenuItem
                  title="Dashboard"
                  icon={<MdHome className={styles.menuIcon} />}
                >
                  <div
                    className={`${sideBarStyles.menuRow}`}
                    onClick={() => {
                      window.location.href = "/";
                    }}
                  >
                    Dashboard
                  </div>
                </ReactProMenuItem>
              </ConditionalRender>
              <ForPermittedRolesOnly
                permissionEvaluationMode="any"
                mustHavePermissions={["CreateInvoices"]}
                roleNames={userRoleNames}
                grantToAdmin={false}
              >
                <ForCustomersOnly>
                  <SubMenu
                    label="Customer Invoices"
                    icon={<IconInvoice className={styles.menuIcon} />}
                    title="Customer Invoices"
                  >
                    <ReactProMenuItem
                      className={sideBarStyles.subMenuItem}
                      onClick={() => {
                        window.location.href =
                          "/company/invoices/list/Customer";
                      }}
                      prefix={<IoIosArrowForward />}
                    >
                      Invoice List
                    </ReactProMenuItem>
                    <ReactProMenuItem
                      className={sideBarStyles.subMenuItem}
                      prefix={<IoIosArrowForward />}
                      onClick={() => {
                        window.location.href =
                          "/company/invoices/recurring/Customer";
                      }}
                    >
                      Recurring Invoices
                    </ReactProMenuItem>
                  </SubMenu>
                </ForCustomersOnly>
              </ForPermittedRolesOnly>
              <ForPermittedRolesOnly
                permissionEvaluationMode="any"
                mustHavePermissions={["AddExpenses"]}
                roleNames={userRoleNames}
                grantToAdmin={false}
              >
                <ForCustomersOnly>
                  <SubMenu
                    label="Supplier Invoices"
                    icon={<IconExpense className={styles.menuIcon} />}
                    title="Supplier Invoices"
                  >
                    <ReactProMenuItem
                      className={sideBarStyles.subMenuItem}
                      onClick={() => {
                        window.location.href =
                          "/company/invoices/list/Supplier";
                      }}
                      prefix={<IoIosArrowForward />}
                    >
                      Invoice List
                    </ReactProMenuItem>
                    <ReactProMenuItem
                      className={sideBarStyles.subMenuItem}
                      prefix={<IoIosArrowForward />}
                      onClick={() => {
                        window.location.href =
                          "/company/invoices/recurring/Supplier";
                      }}
                    >
                      Recurring Invoices
                    </ReactProMenuItem>
                  </SubMenu>
                </ForCustomersOnly>
              </ForPermittedRolesOnly>
              <ForPermittedRolesOnly
                grantToAdmin={false}
                mustHavePermissions={["ManageSettings"]}
                permissionEvaluationMode="all"
                roleNames={userRoleNames}
              >
                <ForCustomersOnly>
                  <ReactProMenuItem
                    onClick={() => {
                      window.location.href = "/company/settings";
                    }}
                    icon={<IconSettings className={styles.menuIcon} />}
                    title="Settings"
                  >
                    Settings
                  </ReactProMenuItem>
                </ForCustomersOnly>
              </ForPermittedRolesOnly>
              <ForBackOfficeOnly showOnDev={true}>
                <ReactProMenuItem
                  onClick={() => {
                    window.location.href = "/company/error-logs";
                  }}
                  icon={<IconLog className={styles.menuIcon} />}
                  title="Error Logs"
                >
                  Error Logs
                </ReactProMenuItem>
              </ForBackOfficeOnly>
              <ForBackOfficeOnly>
                <ReactProMenuItem
                  onClick={() => {
                    window.location.href = "/backoffice/companies-list";
                  }}
                  icon={<GiOrganigram className={styles.menuIcon} />}
                  title="Companies"
                >
                  Companies
                </ReactProMenuItem>
              </ForBackOfficeOnly>
              <ForPermittedRolesOnly
                grantToAdmin={true}
                permissionEvaluationMode="any"
                mustHavePermissions={["ManagePermissions"]}
                roleNames={userRoleNames}
              >
                <ReactProMenuItem
                  onClick={() =>
                    (window.location.href =
                      "/common/roles/" +
                      AuthenticatedUserTracker.authenticatedUser?.companyId)
                  }
                  icon={<TiGroup className={styles.menuIcon} />}
                  title="Roles"
                >
                  Roles
                </ReactProMenuItem>
              </ForPermittedRolesOnly>
              <ForPermittedRolesOnly
                grantToAdmin={true}
                permissionEvaluationMode="any"
                mustHavePermissions={["ManageUsers"]}
                roleNames={userRoleNames}
              >
                <ReactProMenuItem
                  onClick={() =>
                    (window.location.href =
                      "/backoffice/users/" +
                      AuthenticatedUserTracker.authenticatedUser?.companyId)
                  }
                  icon={<RiShieldUserLine className={styles.menuIcon} />}
                  title="Users"
                >
                  Users
                </ReactProMenuItem>
              </ForPermittedRolesOnly>
            </Menu>
          </Sidebar>
        ),
      },
    ];

    return menuItems;
  }

  private get content(): ReactNode {
    return (
      <WebShell
        menuVersion="BlankSlate"
        overrides={{ top: 100 }}
        isOpen={this.state.menuOpen}
        hideSearch={false}
        menuItems={this.menuItems}
      >
        <Navbar />
        <div className={styles.container}>{this.props.children}</div>
      </WebShell>
    );
  }

  render(): ReactNode {
    if (this.state.signInState === "out") {
      if (this.props.allowAnonymous === true) {
        return this.content;
      }
      return <Authentication />;
    } else if (this.state.signInState === "in") {
      return this.content;
    } else {
      return <>Loading...</>;
    }
  }
}
