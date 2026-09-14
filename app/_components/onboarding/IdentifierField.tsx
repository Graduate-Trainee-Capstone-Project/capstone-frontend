"use client";

import {Input} from "@/app/_components/ui/Input";
import {IDENTIFIER_META} from "@/app/_constants";
import type {IdentifierType} from "@/app/_types";

interface IdentifierFieldProps {
  type: IdentifierType;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * One generic field, driven entirely by IDENTIFIER_META[type] — this is what
 * lets Screen 1 render one input for Savings (BVN) and two for Pension
 * (NIN + PHONE) without a single per-identifier-type component.
 */
export function IdentifierField({type, value, onChange, error, disabled}: IdentifierFieldProps) {
  const meta = IDENTIFIER_META[type];

  return (
    <Input
      name={`identifier-${type}`}
      label={meta.label}
      placeholder={meta.placeholder}
      inputMode={meta.inputMode === "email" ? "email" : meta.inputMode === "tel" ? "tel" : meta.inputMode}
      maxLength={meta.maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      error={error}
      disabled={disabled}
      autoComplete="off"
    />
  );
}
