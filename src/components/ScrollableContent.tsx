import React, { useRef } from "react";
import styles from "./ScrollableContent.module.css";
import { motion, useScroll, useSpring } from "framer-motion";

const ScrollableContent: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's useScroll hook to track scroll position
  const { scrollYProgress } = useScroll({
    container: scrollRef,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Add spring physics to the scroll for a smoother, slightly sticky feel
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 55, // Lower stiffness for more "stickiness"
    damping: 0.5, // Balanced damping for natural feel
    restDelta: 0.001, // Small threshold for considering motion as "stopped"
    mass: 0.8, // Slightly lighter mass for more responsive feel
  });

  return (
    <div
      className={styles.scrollContainer}
      ref={scrollRef}
      style={{
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        overscrollBehavior: "contain",
      }}
    >
      <motion.div className={styles.scrollContent}>
        <h2>Automated Mortgage Decisions Using Machine Learning</h2>
        <p>
          Boris Gans, Lea Abou Jaude, Lucas Van Zyl, Hala Yaghi, and Matthew
          Porteous
        </p>
        <div className={styles.sampleText}>
          Mortgage lending is crucial for economic stability, yet traditional
          approval methods often rely on rigid, manual processes that lead to
          inconsistencies and potential bias. These outdated approaches can
          inadvertently perpetuate discrimination in lending practices.
        </div>
        <div className={styles.sampleText}>
          Our research explores how advanced machine learning techniques can
          automate mortgage approval decisions, enhancing both accuracy and
          fairness. By analyzing comprehensive borrower data—including
          demographics, finances, and credit histories—we demonstrate how
          predictive modeling streamlines decision-making while addressing key
          challenges of bias mitigation, consistency, and transparency.
        </div>
        <div className={styles.sampleText}>
          This demonstration highlights the practical applications and
          interpretability of these techniques for the mortgage industry.
        </div>

        <h3>Research Data Foundation</h3>
        <div className={styles.sampleText}>
          We built our analysis on two complementary datasets:
        </div>
        <div className={styles.sampleText}>
          <strong>Home Mortgage Disclosure Act (HMDA):</strong> This federally
          mandated dataset contains millions of mortgage application records
          with detailed information on applicant demographics, loan specifics,
          approval outcomes, and rejection reasons.
        </div>
        <div className={styles.sampleText}>
          <strong>Survey of Consumer Finances (SCF):</strong> Collected by the
          U.S. Federal Reserve, this dataset provides granular household
          financial data on income, assets, debts, and credit histories. While
          HMDA offers broad mortgage application outcomes, SCF contributes rich
          financial details typically unavailable in transactional data.
        </div>

        <h3>Data Integration Methodology</h3>
        <div className={styles.sampleText}>
          After cleaning both datasets to standardize formats and handle missing
          values, we implemented a custom matching process using feature
          similarity approaches. Our methodology incorporated preprocessing
          pipelines with StandardScaler, OneHotEncoder, and clustering
          techniques like KMeans.
        </div>
        <div className={styles.sampleText}>
          We validated the integration by ensuring logical consistency between
          matched pairs and analyzing key variable distributions post-merge. The
          resulting combined dataset (hmda_scf_full_matched.csv) merges HMDA
          loan outcomes with detailed SCF financial indicators, creating a
          robust foundation for both loan approval prediction (classification)
          and loan amount estimation (regression).
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollableContent;
