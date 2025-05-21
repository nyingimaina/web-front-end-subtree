import { PureComponent, ReactNode } from "react";
import BasicModal from "./BasicModal";
import HorizontalDivider from "@/Forms/Divider/UI/HorizontalDivider";
import ActionPanel from "@/ActionPanel/UI/ActionPanel";
import { WebShellButton } from "jattac.libs.webshell";

interface IProps{
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    onConfirm: () => boolean | Promise<boolean>;
    onCancel?: () => void;
    width?: string;
    confirmButtonLabel?: string;
    cancelButtonLabel?: string;
}


export default class ConfirmationModal extends PureComponent<IProps> {
  render() {
    return (
      <BasicModal
        isOpen={this.props.isOpen}
        onClose={() => {
          if (this.props.onClose) {
            this.props.onClose();
          }
        }}
        title={this.props.title}
        width={this.props.width}
      >
        <>
        {this.props.children}
        <HorizontalDivider />
        <ActionPanel>
            <WebShellButton
              buttonType="positive"
              onClick={async () => {
                if (this.props.onConfirm) {
                  const succeeded = await this.props.onConfirm();
                  if (succeeded) {
                    if (this.props.onClose) {
                      this.props.onClose();
                    }
                  }
                }
              }}
            >
              {this.props.confirmButtonLabel || "Yes"}
            </WebShellButton>
            <WebShellButton
              buttonType="negative"
              onClick={() => {
                if (this.props.onCancel) {
                  this.props.onCancel();
                  return;
                }
                if (this.props.onClose) {
                  this.props.onClose();
                }
              }}
            >
              {this.props.cancelButtonLabel || "No"}
            </WebShellButton>
          </ActionPanel>
        </>
      </BasicModal>
    );
  }
}