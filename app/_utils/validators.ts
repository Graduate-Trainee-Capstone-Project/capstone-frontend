import type {IdentifierType} from "@/app/_types";

export interface FieldValidationResult {
  valid: boolean;
  message?: string;
}

const ELEVEN_DIGITS = /^\d{11}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts 0XXXXXXXXXX (11 digits) or +234XXXXXXXXXX / 234XXXXXXXXXX (13 digits incl. country code)
const NIGERIAN_PHONE_PATTERN = /^(0\d{10}|(\+?234)\d{10})$/;

export function isValidBVN(value: string): FieldValidationResult {
  if (!ELEVEN_DIGITS.test(value.trim())) {
    return {valid: false, message: "BVN must be exactly 11 digits."};
  }
  return {valid: true};
}

export function isValidNIN(value: string): FieldValidationResult {
  if (!ELEVEN_DIGITS.test(value.trim())) {
    return {valid: false, message: "NIN must be exactly 11 digits."};
  }
  return {valid: true};
}

export function isValidEmail(value: string): FieldValidationResult {
  if (!EMAIL_PATTERN.test(value.trim())) {
    return {valid: false, message: "Enter a valid email address."};
  }
  return {valid: true};
}

export function isValidPhone(value: string): FieldValidationResult {
  const trimmed = value.trim().replace(/[\s-]/g, "");
  if (!NIGERIAN_PHONE_PATTERN.test(trimmed)) {
    return {valid: false, message: "Enter a valid Nigerian mobile number."};
  }
  return {valid: true};
}

/** Normalizes 0XXXXXXXXXX / 234XXXXXXXXXX / +234XXXXXXXXXX to +234XXXXXXXXXX before submit. */
export function normalizePhone(value: string): string {
  const trimmed = value.trim().replace(/[\s-]/g, "");
  if (trimmed.startsWith("0") && trimmed.length === 11) {
    return `+234${trimmed.slice(1)}`;
  }
  if (trimmed.startsWith("+234")) {
    return trimmed;
  }
  if (trimmed.startsWith("234")) {
    return `+${trimmed}`;
  }
  return trimmed;
}

const VALIDATORS: Record<IdentifierType, (value: string) => FieldValidationResult> = {
  BVN: isValidBVN,
  NIN: isValidNIN,
  EMAIL: isValidEmail,
  PHONE: isValidPhone,
};

/** Single entry point used by the generic identifier field — never branch on productCode. */
export function validateIdentifier(type: IdentifierType, value: string): FieldValidationResult {
  if (!value.trim()) {
    return {valid: false, message: "This field is required."};
  }
  return VALIDATORS[type](value);
}

export function isRequired(value: string, message = "This field is required."): FieldValidationResult {
  return value.trim() ? {valid: true} : {valid: false, message};
}
