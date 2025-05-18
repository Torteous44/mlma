import React from "react";
import styles from "./DropdownSelect.module.css";

interface Option {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  error,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${styles.selectContainer} ${className || ""}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={id}
          name={name}
          className={styles.select}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className={styles.selectArrow}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default DropdownSelect;
