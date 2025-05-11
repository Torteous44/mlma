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
          Mortgage lending plays a critical role in economic stability. Yet,
          traditional methods for approving or denying loans often rely on
          rigid, manual processes prone to inefficiencies and biases. These
          outdated methods not only lead to inconsistent decisions but can also
          inadvertently perpetuate discrimination or unfair lending practices.
        </div>
        <div className={styles.sampleText}>
          This research investigates the potential of advanced machine learning
          techniques to automate mortgage approval decisions. By doing so, we
          aim to enhance both accuracy and fairness within lending practices.
          Leveraging extensive borrower data—including demographic information,
          financial details, and credit histories—we illustrate how predictive
          modeling significantly streamlines the loan decision-making process.
        </div>
        <div className={styles.sampleText}>
          Our approach addresses key industry challenges, such as mitigating
          bias, improving decision consistency, and enhancing transparency. The
          demonstration presented in this research highlights the effectiveness
          and interpretability of machine learning techniques, underscoring
          their practical implications for the mortgage industry.
        </div>
        <div className={styles.sampleText}>
          The study utilizes two robust and widely recognized datasets: the Home
          Mortgage Disclosure Act (HMDA) dataset and the Survey of Consumer
          Finances (SCF). The HMDA dataset, mandated by U.S. federal
          regulations, contains detailed records on millions of mortgage
          applications annually. It includes comprehensive demographic data on
          applicants, loan specifics, outcomes (approval or denial), and reasons
          behind loan rejections.
        </div>
        <div className={styles.sampleText}>
          Complementing HMDA, the SCF dataset—collected by the U.S. Federal
          Reserve—offers detailed household-level financial data. It encompasses
          income, assets, debts, and credit histories, providing invaluable
          insights into consumer financial behaviors and stability. By
          harmonizing these two datasets, we establish a solid analytical
          foundation for training machine learning models.
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollableContent;
