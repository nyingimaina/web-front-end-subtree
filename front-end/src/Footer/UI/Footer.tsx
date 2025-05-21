import React from "react";
import styles from "../Styles/Footer.module.css";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-and-conditions">Terms & Conditions</Link>
      </div>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Lucent Ledger. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
