import { useState, useEffect, useRef } from "react";
import styles from "../Styles/AnimatedCard.module.css";

const AnimatedCard: React.FC<{
  title: string;
  value: string | number;
  color: string;
  onSelectedChanged?: (selected: boolean) => void;
}> = ({ title, value, color, onSelectedChanged }) => {
  const [isSelected, setIsSelected] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const titleLength = title.length;
      titleRef.current.style.fontSize = `${Math.max(
        1.2 - titleLength * 0.02,
        0.8
      )}rem`;
    }
    if (valueRef.current) {
      const valueLength = value.toString().length;
      valueRef.current.style.fontSize = `${Math.max(
        2 - valueLength * 0.05,
        1
      )}rem`;
    }
  }, [title, value]);

  const toggleSelected = () => {
    const newSelectedState = !isSelected;
    setIsSelected(!isSelected);
    if (onSelectedChanged) {
      onSelectedChanged(newSelectedState);
    }
  };

  return (
    <div
      className={`${styles.animatedCard} ${isSelected ? styles.selected : ""}`}
      style={{ borderColor: color }}
      onClick={toggleSelected}
    >
      <div ref={titleRef} className={styles.cardTitle}>
        {title}
      </div>
      <div ref={valueRef} className={styles.cardValue}>
        {value}
      </div>
    </div>
  );
};

export default AnimatedCard;
