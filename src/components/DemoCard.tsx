import React, { useState } from "react";
import styles from "./DemoCard.module.css";
import Button from "../ui/Button";
import DragDropUpload from "../ui/DragDropUpload";
import BackButton from "../ui/BackButton";
import { NumericInput, DropdownSelect, Checkbox } from "../ui/inputs";
import {
  parseExcelDocument,
  loadSampleDocument,
  downloadSampleDocument,
} from "../utils/DocumentParser";

// API Response interface
interface ApiResponse {
  prediction: number;
  range_low: number;
  range_high: number;
  approved: boolean;
  approval_probability: number;
  explanation?: Array<{
    feature: string;
    shap_value: number;
  }>;
}

// Form state interface
export interface FormData {
  // Income Components
  scf_applicant_income_dollars: number | "";
  scf_WAGEINC: number | "";
  scf_BUSSEFARMINC: number | "";
  scf_KGINC: number | "";
  scf_SSRETINC: number | "";
  // Asset Holdings
  scf_STOCKS: number | "";
  scf_BOND: number | "";
  scf_FIN: number | "";
  scf_ASSET: number | "";
  // Debt & Payment Obligations
  scf_DEBT: number | "";
  scf_PAYVEH_total: number | "";
  scf_PAYEDU_total: number | "";
  scf_LATE: boolean;
  // Liquid Asset Balances
  scf_CHECKING: number | "";
  scf_SAVING: number | "";
  scf_MMA: number | "";
  scf_CALL: number | "";
  scf_HLIQ: boolean;
  // Demographics & Risk Indicators
  scf_KIDS: number | "";
  scf_MARRIED: boolean;
  scf_LF: boolean;
  scf_BNKRUPLAST5: boolean;
  scf_FORECLLAST5: boolean;
  // HMDA Application Details
  hmda_loan_purpose: string;
  hmda_lien_status: string;
  hmda_property_type: string;
  hmda_preapproval: string;
}

// Initial form data
const initialFormData: FormData = {
  // Income Components
  scf_applicant_income_dollars: "",
  scf_WAGEINC: "",
  scf_BUSSEFARMINC: "",
  scf_KGINC: "",
  scf_SSRETINC: "",
  // Asset Holdings
  scf_STOCKS: "",
  scf_BOND: "",
  scf_FIN: "",
  scf_ASSET: "",
  // Debt & Payment Obligations
  scf_DEBT: "",
  scf_PAYVEH_total: "",
  scf_PAYEDU_total: "",
  scf_LATE: false,
  // Liquid Asset Balances
  scf_CHECKING: "",
  scf_SAVING: "",
  scf_MMA: "",
  scf_CALL: "",
  scf_HLIQ: false,
  // Demographics & Risk Indicators
  scf_KIDS: "",
  scf_MARRIED: false,
  scf_LF: false,
  scf_BNKRUPLAST5: false,
  scf_FORECLLAST5: false,
  // HMDA Application Details
  hmda_loan_purpose: "",
  hmda_lien_status: "",
  hmda_property_type: "",
  hmda_preapproval: "",
};

// Screen components
const ButtonScreen: React.FC<{
  onUploadClick: () => void;
  onManualClick: () => void;
}> = ({ onUploadClick, onManualClick }) => (
  <div className={styles.optionsContainer}>
    <div className={styles.optionItem}>
      <Button variant="primary" fullWidth size="large" onClick={onUploadClick}>
        Upload Document
      </Button>
    </div>
    <div className={styles.optionOr}>or</div>
    <div className={styles.optionItem}>
      <Button
        variant="secondary"
        fullWidth
        size="large"
        onClick={onManualClick}
      >
        Complete Manually
      </Button>
    </div>
  </div>
);

