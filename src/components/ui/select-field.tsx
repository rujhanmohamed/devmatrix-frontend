import type { SelectHTMLAttributes } from "react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function SelectField({ label, error, id, className = "", children, ...props }: SelectFieldProps) {
  const selectId = id ?? props.name;
  const errorId = error && selectId ? `${selectId}-error` : undefined;

  return (
    <div className="field">
      <label className="field__label" htmlFor={selectId}>{label}</label>
      <select
        className={`field__input field__select ${error ? "field__input--error" : ""} ${className}`.trim()}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      >
        {children}
      </select>
      {error && <span className="field__error" id={errorId}>{error}</span>}
    </div>
  );
}