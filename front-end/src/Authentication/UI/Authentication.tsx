import { PureComponent, ReactNode } from "react";
import styles from "../Styles/Authentication.module.css";
import SignInForm from "./SignInForm";

export default class Authentication extends PureComponent {
  render(): ReactNode {
    return (
      <div className={styles.container}>
        <div className={`${styles.child} ${styles.loginImage}`} />
        <div className={styles.child}>
          <SignInForm />
        </div>
      </div>
    );
  }
}
