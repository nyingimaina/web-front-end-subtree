import styles from "../Styles/Homepage.module.css";
import { useRouter } from "next/router";

export default function Homepage() {
  const router = useRouter();
  const dashboard = "/dashboard";

  return (
    <div className={styles.container}>
      {/* HEADER & HERO */}
      <header className={styles.header}>
        <div className={styles.nav}>
          <h1 className={styles.logo}>Lucent Ledger</h1>
          <nav className={styles.links}>
            <a href="#features">Features</a>
            <a href="#why">Why Lucent</a>
            <button
              className={styles.navButton}
              onClick={() => router.push(dashboard)}
            >
              My Dashboard
            </button>
          </nav>
        </div>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h2>Effortless Financial Clarity for Modern Businesses</h2>
            <p>
              Lucent Ledger empowers individuals and teams to take control of
              their finances with clarity, confidence, and ease. Whether
              you&apos;re a freelancer, entrepreneur, or small business owner,
              our platform adapts to your needs— delivering powerful insights
              without the complexity.
            </p>
            <button
              className={styles.ctaButton}
              onClick={() => router.push(dashboard)}
            >
              Get Started – It’s Free
            </button>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className={styles.section}>
        <h3>Built for Precision. Designed for Simplicity.</h3>
        <ul className={styles.features}>
          <li>
            <strong>Automated Expense Tracking:</strong> Eliminate manual entry
            and stay on top of every transaction effortlessly.
          </li>
          <li>
            <strong>Intelligent Categorization:</strong> Our smart engine
            organizes your income and expenses in real-time.
          </li>
          <li>
            <strong>Custom Dashboards & Reports:</strong> Visualize your
            financial health with clarity and make informed decisions at a
            glance.
          </li>
          <li>
            <strong>Enterprise-Grade Security:</strong> Your financial data is
            protected with best-in-class privacy controls.
          </li>
        </ul>
      </section>

      {/* WHY US */}
      <section id="why" className={styles.sectionAlt}>
        <h3>Trusted by Professionals. Accessible to All.</h3>
        <p>
          Lucent Ledger bridges the gap between sophisticated accounting tools
          and intuitive design. Built by finance and software experts, it scales
          with you—from side hustle to enterprise. Experience a platform that
          works for you as hard as you do.
        </p>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
        </div>
        <p>© {new Date().getFullYear()} Lucent Ledger. All rights reserved.</p>
      </footer>
    </div>
  );
}
