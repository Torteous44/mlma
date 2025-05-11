import React, { ButtonHTMLAttributes, useCallback, useRef } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  children,
  type = "button",
  onClick,
  ...props
}) => {
  const isClickedRef = useRef(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isClickedRef.current || !onClick) return;

      isClickedRef.current = true;
      onClick(event);

      // Reset after 500ms to prevent rapid taps
      setTimeout(() => {
        isClickedRef.current = false;
      }, 500);
    },
    [onClick]
  );

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      type={type}
      onClick={handleClick}
      aria-pressed={props["aria-pressed"]}
      {...props}
    >
      <span className={styles.buttonContent}>{children}</span>
    </button>
  );
};

export default Button;