const UploadScreen: React.FC<{
  onBack: () => void;
  onDataLoaded: (data: Partial<FormData>) => void;
}> = ({ onBack, onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("File selected:", file.name);

      const formData = await parseExcelDocument(file);
      console.log("Parsed form data:", formData);

      onDataLoaded(formData);
    } catch (err) {
      console.error("Error processing file:", err);
      setError(
        "Failed to process the file. Please make sure it's in the correct format."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = await loadSampleDocument();
      console.log("Loaded sample document:", formData);

      onDataLoaded(formData);
    } catch (err) {
      console.error("Error loading sample document:", err);
      setError("Failed to load the sample document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadContentWrapper}>
        <DragDropUpload
          onFileSelected={handleFileSelected}
          acceptedFileTypes=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          maxFileSize={5242880} // 5MB
          primaryText="Select File to Upload"
          secondaryText="Drag and drop or click to select an Excel file"
          isLoading={false}
        />

        {isLoading && (
          <div className={styles.minimalLoading}>
            <div className={styles.minimalSpinner}></div>
            <span>Processing your document...</span>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <div className={styles.sampleDocContainer}>
        <p>Don't have a document? Use our sample:</p>
        <Button
          variant="secondary"
          onClick={handleLoadSample}
          disabled={isLoading}
        >
          Load Sample Document
        </Button>
      </div>
    </div>
  );
};

// Form page types
type FormPage =
  | "income"
  | "assets"
  | "debt"
  | "liquid"
  | "demographics"
  | "hmda"
  | "summary";

// Form page components
const IncomeForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Primary Income</h3>
    <NumericInput
      label="Total pre-tax household income"
      value={formData.scf_applicant_income_dollars}
      onChange={(value) => onChange("scf_applicant_income_dollars", value)}
      placeholder="e.g. 90000"
    />
    <NumericInput
      label="Portion of income from wages and salaries"
      value={formData.scf_WAGEINC}
      onChange={(value) => onChange("scf_WAGEINC", value)}
      placeholder="e.g. 75000"
    />

    <h3 className={styles.sectionTitle}>Additional Income Sources</h3>
    <NumericInput
      label="Income from business, sole proprietorships, or farming"
      value={formData.scf_BUSSEFARMINC}
      onChange={(value) => onChange("scf_BUSSEFARMINC", value)}
      placeholder="e.g. 5000"
    />
    <NumericInput
      label="Net capital gains (or losses)"
      value={formData.scf_KGINC}
      onChange={(value) => onChange("scf_KGINC", value)}
      placeholder="e.g. 2000"
    />
    <NumericInput
      label="Social Security & retirement income"
      value={formData.scf_SSRETINC}
      onChange={(value) => onChange("scf_SSRETINC", value)}
      placeholder="e.g. 0"
    />
  </div>
);

const AssetsForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Investment Assets</h3>
    <NumericInput
      label="Market value of directly held stocks"
      value={formData.scf_STOCKS}
      onChange={(value) => onChange("scf_STOCKS", value)}
      placeholder="e.g. 15000"
    />
    <NumericInput
      label="Market value of directly held bonds"
      value={formData.scf_BOND}
      onChange={(value) => onChange("scf_BOND", value)}
      placeholder="e.g. 1000"
    />

    <h3 className={styles.sectionTitle}>Total Asset Holdings</h3>
    <NumericInput
      label="Total financial assets (cash, deposits, funds, etc.)"
      value={formData.scf_FIN}
      onChange={(value) => onChange("scf_FIN", value)}
      placeholder="e.g. 20000"
    />
    <NumericInput
      label="Total value of all assets (incl. real estate & equity)"
      value={formData.scf_ASSET}
      onChange={(value) => onChange("scf_ASSET", value)}
      placeholder="e.g. 350000"
    />
  </div>
);

const DebtForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Total Debt</h3>
    <NumericInput
      label="Sum of all outstanding debt"
      value={formData.scf_DEBT}
      onChange={(value) => onChange("scf_DEBT", value)}
      placeholder="e.g. 25000"
    />

    <h3 className={styles.sectionTitle}>Monthly Payments</h3>
    <NumericInput
      label="Total monthly vehicle‐loan payments"
      value={formData.scf_PAYVEH_total}
      onChange={(value) => onChange("scf_PAYVEH_total", value)}
      placeholder="e.g. 10000"
    />
    <NumericInput
      label="Total monthly education‐loan payments"
      value={formData.scf_PAYEDU_total}
      onChange={(value) => onChange("scf_PAYEDU_total", value)}
      placeholder="e.g. 3000"
    />
    <Checkbox
      label="Any late debt payments within past year?"
      checked={formData.scf_LATE}
      onChange={(checked) => onChange("scf_LATE", checked)}
    />
  </div>
);

const LiquidAssetsForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Cash Accounts</h3>
    <NumericInput
      label="Balance in checking accounts"
      value={formData.scf_CHECKING}
      onChange={(value) => onChange("scf_CHECKING", value)}
      placeholder="e.g. 5000"
    />
    <NumericInput
      label="Balance in savings accounts"
      value={formData.scf_SAVING}
      onChange={(value) => onChange("scf_SAVING", value)}
      placeholder="e.g. 8000"
    />

    <h3 className={styles.sectionTitle}>Market Accounts</h3>
    <NumericInput
      label="Balance in money-market accounts"
      value={formData.scf_MMA}
      onChange={(value) => onChange("scf_MMA", value)}
      placeholder="e.g. 12000"
    />
    <NumericInput
      label="Balance in call (interest-bearing) accounts"
      value={formData.scf_CALL}
      onChange={(value) => onChange("scf_CALL", value)}
      placeholder="e.g. 3000"
    />
    <Checkbox
      label="Holds any liquid assets?"
      checked={formData.scf_HLIQ}
      onChange={(checked) => onChange("scf_HLIQ", checked)}
    />
  </div>
);

const DemographicsForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>Demographics & Risk Indicators</h3>
    <NumericInput
      label="Number of dependent children"
      value={formData.scf_KIDS}
      onChange={(value) => onChange("scf_KIDS", value)}
      placeholder="e.g. 1"
    />
    <Checkbox
      label="Are you married?"
      checked={formData.scf_MARRIED}
      onChange={(checked) => onChange("scf_MARRIED", checked)}
      variant="toggle"
    />
    <Checkbox
      label="Currently in the labor force?"
      checked={formData.scf_LF}
      onChange={(checked) => onChange("scf_LF", checked)}
      variant="toggle"
    />
    <Checkbox
      label="Bankruptcy filing in past 5 years?"
      checked={formData.scf_BNKRUPLAST5}
      onChange={(checked) => onChange("scf_BNKRUPLAST5", checked)}
      variant="toggle"
    />
    <Checkbox
      label="Foreclosure in past 5 years?"
      checked={formData.scf_FORECLLAST5}
      onChange={(checked) => onChange("scf_FORECLLAST5", checked)}
      variant="toggle"
    />
  </div>
);

const HmdaForm: React.FC<{
  formData: FormData;
  onChange: (fieldName: keyof FormData, value: any) => void;
}> = ({ formData, onChange }) => (
  <div className={styles.formSection}>
    <h3 className={styles.sectionTitle}>HMDA Application Details</h3>
    <DropdownSelect
      label="Purpose of loan or application"
      value={formData.hmda_loan_purpose}
      onChange={(value) => onChange("hmda_loan_purpose", value)}
      options={[
        { value: "1", label: "Purchase" },
        { value: "2", label: "Improvement" },
        { value: "31", label: "Refinance" },
        { value: "32", label: "Cash-out" },
        { value: "4", label: "Other" },
        { value: "5", label: "N/A" },
      ]}
    />
    <DropdownSelect
      label="Lien status on the property"
      value={formData.hmda_lien_status}
      onChange={(value) => onChange("hmda_lien_status", value)}
      options={[
        { value: "1", label: "First lien" },
        { value: "2", label: "Subordinate lien" },
        { value: "3", label: "No lien" },
        { value: "4", label: "Other" },
      ]}
    />
    <DropdownSelect
      label="Type of property"
      value={formData.hmda_property_type}
      onChange={(value) => onChange("hmda_property_type", value)}
      options={[
        { value: "1", label: "Principal residence" },
        { value: "2", label: "Second home" },
        { value: "3", label: "Investment property" },
      ]}
    />
    <DropdownSelect
      label="Did you request a preapproval?"
      value={formData.hmda_preapproval}
      onChange={(value) => onChange("hmda_preapproval", value)}
      options={[
        { value: "1", label: "Preapproval requested" },
        { value: "2", label: "Not requested" },
        { value: "3", label: "Not applicable" },
      ]}
    />
  </div>
);

