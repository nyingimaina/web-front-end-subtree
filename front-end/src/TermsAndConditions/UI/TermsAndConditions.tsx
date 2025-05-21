import React from "react";
import styles from "../Styles/TermsAndConditions.module.css";
import Header from "@/Header/UI/Header";
import Footer from "@/Footer/UI/Footer";

const TermsAndConditions: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Terms and Conditions</h1>
        <p>Effective Date: April 26, 2025</p>
      </header>

      <section className={styles.section}>
        <h2>Introduction</h2>
        <p>
          Welcome to Lucent Ledger! By using our services, you agree to comply
          with and be bound by these Terms and Conditions. Please read these
          terms carefully. If you do not agree with any of the terms, you must
          stop using our services.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using Lucent Ledger, you agree to abide by these Terms
          and Conditions and any other applicable law or regulation. If you are
          using our services on behalf of an organization, you represent that
          you have the authority to bind that organization to these terms.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Services Provided</h2>
        <p>
          Lucent Ledger offers software as a service (SaaS) to help businesses
          track income and expenses. We provide features such as invoicing,
          financial reporting, and account management to facilitate business
          accounting tasks.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Account Registration</h2>
        <p>
          To access certain features, you must create an account. You agree to
          provide accurate and complete information during the registration
          process and to update your account details as necessary to keep them
          current.
        </p>
      </section>

      <section className={styles.section}>
        <h2>User Obligations</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any illegal or fraudulent purposes.</li>
          <li>
            Engage in any activity that could harm or disrupt the service.
          </li>
          <li>
            Access or attempt to access another user&apos;s account without
            permission.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Payment and Billing</h2>
        <p>
          You agree to pay any applicable fees for using Lucent Ledger&apos;s
          premium services as outlined during registration or in the user
          interface. All fees are non-refundable unless otherwise specified in a
          separate agreement.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Limitation of Liability</h2>
        <p>
          Lucent Ledger is not liable for any damages arising from the use or
          inability to use our services, including loss of data, revenue, or
          other intangible losses. Our liability is limited to the amount you
          have paid for the service within the last 12 months.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Changes to the Terms</h2>
        <p>
          We reserve the right to modify or update these Terms and Conditions at
          any time. Any changes will be posted on this page with an updated
          effective date. Please review this page regularly to stay informed.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Termination</h2>
        <p>
          We may terminate or suspend your access to the service at any time,
          without prior notice, if you violate these Terms and Conditions or for
          any other reason. Upon termination, you will lose access to your
          account and any data stored within.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>
          If you have any questions regarding these Terms and Conditions, please
          contact us at{" "}
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

export default TermsAndConditions;
