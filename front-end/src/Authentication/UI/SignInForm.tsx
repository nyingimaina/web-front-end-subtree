import { PureComponent, ReactNode } from "react";
import styles from "../Styles/SignInForm.module.css";
import Image from "next/image";
import formStyles from "@/Forms/Form/Styles/Forms.module.css";
import Textbox from "@/Forms/Textbox/UI/Textbox";
import StandardButton from "@/Forms/Buttons/Standard/UI/StandardButton";
import AuthenticationLogic from "../State/AuthenticationLogic";

import toast, { Toaster } from "react-hot-toast";

interface IState {
  passwordVisible: boolean;
}

const logic = new AuthenticationLogic();

export default class SignInForm extends PureComponent<object, IState> {
  state = {
    passwordVisible: false,
  } as IState;

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

  componentDidMount(): void {
    window.document.title = "Sign In";
    logic.setRerender(() => this.forceUpdate());
  }

  render() {
    return (
      <div className={styles.container}>
        <Toaster />
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            <Image src="/logo.webp" width={145} height={145} alt="Logo" />
          </div>
          <div className={styles.formArea}>
            <label className={formStyles.formLabel} htmlFor="emailaddress">
              Email
            </label>
            <Textbox
              id="emailaddress"
              type="email"
              required={true}
              placeholder="Enter your email"
              width="100%"
              value={logic.model.email}
              onChange={(e) => {
                logic.updateModel({ email: e.target.value });
              }}
            />
            <div className={styles.passwordContainer}>
              <label className={formStyles.formLabel} htmlFor="password">
                Password
              </label>
              <Textbox
                id="password"
                type={this.state.passwordVisible ? "text" : "password"}
                required={true}
                placeholder="Enter your password"
                width="100%"
                value={logic.model.password}
                onChange={(e) => {
                  logic.updateModel({ password: e.target.value });
                }}
                suffixElement={this.passwordDisplayIcon}
              />
            </div>
            <div className={styles.signInButton}>
              <StandardButton
                type="primary"
                width="100%"
                disabled={logic.canCallApi ? false : true}
                onClick={async () => {
                  await toast.promise(logic.signInAsync(), {
                    loading: "Signing you in",
                    success: "Welcome",
                    error: "Invalid username or password. Please try again.",
                  });
                  window.location.href = "/dashboard";
                }}
              >
                Sign In
              </StandardButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
