"use client";

import {forwardRef, type SelectHTMLAttributes} from "react";
import {cn} from "@/app/_utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {label, error, helperText, options, placeholder, id, className, ...rest},
  ref,
) {
  const selectId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-grey-800">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-grey-900 transition-colors duration-150 focus:ring-2 focus:ring-offset-0",
          error
            ? "border-error-400 focus:border-error-400 focus:ring-error-100"
            : "border-grey-300 focus:border-primary-400 focus:ring-primary-100",
          rest.disabled && "bg-grey-50 text-grey-500",
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs text-error-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-grey-500">{helperText}</span>
      ) : null}
    </div>
  );
});
