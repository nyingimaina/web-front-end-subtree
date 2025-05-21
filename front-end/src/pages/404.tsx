import React from "react";
import styles from "./404.module.css";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.webp"; // Update path if needed
import { FiHome } from "react-icons/fi";

const Custom404: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <Image src={logo} alt="Lucent Ledger Logo" width={48} height={48} />
        <h2 className={styles.appName}>Lucent Ledger</h2>
      </div>

      <div className={styles.emojiContainer}>
        <div className={styles.emoji} role="img" aria-label="confused face">
          😕
        </div>
        <div className={styles.shadow}></div>
      </div>

      <h1 className={styles.title}>Oops! You&apos;re lost.</h1>
      <p className={styles.subtitle}>
        The page you&apos;re looking for isn&apos;t here. Maybe check the URL or
        head back home.
      </p>

      <Link href="/" className={styles.homeButton}>
        <FiHome className={styles.homeIcon} />
        <span>Go back home</span>
      </Link>
    </div>
  );
};

export default Custom404;
