import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import FastLayout from "@/layouts/ui/FastLayout";
import { PureComponent } from "react";
import ViewInvoiceRepetitionTrackerLogic from "../State/ViewInvoiceRepetitionTrackerLogic";
import { GetRowNumberColumn } from "@/ResponsiveTableHelper";
import PagedTable from "@/Forms/PagedTable/UI/PagedTable";
import Formatting from "@/Formatting";
import Statics from "../../../Statics";

interface IProps {
  invoiceType: InvoiceTypeNames;
}

const logic = new ViewInvoiceRepetitionTrackerLogic();

export default class RecurringInvoices extends PureComponent<IProps> {
  async componentDidMount() {
    logic.setRerender(this.forceUpdate.bind(this));
    logic.initialize({
      invoiceType: this.props.invoiceType,
    });
    await logic.paginator.fetchPage();
  }

  render() {
    return (
      <FastLayout title="Recurring Invoices">
        <FrostedGlassOverlay show={false}>
          <PagedTable
            paginator={logic.paginator}
            data={logic.paginator.currentPageItems}
            columnDefinitions={[
              GetRowNumberColumn({
                page: logic.paginator.paginationState.page,
                pageSize: logic.paginator.paginationState.pageSize,
              }),
              {
                displayLabel: this.props.invoiceType,
                cellRenderer: (item) => {
                  return item.contactDisplayLabel;
                },
              },
              {
                displayLabel: "Last Invoice Date",
                cellRenderer: (item) => {
                  return (
                    <div>
                      {Statics.IsminCSharpDate(item.lastInvoiceDate) === false
                        ? Formatting.toDDMMMYYYY(item.lastInvoiceDate)
                        : "N/A"}
                    </div>
                  );
                },
              },
              {
                displayLabel: "Last Invoice Number",
                cellRenderer: (item) => {
                  return (
                    <div>
                      {item.lastInvoiceNumberPadded &&
                      item.lastInvoiceNumberPadded.replaceAll("0", "")
                        ? item.lastInvoiceNumberPadded
                        : "N/A"}
                    </div>
                  );
                },
              },
              {
                displayLabel: "Next Scheduled Date",
                cellRenderer: (item) => {
                  return (
                    <div>{Formatting.toDDMMMYYYY(item.nextScheduledDate)}</div>
                  );
                },
              },
            ]}
          />
        </FrostedGlassOverlay>
      </FastLayout>
    );
  }
}
