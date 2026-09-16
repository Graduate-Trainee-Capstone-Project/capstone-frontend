"use client";

import {forwardRef, type InputHTMLAttributes, type ReactNode} from "react";
import {cn} from "@/app/_utils/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {label, error, id, className, ...rest},
  ref,
) {
  const checkboxId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={checkboxId} className="flex cursor-pointer items-start gap-2.5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          className={cn(
            "mt-0.5 size-4 shrink-0 rounded border-grey-300 text-primary-400 focus:ring-2 focus:ring-primary-100",
            className,
          )}
          {...rest}
        />
        <span className="text-sm text-grey-700">{label}</span>
      </label>
      {error && <span className="text-xs text-error-400">{error}</span>}
    </div>
  );
});
