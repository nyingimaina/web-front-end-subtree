import React from "react";
import styles from "../Styles/PrivacyPolicy.module.css";
import Header from "@/Header/UI/Header";
import Footer from "@/Footer/UI/Footer";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Privacy Policy</h1>
        <p>Effective Date: April 26, 2025</p>
      </header>

      <section className={styles.section}>
        <h2>Introduction</h2>
        <p>
          At Lucent Ledger, we value your privacy and are committed to
          protecting your personal data. This Privacy Policy outlines the types
          of information we collect, how we use it, and how we protect your
          privacy.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Information We Collect</h2>
        <ul>
          <li>
            <strong>Personal Information:</strong> We collect personal
            information such as your name, email address, and billing details to
            provide our services.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect data about how you
            interact with our services, including but not limited to IP
            addresses, browser types, and usage patterns.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies to improve your experience
            on our site and track website performance.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Process payments and manage subscriptions.</li>
          <li>
            Communicate with you regarding account updates, billing, and
            customer support.
          </li>
          <li>Ensure security and prevent fraudulent activity.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your
          personal information. However, no data transmission over the internet
          is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Request the correction of any inaccuracies in your data.</li>
          <li>
            Request the deletion of your personal information, subject to legal
            requirements.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we will update the effective date above.
          Please check this page regularly to stay informed.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>
          For questions or concerns, please contact us at{" "}
          <a href="mailto:support@lucent-ledger.com">
            support@lucent-ledger.com
          </a>
          .
        </p>
      </footer>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
