import React from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  id?: string;
  name?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  variant?: "checkbox" | "toggle";
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  className,
  variant = "checkbox", // Default to checkbox style
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={className}>
      <label className={styles.checkboxContainer}>
        <input
          id={id}
          name={name}
          type="checkbox"
          className={styles.checkboxInput}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
        />
        {variant === "checkbox" ? (
          <span className={styles.checkmark}></span>
        ) : (
          <span className={styles.toggleTrack}>
            <span className={styles.toggleThumb}></span>
          </span>
        )}
        <span className={styles.checkboxLabel}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </span>
      </label>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Checkbox;
