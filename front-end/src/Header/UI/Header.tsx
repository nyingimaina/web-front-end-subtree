import React from "react";
import styles from "../Styles/Header.module.css";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.brandContainer}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.webp"
            alt="Lucent Ledger Logo"
            width={60}
            height={60}
          />
          <span className={styles.siteTitle}>Lucent Ledger</span>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-and-conditions">Terms & Conditions</Link>
        <Link href="/">Home</Link>
      </nav>
    </header>
  );
};

export default Header;
