"use client";

import {forwardRef, type InputHTMLAttributes} from "react";
import {cn} from "@/app/_utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {label, error, helperText, id, className, ...rest},
  ref,
) {
  const inputId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-grey-800">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-grey-900 placeholder:text-grey-400 transition-colors duration-150 focus:ring-2 focus:ring-offset-0",
          error
            ? "border-error-400 focus:border-error-400 focus:ring-error-100"
            : "border-grey-300 focus:border-primary-400 focus:ring-primary-100",
          rest.disabled && "bg-grey-50 text-grey-500",
          className,
        )}
        {...rest}
      />
      {error ? (
        <span className="text-xs text-error-400">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-grey-500">{helperText}</span>
      ) : null}
    </div>
  );
});
