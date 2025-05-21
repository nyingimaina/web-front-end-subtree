import { Form, FormRow } from "@/Forms/Form/UI/Form";
import FrostedGlassOverlay from "@/FrostedGlassOverlay/UI/FrostedGlassOverlay";
import { IconCustomer, IconSupplier } from "@/IconsLibrary/Icons";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import { PureComponent } from "react";
import styles from "../Styles/AccountStatements.module.css";

export default class AccountStatementPick extends PureComponent {
  render() {
    return (
      <DefaultLayout title="Pick Statements To View">
        <FrostedGlassOverlay show={false}>
          <Form>
            <FormRow className={styles.iconContainer}>
              <div className={styles.icon}>
                <IconCustomer></IconCustomer>
                <div className={styles.iconText}>Customer</div>
              </div>
              <div className={styles.icon}>
                <IconSupplier />
                <div className={styles.iconText}>Supplier</div>
              </div>
            </FormRow>
          </Form>
        </FrostedGlassOverlay>
      </DefaultLayout>
    );
  }
}
