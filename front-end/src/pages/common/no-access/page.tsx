import Account from "@/Account/UI/Account";
import DefaultLayout from "@/layouts/ui/DefaultLayout";
import styles from "./Styles/NoAccess.module.css";

import layoutStyles from "@/styles/layout.module.css";
import { RiLock2Line } from "react-icons/ri";

export default function NoAccessPage() {
  return (
    <Account>
      <DefaultLayout title="Not Allowed">
        <div className={layoutStyles.workspace}>
          <div className={styles.container}>
            <div className={styles.column}>
              <div className={styles.icon}>
                <RiLock2Line />
              </div>
              <div className={styles.text}>
                Sorry. Looks like you are not allowed on this page. <br />
                <br />
                Please contact your admin if you feel this is a mistaken
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </Account>
  );
}
