import Account from "@/Account/UI/Account";
import layoutStyles from "@/styles/layout.module.css";
import { Recents } from "jattac.react.recents";
// import DefaultLayout from "@/layouts/ui/DefaultLayout";
import styles from "./styles/index.module.css";
import Dashboard from "../../../Dashboard/UI/Dashboard";
import Card from "@/Forms/Card/UI/Card";
// import Feed from "@/Feed/UI/Feed";

export default function Loader() {
  return (
    <Account>
      <div className={layoutStyles.workspace}>
        <div className={styles.container}>
          <Card title="">
            <Dashboard />
          </Card>
          <Recents />
          {/* <Feed /> */}
        </div>
      </div>
    </Account>
  );
}
