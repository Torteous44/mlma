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
          Mortgage lending is a cornerstone of economic stability. However,
          traditional approval methods often involve manual, rigid processes.
          This can lead to inconsistencies and potential unfairness, sometimes
          unintentionally continuing discriminatory lending practices.
        </div>
        <div className={styles.sampleText}>
          Our research explores how advanced machine learning techniques can
          automate mortgage approval decisions, aiming to improve both accuracy
          and fairness. By analyzing comprehensive borrower data—including
          demographics, financial details, and credit histories—we show how
          these sophisticated models can streamline decision-making while
          tackling key challenges like reducing bias, ensuring consistency, and
          increasing transparency.
        </div>
        <div className={styles.sampleText}>
          This demonstration highlights the practical uses and the clear,
          understandable nature of these techniques for the mortgage industry.
        </div>

        <h3>Research Data Foundation</h3>
        <div className={styles.sampleText}>
          Our analysis was built on two rich sources of information:
        </div>
        <div className={styles.sampleText}>
          <strong>Home Mortgage Disclosure Act (HMDA) Data:</strong> This
          federally required dataset includes millions of mortgage application
          records. It provides extensive details on applicant demographics, loan
          characteristics, whether loans were approved, and reasons for any
          rejections.
        </div>
        <div className={styles.sampleText}>
          <strong>Survey of Consumer Finances (SCF) Data:</strong> Collected by
          the U.S. Federal Reserve, this dataset offers detailed financial
          information about households, such as income, assets, debts, and
          credit histories. While the HMDA data gives a broad view of mortgage
          application outcomes, the SCF data adds a deeper layer of financial
          details often missing from transaction-based records.
        </div>

        <h3>Data Integration Methodology</h3>
        <div className={styles.sampleText}>
          After preparing both datasets by standardizing their formats and
          addressing any missing information, we developed a custom process to
          match records from each source. This involved using statistical
          techniques to group similar applicants and ensure the data was
          well-prepared for analysis.
        </div>
        <div className={styles.sampleText}>
          We confirmed the quality of this integration by checking for logical
          consistency between the matched records and examining how key pieces
          of information were distributed after combining the datasets. The
          resulting comprehensive dataset merges loan outcomes with detailed
          financial indicators, creating a strong base for both predicting loan
          approvals (a classification task) and estimating loan amounts (a
          regression task).
        </div>

        <h3>Pipeline and Modeling</h3>
        <div className={styles.sampleText}>
          Our system was designed to achieve two main machine learning goals:
          (1) to decide whether a mortgage application should be approved or not
          (a binary classification problem), and (2) to estimate the appropriate
          loan amount if approved (a regression problem). Both parts of the
          system are built in a modular way, with all steps saved and organized
          for easy and reliable use.
        </div>

        <h4>Classification Pipeline (Loan Approval Prediction)</h4>
        <div className={styles.sampleText}>
          Predicting mortgage approval was treated as a yes/no question. After
          testing several standard statistical models, we compared more advanced
          tree-based methods like Random Forest, XGBoost, and Gradient Boosting.
          Instead of just aiming for the highest overall accuracy, we focused on
          achieving a high level of precision (at least 95%), meaning we wanted
          to be very sure that approved loans were indeed good candidates. This
          led us to select a Gradient Boosting Classifier, fine-tuned with a
          specific decision threshold to meet our precision goal.
        </div>
        <div className={styles.sampleText}>
          The loan approval prediction process involves several key steps:
          <ul>
            <li>
              <strong>Feature Engineering:</strong> A custom step to create new,
              informative data points from the existing information, such as
              grouping income levels or combining factors like income and
              marital status, and preparing categorical data for the model.
            </li>
            <li>
              <strong>Data Preprocessing:</strong> A coordinated step to handle
              different types of data, ensuring that categorical information is
              correctly formatted and numerical data is standardized for the
              model.
            </li>
            <li>
              <strong>Feature Selection:</strong> A process to identify and
              isolate the most important predictive factors from the data,
              helping the model focus on what matters most.
            </li>
            <li>
              <strong>Model Persistence:</strong> The final model and all the
              data preparation steps are saved, ensuring that the same logic can
              be consistently applied in the future.
            </li>
          </ul>
        </div>

        <h4>Regression Pipeline (Loan Amount Estimation)</h4>
        <div className={styles.sampleText}>
          Estimating the loan amount was achieved using a technique called
          quantile regression. We trained three separate models to predict
          different points in the possible range of loan amounts: a lower
          estimate (10th percentile), a middle estimate (50th percentile, or
          median), and an upper estimate (90th percentile). This approach
          provides a range for the predicted loan amount, offering a clear
          indication of the model's confidence.
        </div>
        <div className={styles.sampleText}>
          The loan amount estimation process includes:
          <ul>
            <li>
              <strong>Financial Feature Engineering:</strong> A custom step to
              transform financial data and create new relevant indicators, such
              as applying adjustments to account for skewed distributions,
              creating credit score representations, calculating debt ratios,
              factoring in asset values, and developing indicators for financial
              stress.
            </li>
            <li>
              <strong>Quantile Models:</strong> Separate models are trained for
              each quantile (lower, middle, and upper estimates) to provide a
              comprehensive prediction range.
            </li>
            <li>
              <strong>Model Persistence:</strong> The trained models and the
              data preparation logic are saved to ensure consistent application
              for future predictions.
            </li>
          </ul>
        </div>

        <h4>Modular Architecture</h4>
        <div className={styles.sampleText}>
          All components of the system are organized in a clear, structured
          manner. The overall workflow is managed by automated scripts that
          ensure evaluations are reproducible using the saved model components.
          This design ensures consistency in how data is handled between model
          training and when making new predictions, although there are some
          limitations to the flexibility of the current pipeline (discussed in
          the reflections).
        </div>

        <h3>Key Results, Model Comparison, and Metric Interpretation</h3>
        <h4>Classification Results</h4>
        <ul>
          <li>
            <strong>Logistic Regression (L1):</strong> accuracy 0.81, precision
            0.93, recall 0.77, F1 0.84, ROC AUC 0.86
          </li>
          <li>
            <strong>Random Forest (tuned):</strong> accuracy 0.83, precision
            0.94, recall 0.79, F1 0.86, ROC AUC 0.88
          </li>
          <li>
            <strong>XGBoost:</strong> accuracy 0.84, precision 0.95, recall
            0.78, F1 0.86, ROC AUC 0.89
          </li>
          <li>
            <strong>Gradient Boosting (selected):</strong> accuracy 0.85,
            precision 0.95, recall 0.77, F1 0.85, ROC AUC 0.90
          </li>
        </ul>
        <div className={styles.sampleText}>
          The Gradient Boosting Classifier, with its decision point adjusted,
          was chosen to ensure a precision of at least 95%. This means it is
          highly reliable in its approval decisions, minimizing the chances of
          incorrectly approving a risky loan.
        </div>

        <h4>Regression Results</h4>
        <div className={styles.sampleText}>
          For the median (middle) loan amount prediction model, the average
          error was around $2,950. This model explains a good portion of the
          variation in loan amounts (R² of 0.72). The lower and upper estimate
          models provide a confidence range around this prediction, helping
          users understand the potential variability in the estimated loan
          amount.
        </div>

        <h4>Insights</h4>
        <ul>
          <li>
            Key factors influencing loan decisions included income, marital
            status, the purpose of the loan, debt-to-income ratio, and overall
            asset levels.
          </li>
          <li>
            Our approach prioritized minimizing risk by ensuring high precision
            in approvals, even if it meant occasionally missing some good
            applicants (lower recall). This aligns with typical banking
            risk-management strategies.
          </li>
          <li>
            Using quantile regression provided transparent estimates of
            uncertainty, making the loan amount predictions more understandable
            and adaptable to different borrower profiles.
          </li>
        </ul>

        <h3>Failures and Limitations</h3>
        <ol>
          <li>
            <strong>Sensitivity in Data Preparation:</strong>
            <br />
            Some custom-created data features rely on very specific categories
            being present in the input data. If these categories are missing, it
            can cause issues unless the data is carefully selected.
          </li>
          <li>
            <strong>Pipeline Rigidity:</strong>
            <br />
            The data preparation steps are not fully bundled into a single,
            self-contained unit. This means changes or updates might require
            re-running parts of the process to ensure consistency, which is not
            ideal for a production-ready system.
          </li>
          <li>
            <strong>Lack of Automated Data Checks:</strong>
            <br />
            The system doesn't automatically validate incoming data for correct
            types, value ranges, or required fields. This makes it more
            vulnerable to errors if data sources change.
          </li>
          <li>
            <strong>Incomplete Validation of Matching Methods:</strong>
            <br />
            Due to time and resource constraints, we couldn't fully explore all
            advanced methods for matching data from different sources. We relied
            on well-established but potentially less optimal techniques.
          </li>
          <li>
            <strong>Limited Generalizability of Custom Logic:</strong>
            <br />
            Some of the rules created for generating new data features are tied
            to specific combinations of data. These rules might not work well
            for unusual cases or for borrower groups not well-represented in the
            original data, without retraining the model.
          </li>
        </ol>
      </motion.div>
    </div>
  );
};

export default ScrollableContent;
