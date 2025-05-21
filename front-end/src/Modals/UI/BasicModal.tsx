import ModalDialog from "jattac.libs.web.modal";
import { PureComponent, ReactNode } from "react";
import styles from "../Styles/Modals.module.css";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";

interface IProps {
  title?: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  width?: string;
}

export default class BasicModal extends PureComponent<IProps> {
  state = { isFadingOut: false };

  handleClose = () => {
    this.setState({ isFadingOut: true });
    setTimeout(() => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    }, 300); // Match the fade-out animation duration
  };

  render() {
    const fadeClass = this.state.isFadingOut ? styles.fadeOut : styles.fadeIn;

    return (
      <ModalDialog isOpen={this.props.isOpen} onClose={this.handleClose}>
        <div className={`${styles.title} ${fadeClass}`}>
          <div>{this.props.title}</div>
          {this.props.onClose && (
            <div className={styles.closer} onClick={this.handleClose}>
              X
            </div>
          )}
        </div>
        <HorizontalDivider width={this.props.width} />
        <div className={fadeClass}>{this.props.children}</div>
        <div id="modal-portal" />
      </ModalDialog>
    );
  }
}
