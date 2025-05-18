import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "./NumericInput.module.css";

interface NumericInputProps {
  id?: string;
  name?: string;
  label?: string;
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "Enter a number",
  min,
  max,
  step = 1,
  disabled = false,
  required = false,
  error,
  className,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value === "" ? "" : String(value)
  );

  useEffect(() => {
    setInputValue(value === "" ? "" : String(value));
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "") {
      onChange("");
      return;
    }

    const numValue = parseFloat(newValue);

    if (!isNaN(numValue)) {
      // Check min/max constraints
      if (min !== undefined && numValue < min) return;
      if (max !== undefined && numValue > max) return;

      onChange(numValue);
    }
  };

  return (
    <div className={`${styles.inputContainer} ${className || ""}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type="number"
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default NumericInput;
