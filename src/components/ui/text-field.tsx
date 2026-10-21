import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, id, className = "", ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>{label}</label>
      <input
        className={`field__input ${error ? "field__input--error" : ""} ${className}`.trim()}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      />
      {error && <span className="field__error" id={errorId}>{error}</span>}
    </div>
  );
}