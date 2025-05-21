import { motion } from "framer-motion";
import styles from "../Styles/Dashboard.module.css";
import { PureComponent } from "react";
import DashboardLogic from "../Data/DashboardLogic";

const logic = new DashboardLogic();

export default class Dashboard extends PureComponent {
  async componentDidMount() {
    logic.setRerender(() => this.forceUpdate());
    await logic.initializeAsync();
  }
  render() {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>Financial Overview</h1>

        <h2 className={styles.sectionTitle}>This Month</h2>
        <div className={styles.cardsGrid}>
          {logic.repository.thisMonthCards.map((card, index) => (
            <motion.div
              key={index}
              className={styles.card}
              style={{ backgroundColor: card.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.icon}>{card.icon}</div>
              <div className={styles.content} onClick={card.onClick}>
                <h3>{card.title}</h3>
                <p>{card.formattedValue}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>All Time</h2>
        <div className={styles.cardsGrid}>
          {logic.repository.allTimeCards.map((card, index) => (
            <motion.div
              key={index}
              className={styles.card}
              style={{ backgroundColor: card.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.icon}>{card.icon}</div>
              <div
                className={styles.content}
                onClick={card.onClick}
                key={card.title}
              >
                <h3>{card.title}</h3>
                <p>{card.formattedValue}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
}
