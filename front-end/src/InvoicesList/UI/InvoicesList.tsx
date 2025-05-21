import ResponsiveTable from "jattac.libs.web.responsive-table";
import { PureComponent, ReactNode } from "react";
import InvoicesListLogic from "../State/InvoicesListLogic";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import styles from "../Styles/InvoicesList.module.css";
import Formatting from "@/Formatting";
import toast, { Toaster } from "react-hot-toast";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import { WebShellButton } from "jattac.libs.webshell";
import { IconAdd } from "@/IconsLibrary/Icons";
import IInvoice from "@/Invoices/Data/IInvoice";
import ConfirmationModal from "@/Modals/UI/ConfirmationModal";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import { FormControl, FormControlGroup, FormLabel } from "@/Forms/Form/UI/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import formStyles from "@/Forms/Form/Styles/Forms.module.css";
import Portify from "@/Portify/UI/Portify";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import InvoiceHelper from "@/Invoices/State/InvoiceHelper";
import FastLayout from "@/layouts/ui/FastLayout";
import { SplitButton } from "@leafygreen-ui/split-button";
import { MenuItem } from "@leafygreen-ui/menu";
import { MenuItemsType } from "@leafygreen-ui/split-button/dist/SplitButton/SplitButton.types";
import DateRangePicker from "./DateRangePicker";
import ReportingHelper from "../../../Reporting/ReportingHelper";
import AnimatedCard from "./AnimatedCard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PagesNavigator from "@/Pagination/UI/PagesNavigator";
import { motion } from "framer-motion";

const logic = new InvoicesListLogic();
interface IState {
  invoiceForPaymentModal?: IInvoice;
  invoiceForDeleteModal?: IInvoice;
  invoiceForBadDebtModal?: IInvoice;
}

interface IProps {
  invoiceTypeName: InvoiceTypeNames;
}

