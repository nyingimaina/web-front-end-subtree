import Textbox, { ITextboxProps } from "@/Forms/Textbox/UI/Textbox";
import Image from "next/image";
import { PureComponent, ReactNode } from "react";
import styles from "../Styles/PasswordTextbox.module.css";

interface IState {
  passwordVisible: boolean;
}
export default class PasswordTextbox extends PureComponent<
  ITextboxProps,
  IState
> {
  state = {
    passwordVisible: false,
  };

  render() {
    return (
      <Textbox
        {...this.props}
        type={this.state.passwordVisible ? "text" : "password"}
        suffixElement={this.passwordDisplayIcon}
      />
    );
  }

  private get passwordDisplayIcon(): ReactNode {
    return (
      <Image
        className={styles.passwordToggle}
        src={this.state.passwordVisible ? "/eye.svg" : "/eye-slash.svg"}
        alt="Password Visibility Toggle"
        width={20}
        height={20}
        onClick={() => {
          this.setState({
            passwordVisible: !this.state.passwordVisible,
          });
        }}
      />
    );
  }
}