// Result display component
const ResultDisplay: React.FC<{ result: ApiResponse }> = ({ result }) => {
  const formatCurrency = (amount: number | null | undefined) => {
    // Handle undefined, null, NaN or invalid values
    if (
      amount === undefined ||
      amount === null ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return "Not Available";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const approvalPercentage = Math.round(
    (result.approval_probability || 0) * 100
  );

  return (
    <div className={styles.resultContainer}>
      <div style={{ height: "15px" }}></div>
      <div className={styles.resultHeader}>
        <h3 className={styles.resultTitle}>
          Mortgage Assessment {result.approved ? "Approved" : "Declined"}
        </h3>
        <div
          className={`${styles.approvalBadge} ${
            result.approved ? styles.approved : styles.declined
          }`}
        >
          {result.approved ? "Approved" : "Declined"}
        </div>
      </div>

      <div className={styles.resultItem}>
        <span className={styles.resultLabel}>Recommended Loan Amount:</span>
        <span className={styles.resultValue}>
          {formatCurrency(result.prediction)}
        </span>
      </div>

      <div className={styles.resultItem}>
        <span className={styles.resultLabel}>Loan Range:</span>
        <span className={styles.resultValue}>
          {result.approved
            ? `${formatCurrency(result.range_low)} to ${formatCurrency(
                result.range_high
              )}`
            : "Not Available"}
        </span>
      </div>

      <div className={styles.resultItemLarge}>
        <span className={styles.resultLabel}>Approval Probability:</span>
        <div className={styles.probabilityContainer}>
          <div className={styles.probabilityBar}>
            <div
              className={styles.probabilityFill}
              style={{ width: `${approvalPercentage}%` }}
            ></div>
          </div>
          <span className={styles.probabilityValue}>{approvalPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

const SummaryForm: React.FC<{
  formData: FormData;
  onResult?: (result: ApiResponse) => void;
}> = ({ formData, onResult }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Convert formData to numeric values for API
  const prepareFormDataForAPI = () => {
    const apiData: Record<string, number | string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      // Convert empty strings to 0
      if (value === "") {
        apiData[key] = 0;
      }
      // Convert booleans to 0/1
      else if (typeof value === "boolean") {
        apiData[key] = value ? 1 : 0;
      }
      // Keep other values as is
      else {
        apiData[key] = value;
      }
    });

    return apiData;
  };
  console.log("Form data:", formData);
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const apiData = prepareFormDataForAPI();
      const response = await fetch(
        "https://mortgagesfinal.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (onResult) {
        onResult(result);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        `Error submitting form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format the form data for display
  const formatFormData = () => {
    interface FormField {
      key: string;
      label: string;
      boolean?: boolean;
      select?: Record<string, string>;
    }

    const sections: Record<string, FormField[]> = {
      Income: [
        { key: "scf_applicant_income_dollars", label: "Household Income" },
        { key: "scf_WAGEINC", label: "Wages & Salary" },
        { key: "scf_BUSSEFARMINC", label: "Business & Farming" },
        { key: "scf_KGINC", label: "Capital Gains" },
        { key: "scf_SSRETINC", label: "Social Security & Retirement" },
      ],
      Assets: [
        { key: "scf_STOCKS", label: "Stocks" },
        { key: "scf_BOND", label: "Bonds" },
        { key: "scf_FIN", label: "Financial Assets" },
        { key: "scf_ASSET", label: "Total Assets" },
      ],
      Debt: [
        { key: "scf_DEBT", label: "Total Debt" },
        { key: "scf_PAYVEH_total", label: "Vehicle Payments" },
        { key: "scf_PAYEDU_total", label: "Education Payments" },
        { key: "scf_LATE", label: "Late Payments", boolean: true },
      ],
      Liquid: [
        { key: "scf_CHECKING", label: "Checking Balance" },
        { key: "scf_SAVING", label: "Savings Balance" },
        { key: "scf_MMA", label: "Money Market" },
        { key: "scf_CALL", label: "Call Accounts" },
        { key: "scf_HLIQ", label: "Has Liquid Assets", boolean: true },
      ],
      Demographics: [
        { key: "scf_KIDS", label: "Dependent Children" },
        { key: "scf_MARRIED", label: "Married", boolean: true },
        { key: "scf_LF", label: "In Labor Force", boolean: true },
        { key: "scf_BNKRUPLAST5", label: "Bankruptcy (5y)", boolean: true },
        { key: "scf_FORECLLAST5", label: "Foreclosure (5y)", boolean: true },
      ],
      "Loan Details": [
        {
          key: "hmda_loan_purpose",
          label: "Loan Purpose",
          select: {
            "1": "Purchase",
            "2": "Improvement",
            "31": "Refinance",
            "32": "Cash-out",
            "4": "Other",
            "5": "N/A",
          },
        },
        {
          key: "hmda_lien_status",
          label: "Lien Status",
          select: {
            "1": "First lien",
            "2": "Subordinate lien",
          },
        },
        {
          key: "hmda_property_type",
          label: "Property Type",
          select: {
            "1": "Principal residence",
            "2": "Second home",
            "3": "Investment property",
          },
        },
        {
          key: "hmda_preapproval",
          label: "Preapproval",
          select: {
            "1": "Requested",
            "2": "Not requested",
            "3": "Not applicable",
          },
        },
      ],
    };

    const formatCurrency = (value: number | string) => {
      if (value === 0 || value === "") return "Not provided";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Number(value));
    };

    return (
      <div className={styles.summaryTextContent}>
        {Object.entries(sections).map(([sectionName, fields]) => (
          <div key={sectionName} className={styles.summarySection}>
            <h4 className={styles.summarySectionTitle}>{sectionName}</h4>
            <div className={styles.summaryItems}>
              {fields.map((field) => {
                let displayValue: string = "Not provided";
                const value = formData[field.key as keyof FormData];

                if (field.boolean && typeof value === "boolean") {
                  displayValue = value ? "Yes" : "No";
                } else if (field.select && typeof value === "string") {
                  displayValue = field.select[value] || "Not selected";
                } else if (value !== "" && value !== 0) {
                  if (
                    typeof value === "number" ||
                    (typeof value === "string" && !isNaN(Number(value)))
                  ) {
                    displayValue = formatCurrency(value);
                  } else {
                    displayValue = String(value);
                  }
                }

                return (
                  <div key={field.key} className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{field.label}:</span>
                    <span className={styles.summaryValue}>{displayValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.summaryCenter}>
        <h3 className={styles.sectionTitle} style={{ alignSelf: "flex-start" }}>
          Application Summary
        </h3>
        {formatFormData()}
      </div>
    </div>
  );
};

const ManualScreen: React.FC<{
  onBack: () => void;
  currentPage: FormPage;
  setCurrentPage: (page: FormPage) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onResult?: (result: ApiResponse) => void;
}> = ({
  onBack,
  currentPage,
  setCurrentPage,
  formData,
  setFormData,
  onResult,
}) => {
  const formScrollRef = React.useRef<HTMLDivElement>(null);
  const manualContentRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (fieldName: keyof FormData, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Scroll to top when page changes
  React.useEffect(() => {
    if (formScrollRef.current) {
      formScrollRef.current.scrollTop = 0;
    }
    if (manualContentRef.current) {
      manualContentRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const navigateToPage = (page: FormPage) => {
    setCurrentPage(page);
  };

  const pageComponents = {
    income: <IncomeForm formData={formData} onChange={handleChange} />,
    assets: <AssetsForm formData={formData} onChange={handleChange} />,
    debt: <DebtForm formData={formData} onChange={handleChange} />,
    liquid: <LiquidAssetsForm formData={formData} onChange={handleChange} />,
    demographics: (
      <DemographicsForm formData={formData} onChange={handleChange} />
    ),
    hmda: <HmdaForm formData={formData} onChange={handleChange} />,
    summary: <SummaryForm formData={formData} onResult={onResult} />,
  };

  const pageOrder: FormPage[] = [
    "income",
    "assets",
    "debt",
    "liquid",
    "demographics",
    "hmda",
    "summary",
  ];
  const currentPageIndex = pageOrder.indexOf(currentPage);
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pageOrder.length - 1;

  const handleNext = () => {
    if (!isLastPage) {
      navigateToPage(pageOrder[currentPageIndex + 1]);

      // Force scroll to top after navigation
      setTimeout(() => {
        // Scroll direct refs first
        if (formScrollRef.current) {
          formScrollRef.current.scrollTop = 0;
        }
        if (manualContentRef.current) {
          manualContentRef.current.scrollTop = 0;
        }

        // Get all scrollable containers and reset them
        const scrollableElements = document.querySelectorAll(
          `.${styles.formSection}, .${styles.formScrollContainer}, .${styles.manualContent}`
        );
        scrollableElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });
      }, 10); // Small timeout to ensure the DOM has updated
    }
  };

  const handleBack = () => {
    if (!isFirstPage) {
      navigateToPage(pageOrder[currentPageIndex - 1]);

      // Force scroll to top after navigation
      setTimeout(() => {
        // Scroll direct refs first
        if (formScrollRef.current) {
          formScrollRef.current.scrollTop = 0;
        }
        if (manualContentRef.current) {
          manualContentRef.current.scrollTop = 0;
        }

        // Get all scrollable containers and reset them
        const scrollableElements = document.querySelectorAll(
          `.${styles.formSection}, .${styles.formScrollContainer}, .${styles.manualContent}`
        );
        scrollableElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });
      }, 10); // Small timeout to ensure the DOM has updated
    }
  };

  const pageTitles = {
    income: "Income Components",
    assets: "Asset Holdings",
    debt: "Debt & Payment Obligations",
    liquid: "Liquid Asset Balances",
    demographics: "Demographics & Risk Indicators",
    hmda: "HMDA Application Details",
    summary: "Summary & Submission",
  };

  const progressPercent = ((currentPageIndex + 1) / pageOrder.length) * 100;

  return (
    <div className={styles.manualContainer}>
      <div className={styles.manualContent} ref={manualContentRef}>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <div className={styles.formScrollContainer} ref={formScrollRef}>
          {pageComponents[currentPage]}
        </div>
      </div>
    </div>
  );
};

interface ScreenContent {
  title: string;
  guideText: string;
}

// Help screen content component
const HelpContent: React.FC = () => {
  return (
    <div className={styles.helpContent}>
      <div className={styles.helpSection}>
        <h4 className={styles.helpSectionTitle}>Option 1: Upload Document</h4>
        <p>
          Use an Excel document with your financial information. The system will
          extract the data to pre-fill your application.
        </p>
      </div>

      <div className={styles.helpSection}>
        <h4 className={styles.helpSectionTitle}>Option 2: Manual Entry</h4>
        <p>
          Enter your income, assets, debt, and other financial details manually
          across each section of the form.
        </p>
      </div>

      <div className={styles.helpSection}>
        <h4 className={styles.helpSectionTitle}>Sample Document</h4>
        <p>Download our template to see the expected format for uploads:</p>
        <Button
          variant="secondary"
          size="medium"
          onClick={downloadSampleDocument}
        >
          Download Sample
        </Button>
      </div>
    </div>
  );
};

const DemoCard: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "buttons" | "upload" | "manual" | "result"
  >("buttons");
  const [currentPage, setCurrentPage] = useState<FormPage>("income");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const mainContentRef = React.useRef<HTMLDivElement>(null);

  const pageOrder: FormPage[] = [
    "income",
    "assets",
    "debt",
    "liquid",
    "demographics",
    "hmda",
    "summary",
  ];

  // Reset scrolling when page changes
  React.useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Reset scrolling when screen changes
  React.useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }

    // Reset scrolling for main content when screen changes to result
    if (currentScreen === "result") {
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [currentScreen]);

  const screenContent: Record<
    "buttons" | "upload" | "manual" | "result",
    ScreenContent
  > = {
    buttons: {
      title: "Begin Your Mortgage Assessment",
      guideText: "Choose how you would like to proceed",
    },
    upload: {
      title: "Upload Your Data",
      guideText: "We'll extract the information automatically",
    },
    manual: {
      title: "Manual Information Entry",
      guideText: "Please fill out the required fields across all sections",
    },
    result: {
      title: "Assessment Results",
      guideText: "Here's what we can offer based on your information",
    },
  };

  const handleTransition = (
    nextScreen: "buttons" | "upload" | "manual" | "result"
  ) => {
    setCurrentScreen(nextScreen);
  };

  const handleApiResult = (result: ApiResponse) => {
    setApiResult(result);
    setCurrentScreen("result");

    // Force scroll to top when transitioning to results screen
    setTimeout(() => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    }, 10);
  };

  const handleUploadedData = (data: Partial<FormData>) => {
    // Merge the uploaded data with the current form data
    const mergedData = { ...initialFormData, ...data };
    setFormData(mergedData);

    // Navigate to the summary page
    setCurrentPage("summary");
    setCurrentScreen("manual");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "upload":
        return (
          <UploadScreen
            onBack={() => handleTransition("buttons")}
            onDataLoaded={handleUploadedData}
          />
        );
      case "manual":
        return (
          <ManualScreen
            onBack={() => handleTransition("buttons")}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            formData={formData}
            setFormData={setFormData}
            onResult={handleApiResult}
          />
        );
      case "result":
        return apiResult ? <ResultDisplay result={apiResult} /> : null;
      default:
        return (
          <ButtonScreen
            onUploadClick={() => handleTransition("upload")}
            onManualClick={() => handleTransition("manual")}
          />
        );
    }
  };

  const { title, guideText } = isHelpVisible
    ? {
        title: "Help & Guidance",
        guideText: "Learn how to use this mortgage assessment application",
      }
    : screenContent[currentScreen];

  // Add these handle methods from the ManualScreen component into the parent component
  const isFirstPage = currentPage === pageOrder[0];
  const isLastPage = currentPage === pageOrder[pageOrder.length - 1];

  const handleNext = () => {
    if (!isLastPage) {
      const currentPageIndex = pageOrder.indexOf(currentPage);
      setCurrentPage(pageOrder[currentPageIndex + 1]);

      // Force scroll to top after navigation
      setTimeout(() => {
        // Get all scrollable containers and reset them
        const scrollableElements = document.querySelectorAll(
          `.${styles.formSection}, .${styles.formScrollContainer}, .${styles.manualContent}`
        );
        scrollableElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });
      }, 10); // Small timeout to ensure the DOM has updated
    }
  };

  const handleBack = () => {
    if (!isFirstPage) {
      const currentPageIndex = pageOrder.indexOf(currentPage);
      setCurrentPage(pageOrder[currentPageIndex - 1]);

      // Force scroll to top after navigation
      setTimeout(() => {
        // Get all scrollable containers and reset them
        const scrollableElements = document.querySelectorAll(
          `.${styles.formSection}, .${styles.formScrollContainer}, .${styles.manualContent}`
        );
        scrollableElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.scrollTop = 0;
          }
        });
      }, 10); // Small timeout to ensure the DOM has updated
    }
  };

  const handleSubmit = async () => {
    // Assuming the Summary page is the last page
    if (currentPage === "summary") {
      try {
        setIsSubmitting(true);
        // Create API data format
        const apiData: Record<string, number | string> = {};

        Object.entries(formData).forEach(([key, value]) => {
          // Convert empty strings to 0
          if (value === "") {
            apiData[key] = 0;
          }
          // Convert booleans to 0/1
          else if (typeof value === "boolean") {
            apiData[key] = value ? 1 : 0;
          }
          // Keep other values as is
          else {
            apiData[key] = value;
          }
        });
        const response = await fetch(
          "https://mortgagesfinal.onrender.com/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API response:", result);
        handleApiResult(result);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(
          `Error submitting form: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleHelp = () => {
    setIsHelpVisible(!isHelpVisible);
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoCard}>
        <div className={styles.topContent}>
          <div className={styles.topHeader}>
            {currentScreen !== "buttons" && !isHelpVisible && (
              <BackButton
                onClick={() => handleTransition("buttons")}
                className={styles.topBackButton}
                label=""
              />
            )}
            <h2 className={styles.demoTitle}>{title}</h2>
          </div>
          <p className={styles.guideText}>{guideText}</p>
        </div>
        <div
          className={`${styles.mainContent} ${
            currentScreen === "manual" && !isHelpVisible
              ? styles.mainContentManual
              : ""
          }`}
          ref={mainContentRef}
        >
          <div className={styles.screenContainer}>
            {isHelpVisible ? <HelpContent /> : renderScreen()}
          </div>
        </div>
        <div className={styles.bottomContent}>
          <div
            className={`${styles.helpIcon} ${
              isHelpVisible ? styles.xIcon : ""
            }`}
            onClick={toggleHelp}
          >
            {isHelpVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className={styles.helpCloseIcon}
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            ) : (
              "?"
            )}
          </div>
          {currentScreen === "manual" && !isHelpVisible && (
            <div className={styles.stepIndicator}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.stepDot} ${
                    index === pageOrder.indexOf(currentPage as FormPage)
                      ? styles.activeDot
                      : ""
                  }`}
                />
              ))}

              {/* Add the navigation chevrons next to step indicator */}
              <div className={styles.stepNavigation}>
                <div
                  className={`${styles.navigationChevron} ${
                    isFirstPage ? styles.navigationChevron + "[disabled]" : ""
                  }`}
                  onClick={!isFirstPage ? handleBack : undefined}
                  style={{
                    cursor: isFirstPage ? "not-allowed" : "pointer",
                    transform: "rotate(180deg)",
                  }}
                  aria-disabled={isFirstPage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ display: "block" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </div>
                <div
                  className={`${styles.navigationChevron} ${
                    isLastPage ? styles.submitChevron : ""
                  }`}
                  onClick={
                    isLastPage && !isSubmitting ? handleSubmit : handleNext
                  }
                >
                  {isLastPage ? (
                    isSubmitting ? (
                      <div className={styles.minimalSubmitSpinner}></div>
                    ) : (
                      <svg
                        fill="#000000"
                        width="16"
                        height="16"
                        viewBox="0 0 256.00 256.00"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#000000"
                        strokeWidth="7.68"
                        style={{ display: "block" }}
                      >
                        <g id="SVGRepo_iconCarrier">
                          <path d="M103.99951,188.00012a3.98852,3.98852,0,0,1-2.82812-1.17139l-56-55.9956a3.99992,3.99992,0,0,1,5.65625-5.65723l53.17187,53.16748L213.17139,69.1759a3.99992,3.99992,0,0,1,5.65625,5.65723l-112,111.9956A3.98855,3.98855,0,0,1,103.99951,188.00012Z"></path>
                        </g>
                      </svg>
                    )
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      style={{ display: "block" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoCard;
