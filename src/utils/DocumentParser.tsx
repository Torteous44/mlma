import { FormData } from "../components/DemoCard";
import * as XLSX from "xlsx";

// Map of Excel column names to form field names
const EXCEL_TO_FORM_MAP: Record<string, keyof FormData> = {
  "Household Income (2019 USD)": "scf_applicant_income_dollars",
  "Wages & Salary": "scf_WAGEINC",
  "Business Income": "scf_BUSSEFARMINC",
  "Capital Gains (Net)": "scf_KGINC",
  "Social Security & Retirement Income": "scf_SSRETINC",
  "Market Value of Stocks": "scf_STOCKS",
  "Market Value of Bonds": "scf_BOND",
  "Total Financial Assets": "scf_FIN",
  "Total Asset Value (incl. real estate & equity)": "scf_ASSET",
  "Total Outstanding Debt": "scf_DEBT",
  "Monthly Vehicle Loan Payments": "scf_PAYVEH_total",
  "Monthly Education Loan Payments": "scf_PAYEDU_total",
  "Any Late Debt Payments (Yes=1, No=0)": "scf_LATE",
  "Checking Account Balance": "scf_CHECKING",
  "Savings Account Balance": "scf_SAVING",
  "Money-Market Account Balance": "scf_MMA",
  "Call Account Balance": "scf_CALL",
  "Holds Liquid Assets (Yes=1, No=0)": "scf_HLIQ",
  "Dependent Children": "scf_KIDS",
  "Married (Yes=1, No=0)": "scf_MARRIED",
  "In Labor Force (Yes=1, No=0)": "scf_LF",
  "Bankruptcy Past 5 Years (Yes=1, No=0)": "scf_BNKRUPLAST5",
  "Foreclosure Past 5 Years (Yes=1, No=0)": "scf_FORECLLAST5",
  "HMDA Loan Purpose (1=Purchase,2=Improvement,31=Refinance,32=Cash‑out,4=Other,5=N/A)":
    "hmda_loan_purpose",
  "HMDA Lien Status (1=First lien,2=Subordinate lien)": "hmda_lien_status",
  "HMDA Property Type (1=Principal residence,2=Second home,3=Investment property)":
    "hmda_property_type",
  "HMDA Preapproval (1=Requested,2=Not requested,3=Not applicable)":
    "hmda_preapproval",
};

// Values for boolean fields
const BOOLEAN_VALUES = [
  "Yes",
  "No",
  "yes",
  "no",
  "Y",
  "N",
  "y",
  "n",
  "TRUE",
  "FALSE",
  "true",
  "false",
  1,
  0,
];

export const parseExcelDocument = async (
  file: File
): Promise<Partial<FormData>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume first sheet contains our data
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Parse the data into our form format
        const formData: Partial<FormData> = {};

        if (jsonData.length > 0) {
          const row = jsonData[0] as Record<string, any>;

          // Map each field from Excel to our form
          Object.entries(EXCEL_TO_FORM_MAP).forEach(
            ([excelField, formField]) => {
              if (row[excelField] !== undefined) {
                const value = row[excelField];

                // Handle boolean fields
                if (
                  formField === "scf_LATE" ||
                  formField === "scf_HLIQ" ||
                  formField === "scf_MARRIED" ||
                  formField === "scf_LF" ||
                  formField === "scf_BNKRUPLAST5" ||
                  formField === "scf_FORECLLAST5"
                ) {
                  // Excel file uses 0/1 for boolean values
                  // Convert numeric or string 0/1 to boolean
                  const numericValue = Number(value);
                  formData[formField] = numericValue === 1;
                }
                // Handle string fields
                else if (
                  formField === "hmda_loan_purpose" ||
                  formField === "hmda_lien_status" ||
                  formField === "hmda_property_type" ||
                  formField === "hmda_preapproval"
                ) {
                  // Make sure the value is a string (some may be numbers in the Excel file)
                  formData[formField] = String(value);
                }
                // Handle numeric fields
                else {
                  // Convert to number if it's a number, or keep as empty string if blank
                  formData[formField] = value === "" ? "" : Number(value);
                }
              }
            }
          );
        }

        resolve(formData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

export const loadSampleDocument = async (): Promise<Partial<FormData>> => {
  try {
    const response = await fetch("/docexample.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const workbook = XLSX.read(data, { type: "array" });

    // Assume first sheet contains our data
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Parse the data into our form format
    const formData: Partial<FormData> = {};

    if (jsonData.length > 0) {
      const row = jsonData[0] as Record<string, any>;

      // Map each field from Excel to our form
      Object.entries(EXCEL_TO_FORM_MAP).forEach(([excelField, formField]) => {
        if (row[excelField] !== undefined) {
          const value = row[excelField];

          // Handle boolean fields
          if (
            formField === "scf_LATE" ||
            formField === "scf_HLIQ" ||
            formField === "scf_MARRIED" ||
            formField === "scf_LF" ||
            formField === "scf_BNKRUPLAST5" ||
            formField === "scf_FORECLLAST5"
          ) {
            // Excel file uses 0/1 for boolean values
            // Convert numeric or string 0/1 to boolean
            const numericValue = Number(value);
            formData[formField] = numericValue === 1;
          }
          // Handle string fields
          else if (
            formField === "hmda_loan_purpose" ||
            formField === "hmda_lien_status" ||
            formField === "hmda_property_type" ||
            formField === "hmda_preapproval"
          ) {
            // Make sure the value is a string (some may be numbers in the Excel file)
            formData[formField] = String(value);
          }
          // Handle numeric fields
          else {
            // Convert to number if it's a number, or keep as empty string if blank
            formData[formField] = value === "" ? "" : Number(value);
          }
        }
      });
    }

    return formData;
  } catch (error) {
    console.error("Error loading sample document:", error);
    throw error;
  }
};

export const downloadSampleDocument = async (): Promise<void> => {
  try {
    const response = await fetch("/docexample.xlsx");
    const blob = await response.blob();

    // Create a temporary link element to trigger the download
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = "mortgage_application_sample.xlsx";
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Error downloading sample document:", error);
    alert("Failed to download the sample document. Please try again later.");
  }
};
