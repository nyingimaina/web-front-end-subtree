import { PureComponent } from "react";
import styles from "../Styles/Pagination.module.css";
import { WebShellButton } from "jattac.libs.webshell";
import Paginator from "../Paginator";

interface IProps<T> {
  paginator: Paginator<T>;
}
export default class PagesNavigator<T> extends PureComponent<IProps<T>> {
  render() {
    return (
      <div className={styles.container}>
        <WebShellButton
          buttonType="neutral"
          onClick={async () => {
            await this.props.paginator.previousPage();
            this.forceUpdate();
          }}
          disabled={this.props.paginator.paginationState.page === 1}
        >
          Previous
        </WebShellButton>
        <div>Page: {this.props.paginator.paginationState.page}</div>
        <WebShellButton
          buttonType="neutral"
          onClick={async () => {
            await this.props.paginator.nextPage();
            this.forceUpdate();
          }}
          disabled={this.props.paginator.paginationState.isOnLastPage === true}
        >
          Next
        </WebShellButton>
      </div>
    );
  }
}
