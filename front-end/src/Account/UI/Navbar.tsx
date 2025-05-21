import Link from "next/link";
import styles from "../Styles/Navbar.module.css";
import Image from "next/image";
import Statics from "../../../Statics";

export default function Navbar() {
  return (
    <div className={styles.navbarCustom}>
      <div className={styles.container}>
        <div className={styles.logoBox}>
          <Link href={"/"} className={`${styles.logo} ${styles.logoLight}`}>
            <Image src={"/logo.webp"} alt="Logo" width={60} height={60} />
          </Link>
          <Link href={"/"} className={`${styles.logo} ${styles.logoLight}`}>
            <div className={styles.title}>{Statics.appName}</div>
          </Link>
        </div>
        <div className={styles.searchBox}></div>
      </div>
    </div>
  );
}
