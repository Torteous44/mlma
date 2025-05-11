import React from "react";
import styles from "./DemoCard.module.css";
import Button from "../ui/Button";

const DemoCard: React.FC = () => {
  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoCard}>
        <div className={styles.topContent}>
          <h2 className={styles.demoTitle}>Begin Your Mortgage Assessment</h2>
          <p className={styles.guideText}>
            Choose how you would like to proceed
          </p>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.optionsContainer}>
            <div className={styles.optionItem}>
              <Button variant="primary" fullWidth size="large">
                Upload Document
              </Button>
            </div>
            <div className={styles.optionOr}>or</div>
            <div className={styles.optionItem}>
              <Button variant="secondary" fullWidth size="large">
                Complete Manually
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.bottomContent}>
          <div className={styles.helpIcon}>?</div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;
