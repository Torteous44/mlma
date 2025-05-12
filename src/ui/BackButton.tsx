import React from "react";
import styles from "./BackButton.module.css";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back",
  className = "",
}) => {
  return (
    <button
      className={`${styles.backButton} ${className}`}
      onClick={onClick}
      aria-label="Go back"
    >
      <span className={`material-symbols-outlined ${styles.chevron}`}>
        chevron_left
      </span>
      {label}
    </button>
  );
};

export default BackButton;
