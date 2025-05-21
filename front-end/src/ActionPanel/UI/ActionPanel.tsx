import { ReactNode } from "react";
import styles from "../Styles/ActionPanel.module.css";
export default function ActionPanel(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.actionPanel} ${props.className}`}>
      {props.children}
    </div>
  );
}
