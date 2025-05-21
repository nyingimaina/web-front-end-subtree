import StyledTable, {
  IStyledTableProps,
} from "@/Forms/StyledTable/UI/StyledTable";
import Paginator from "@/Pagination/Paginator";
import { PureComponent } from "react";
import styles from "../Styles/PagedTable.module.css";
import PagesNavigator from "@/Pagination/UI/PagesNavigator";

interface IPagedTableProps<TData> extends IStyledTableProps<TData> {
  paginator: Paginator<TData>;
}
export default class PagedTable<TData> extends PureComponent<
  IPagedTableProps<TData>
> {
  render() {
    return (
      <>
        <StyledTable {...this.props} />
        <div className={styles.paginatorContainer}>
          <PagesNavigator paginator={this.props.paginator} />
        </div>
      </>
    );
  }
}
