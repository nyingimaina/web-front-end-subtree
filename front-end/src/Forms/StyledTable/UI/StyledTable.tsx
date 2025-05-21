import ResponsiveTable, {
  IResponsiveTableColumnDefinition,
} from "jattac.libs.web.responsive-table";
import React, { ReactNode } from "react";
import styles from "../Styles/StyledTable.module.css";

type ColumnDefinition<TData> =
  | IResponsiveTableColumnDefinition<TData>
  | ((
      data: TData,
      rowIndex?: number
    ) => IResponsiveTableColumnDefinition<TData>);
interface IStyledTableProps<TData> {
  columnDefinitions: ColumnDefinition<TData>[];
  data: TData[];
  noDataComponent?: ReactNode;
  maxHeight?: string;
  onRowClick?: (item: TData) => void;
}

export type { IStyledTableProps };

export default class StyledTable<TData> extends React.Component<
  IStyledTableProps<TData>
> {
  render() {
    return (
      <div className={styles.tableContainer}>
        <ResponsiveTable {...this.props} />
      </div>
    );
  }
}
