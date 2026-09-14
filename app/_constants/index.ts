import type {IdentifierType, ProductCode} from "@/app/_types";

/**
 * Presentation-only copy, keyed by productCode. This is explicitly allowed
 * to be a static map per the build plan — it never changes which fields
 * render or which steps run, it's just display text on the product cards.
 */
export const PRODUCT_DISPLAY_COPY: Record<ProductCode, {description: string}> = {
  SAVINGS: {description: "Open a savings account and start earning interest from day one."},
  CURRENT: {description: "A current account built for everyday transactions and business."},
  PENSION_RSA: {description: "Register a Retirement Savings Account with Stanbic IBTC Pension Managers."},
  STOCKBROKING: {description: "Trade and invest in the Nigerian stock market."},
  INSURANCE: {description: "Protect what matters with a Stanbic IBTC insurance policy."},
};

/**
 * Drives the generic identifier input on Screen 1 — the field type is
 * decided entirely by `product.requiredIdentifiers`, never by productCode.
 */
export const IDENTIFIER_META: Record<
  IdentifierType,
  {label: string; placeholder: string; inputMode: "numeric" | "email" | "tel" | "text"; maxLength?: number}
> = {
  BVN: {label: "Bank Verification Number (BVN)", placeholder: "e.g. 12345678901", inputMode: "numeric", maxLength: 11},
  NIN: {label: "National Identification Number (NIN)", placeholder: "e.g. 98765432109", inputMode: "numeric", maxLength: 11},
  EMAIL: {label: "Email address", placeholder: "e.g. adaeze@example.com", inputMode: "email"},
  PHONE: {label: "Mobile number", placeholder: "e.g. 08012345678", inputMode: "tel"},
};

export const AUTOSAVE_DEBOUNCE_MS = 800;

/** Mirrors SecurityChecks mock behavior — attempts allowed before lockout. */
export const SECURITY_CHECK_MAX_ATTEMPTS = 3;

export const ROUTES = {
  home: "/apply",
  apply: (productCode: string) => `/apply/${productCode}`,
} as const;
