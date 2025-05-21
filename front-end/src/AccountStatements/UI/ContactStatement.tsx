import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import { PureComponent } from "react";
import layoutStyles from "@/styles/layout.module.css";
import AccountStatementLogic from "../State/AccountStatementLogic";
import ResponsiveTable from "jattac.libs.web.responsive-table";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import Formatting from "@/Formatting";
import styles from "../Styles/AccountStatements.module.css";

interface IProps {
  contactId: string;
}

const logic = new AccountStatementLogic();
export default class ContactStatement extends PureComponent<IProps> {
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync({
      contactId: this.props.contactId,
      invoiceType: "Customer",
      startDate: new Date(1990, 0, 1),
      endDate: new Date(),
    });
  }
  render() {
    let runningTotal = 0;
    return (
      <DefaultLayout
        title="Account Statement"
        className={` ${layoutStyles.pullUpContent}`}
      >
        <FrostedGlassOverlay show={logic.repository.busy}>
          <div className={`${layoutStyles.workspace}`}>
            <ResponsiveTable
              data={logic.repository.transactions}
              columnDefinitions={[
                GetRowNumberColumn(),
                {
                  displayLabel: <div>Date</div>,
                  cellRenderer: (item) => (
                    <div>{Formatting.toDDMMMYYYY(item.dated)}</div>
                  ),
                },
                {
                  displayLabel: <div>Description</div>,
                  cellRenderer: (item) => item.description,
                },
                {
                  displayLabel: (
                    <div className={styles.rightAlign}>Invoiced Amount</div>
                  ),
                  cellRenderer: (item) => {
                    runningTotal += item.invoiceAmount;
                    return (
                      <div className={styles.rightAlign}>
                        {Formatting.toMoney({ amount: item.invoiceAmount })}
                      </div>
                    );
                  },
                },
                {
                  displayLabel: (
                    <div className={styles.rightAlign}>Paid Amount</div>
                  ),
                  cellRenderer: (item) => {
                    runningTotal = runningTotal - item.paymentAmount;
                    return (
                      <div className={styles.rightAlign}>
                        {Formatting.toMoney({
                          amount: item.paymentAmount,
                        })}
                      </div>
                    );
                  },
                },
                {
                  displayLabel: (
                    <div className={styles.rightAlign}>Running Total</div>
                  ),
                  cellRenderer: () => (
                    <div className={styles.rightAlign}>
                      {Formatting.toMoney({ amount: runningTotal })}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </FrostedGlassOverlay>
      </DefaultLayout>
    );
  }
}