export default class InvoicesList extends PureComponent<IProps, IState> {
  state = {
    invoiceForPaymentModal: undefined,
  } as IState;

  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    this.setDateRangeFromQueryString();
    await logic.initializeAsync({ invoiceType: this.props.invoiceTypeName });
  }

  private getDeletionLabel(invoice: IInvoice): string {
    return invoice.deleted ? "Unarchive" : "Archive";
  }

  private get badDebtModal(): ReactNode {
    if (!this.state.invoiceForBadDebtModal) {
      return null;
    }

    const onClose = () => {
      this.setState({ invoiceForBadDebtModal: undefined });
    };
    return (
      <ConfirmationModal
        isOpen={!!this.state.invoiceForBadDebtModal}
        onClose={onClose}
        title={`Mark Invoice ${
          this.state.invoiceForBadDebtModal!.invoiceNumberPadded
        } As Bad Debt`}
        onConfirm={async () => {
          const succeeded = await logic.markAsBadDebt(
            this.state.invoiceForBadDebtModal!
          );
          if (succeeded === true) {
            toast.success(
              `Invoice ${
                this.state.invoiceForBadDebtModal!.invoiceNumberPadded
              } Marked As Bad Debt.`
            );
          } else {
            toast.error(
              `Could Not Mark Invoice ${
                this.state.invoiceForBadDebtModal!.invoiceNumberPadded
              } As Bad Debt.`
            );
          }
          return succeeded;
        }}
        onCancel={onClose}
        confirmButtonLabel={"Mark As Bad Debt"}
        cancelButtonLabel={`Don't Mark As Bad Debt`}
      >
        <div>
          Are you sure you want to mark invoice number{" "}
          <b>{this.state.invoiceForBadDebtModal!.invoiceNumberPadded}</b> as bad
          debt?
        </div>
      </ConfirmationModal>
    );
  }

  private get toggleDeletionModal(): ReactNode {
    if (!this.state.invoiceForDeleteModal) {
      return null;
    }
    const actionLabel = this.getDeletionLabel(this.state.invoiceForDeleteModal);
    const onClose = () => {
      this.setState({ invoiceForDeleteModal: undefined });
    };
    return (
      <ConfirmationModal
        isOpen={!!this.state.invoiceForDeleteModal}
        onClose={onClose}
        title={`${actionLabel} Invoice ${
          this.state.invoiceForDeleteModal!.invoiceNumberPadded
        }`}
        onConfirm={async () => {
          const succeeded = await logic.toggleArchivalAsync(
            this.state.invoiceForDeleteModal!
          );
          if (succeeded === true) {
            toast.success(
              `${actionLabel} of Invoice ${
                this.state.invoiceForDeleteModal!.invoiceNumberPadded
              } Succeeded.`
            );
          } else {
            toast.error(
              `Could Not ${actionLabel} Invoice ${
                this.state.invoiceForDeleteModal!.invoiceNumberPadded
              }.`
            );
          }
          return succeeded;
        }}
        onCancel={onClose}
        confirmButtonLabel={actionLabel}
        cancelButtonLabel={`Don't ${actionLabel}`}
      >
        <div>
          Are you sure you want to {actionLabel} invoice number{" "}
          <b>{this.state.invoiceForDeleteModal!.invoiceNumberPadded}</b>?
        </div>
      </ConfirmationModal>
    );
  }

  private get paymentModal(): ReactNode {
    if (!this.state.invoiceForPaymentModal) {
      return null;
    }

    const paidStatus = logic.getInvoiveStatus(
      this.state.invoiceForPaymentModal
    );

    const oppositeStatus =
      paidStatus === "Fully Paid" ? "Unpaid" : "Fully Paid";

    const question =
      paidStatus === "Fully Paid"
        ? `Would you like to mark invoice number <b>'${this.state.invoiceForPaymentModal.invoiceNumberPadded}'</b> as Unpaid?`
        : `If you would like to mark invoice number 
          <b>'${
            this.state.invoiceForPaymentModal!.invoiceNumberPadded
          }'</b> owed ${this.props.invoiceTypeName === "Customer" ? "by" : "to"}
          <b>'${
            this.state.invoiceForPaymentModal!.contactDisplayLabel
          }'</b> as paid,
          specify date paid, then click 'Mark As ${oppositeStatus}'.`;

    return (
      <ConfirmationModal
        isOpen={!!this.state.invoiceForPaymentModal}
        onClose={() => this.setState({ invoiceForPaymentModal: undefined })}
        title={`Mark Invoice ${
          this.state.invoiceForPaymentModal!.invoiceNumberPadded
        } As ${oppositeStatus}`}
        onConfirm={async () => {
          const succeeded = await logic.handlePaymentAsync(
            this.state.invoiceForPaymentModal!
          );
          if (succeeded === true) {
            toast.success(
              `Invoice ${
                this.state.invoiceForPaymentModal!.invoiceNumberPadded
              } marked as ${oppositeStatus}.`
            );
          } else {
            toast.error(
              `Error marking invoice ${
                this.state.invoiceForPaymentModal!.invoiceNumberPadded
              } as ${oppositeStatus}.`
            );
          }
          return succeeded;
        }}
        onCancel={() => this.setState({ invoiceForPaymentModal: undefined })}
        confirmButtonLabel={`Mark As ${oppositeStatus}`}
        cancelButtonLabel={`Cancel`}
      >
        <>
          <div dangerouslySetInnerHTML={{ __html: question }} />
          <HorizontalDivider />
          {paidStatus === "Unpaid" && (
            <div>
              <FormControlGroup>
                <FormLabel>Date Paid</FormLabel>
                <div className={styles.paymentDatePicker}>
                  <FormControl>
                    <Portify portal={document.body}>
                      <DatePicker
                        selected={
                          this.state.invoiceForPaymentModal.paymentDate ||
                          new Date()
                        }
                        maxDate={new Date()}
                        onChange={(dated) => {
                          dated = dated || new Date();
                          this.setState({
                            invoiceForPaymentModal: {
                              ...this.state.invoiceForPaymentModal!,
                              paymentDate: dated,
                            },
                          });
                        }}
                        dateFormat="MMMM dd, yyyy"
                        className={formStyles.dateTimePicker}
                      />
                    </Portify>
                  </FormControl>
                </div>
              </FormControlGroup>
            </div>
          )}
        </>
      </ConfirmationModal>
    );
  }

  private get modals(): ReactNode {
    return (
      <>
        {this.paymentModal}
        {this.toggleDeletionModal}
        {this.badDebtModal}
      </>
    );
  }

  private get contactTypeDisplayLabel(): string {
    return InvoiceHelper.getInvoiceTypeContactDisplayLabel({
      invoiceTypeName: this.props.invoiceTypeName,
    });
  }

  private get paginationControls(): ReactNode {
    return <PagesNavigator paginator={logic.paginator} />;
  }

  private get tableAndPagination(): ReactNode {
    return (
      <div>
        <div className={styles.tableContainer}>
          {this.table}
          <div className={styles.paginationContainer}>
            {this.paginationControls}
          </div>
        </div>
      </div>
    );
  }

  private get table(): ReactNode {
    return (
      <ResponsiveTable
        key={logic.repository.busy ? "loading" : "loaded"}
        data={logic.paginator.currentPageItems}
        columnDefinitions={[
          GetRowNumberColumn({
            page: logic.paginator.paginationState.page,
            pageSize: logic.paginator.paginationState.pageSize,
          }),
          {
            displayLabel: (
              <div className={styles.rightAlign}>Invoice Number</div>
            ),
            cellRenderer: (item) => (
              <div className={styles.rightAlign}>
                {item.invoiceNumberPadded}
              </div>
            ),
          },
          {
            displayLabel: <div className={styles.rightAlign}>Dated</div>,
            cellRenderer: (item) => (
              <div className={styles.rightAlign}>
                {Formatting.toDDMMMYYYY(item.dated)}
              </div>
            ),
          },
          {
            displayLabel: <div>{this.contactTypeDisplayLabel}</div>,
            cellRenderer: (item) => <div>{item.contactDisplayLabel}</div>,
          },
          {
            displayLabel: <div>Currency</div>,
            cellRenderer: (item) => <div>{item.currency}</div>,
          },
          {
            displayLabel: <div className={styles.rightAlign}>Gross Total</div>,
            cellRenderer: (item) => (
              <div className={styles.rightAlign}>
                {Formatting.toMoney({
                  amount: item.grossTotal,
                })}
              </div>
            ),
          },
          {
            displayLabel: <div className={styles.rightAlign}>Paid Amount</div>,
            cellRenderer: (item) => (
              <div className={styles.rightAlign}>
                {Formatting.toMoney({
                  amount: item.paidAmount,
                })}
              </div>
            ),
          },
          {
            displayLabel: (
              <div className={styles.rightAlign}>Pending Amount</div>
            ),
            cellRenderer: (item) => (
              <div className={styles.rightAlign}>
                {Formatting.toMoney({
                  amount: item.balance,
                })}
              </div>
            ),
          },
          {
            displayLabel: <div>Status</div>,
            cellRenderer: (item) => <div>{item.status}</div>,
          },
          {
            displayLabel: <div></div>,
            cellRenderer: (item) => {
              const isCustomer = this.props.invoiceTypeName === "Customer";
              const menuItems = [] as MenuItemsType;
              if (isCustomer === true) {
                menuItems.push(
                  <MenuItem
                    key="view-invoice"
                    onClick={() => {
                      window.document.location = `/company/invoices/document/${item.id}`;
                    }}
                  >
                    View Invoice
                  </MenuItem>
                );
                if (logic.canMarkAsBadDebt(item)) {
                  menuItems.push(
                    <MenuItem
                      key="mark-bad-debt"
                      onClick={async () => {
                        this.setState({ invoiceForBadDebtModal: item });
                      }}
                    >
                      Mark As Bad Debt
                    </MenuItem>
                  );
                }
                menuItems.push(
                  <MenuItem
                    key="send-to-customer"
                    onClick={async () => {
                      await logic.sendToCustomerAsync({ invoiceId: item.id });
                      toast.success("Invoice Sent To Customer.");
                    }}
                  >
                    Send To Customer
                  </MenuItem>
                );
              }
              if (logic.canToggleArchival(item)) {
                menuItems.push(
                  <MenuItem
                    key="delete"
                    onClick={() => {
                      this.setState({ invoiceForDeleteModal: item });
                    }}
                  >
                    {this.getDeletionLabel(item)} Invoice
                  </MenuItem>
                );
              }
              return (
                <div className={styles.actions}>
                  <SplitButton
                    onClick={() => {
                      if (logic.canTogglePaid(item)) {
                        this.setState({ invoiceForPaymentModal: item });
                      }
                    }}
                    darkMode={false}
                    label={
                      logic.canTogglePaid(item) === false
                        ? "..."
                        : item.balance === 0
                        ? "Mark As Unpaid"
                        : "Mark Paid"
                    }
                    renderDarkMenu={false}
                    menuItems={menuItems}
                  />
                </div>
              );
            },
          },
        ]}
      />
    );
  }

  setDateRangeFromQueryString() {
    const params = new URLSearchParams(window.location.search);
    const startDateParam = params.get("startDate");
    const endDateParam = params.get("endDate");

    const startDate = startDateParam
      ? new Date(startDateParam)
      : ReportingHelper.firstDayOfThisMonth;
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    logic.setDates({
      startDate: startDate,
      endDate: endDate,
    });
  }

  render(): React.ReactNode {
    const { invoiceTypeName } = this.props;
    const { startDate, endDate } = logic.repository;

    const unpaidInvoicesCount = logic.paginator.currentPageItems.filter(
      (item) => item.status === "Unpaid"
    ).length;
    const paidInvoicesCount = logic.paginator.currentPageItems.filter(
      (item) => item.status === "Fully Paid"
    ).length;
    const pendingAmount = logic.paginator.currentPageItems
      .filter((item) => item.status === "Unpaid")
      .reduce((total, item) => total + item.balance, 0);

    return (
      <FastLayout title={`${invoiceTypeName} Invoice`}>
        <FrostedGlassOverlay show={logic.repository.busy}>
          <Toaster />
          <div className={styles.invoicesListHeader}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={(date) =>
                logic.setDates({
                  startDate: date ?? ReportingHelper.firstDayOfThisMonth,
                })
              }
              setEndDate={(date) => {
                logic.setDates({
                  endDate: date ?? new Date(),
                });
              }}
            />
            <div>
              <div className={styles.cardsTitleContainer}>
                <motion.h2
                  className={styles.cardsTitle}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  Quick Summary
                </motion.h2>
              </div>

              <div className={styles.cardsContainer}>
                <AnimatedCard
                  title="Unpaid Invoices"
                  value={unpaidInvoicesCount}
                  color="red"
                />
                <AnimatedCard
                  title="Paid Invoices"
                  value={paidInvoicesCount}
                  color="green"
                />
                <AnimatedCard
                  title="Pending Amount"
                  value={Formatting.toMoney({
                    amount: pendingAmount,
                  })}
                  color="blue"
                />
              </div>
            </div>
          </div>

          <ActionPanel className={styles.addInvoiceButtonContainer}>
            <WebShellButton
              buttonType="positive"
              onClick={() => {
                window.location.href = `/company/invoices/manage/${invoiceTypeName}`;
              }}
            >
              <div className={styles.addInvoiceButton}>
                <IconAdd className={styles.addInvoiceButtonIcon} />
                Add Invoice
              </div>
            </WebShellButton>
          </ActionPanel>

          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  logic.invoiceWindow = "Active";
                }}
              >
                Active
              </Tab>
              <Tab
                onClick={() => {
                  logic.invoiceWindow = "Archived";
                }}
              >
                Archived
              </Tab>
              <Tab
                onClick={() => {
                  logic.invoiceWindow = "BadDebt";
                }}
              >
                Bad Debts
              </Tab>
            </TabList>

            <TabPanel>{this.tableAndPagination}</TabPanel>
            <TabPanel>{this.tableAndPagination}</TabPanel>
            <TabPanel>{this.tableAndPagination}</TabPanel>
          </Tabs>

          {this.modals}
        </FrostedGlassOverlay>
      </FastLayout>
    );
  }
}
