import React, { ReactNode, useState } from "react";
import styles from "../Styles/Alerts.module.css";

type AlertType = "info" | "success" | "error";

interface AlertProps {
  type: AlertType;
  message: ReactNode;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
