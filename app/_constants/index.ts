import type {IdentifierType, ProductCode} from "@/app/_types";
import type {SubsidiarySlug} from "./subsidiaries";

export {NIGERIAN_STATES} from "./nigerian-states";
export {FALLBACK_ADDITIONAL_FIELDS, additionalFieldsFor} from "./product-fields";
export {
  SUBSIDIARIES,
  SUBSIDIARY_BY_SLUG,
  productCodeToSubsidiary,
  isProductCode,
  type Subsidiary,
  type SubsidiarySlug,
} from "./subsidiaries";

/**
 * Presentation-only copy, keyed by productCode. This is explicitly allowed
 * to be a static map per the build plan — it never changes which fields
 * render or which steps run, it's just display text on the product cards.
 */
export const PRODUCT_DISPLAY_COPY: Record<
  ProductCode,
  {name: string; description: string; benefits: string[]; icon: string}
> = {
  SAVINGS: {
    name: "Savings account",
    description: "Open a savings account and start earning interest from day one.",
    benefits: ["Earn interest from day one", "Zero-minimum opening balance", "Instant virtual debit card"],
    icon: "lucide:piggy-bank",
  },
  CURRENT: {
    name: "Current account",
    description: "A current account built for everyday transactions and business.",
    benefits: ["Unlimited everyday transfers", "Optional cheque book", "Built for personal and business use"],
    icon: "lucide:wallet",
  },
  PENSION_RSA: {
    name: "Retirement Savings Account",
    description: "Register a Retirement Savings Account with Stanbic IBTC Pension Managers.",
    benefits: ["Instant RSA PIN generation", "Voluntary contribution tax relief", "Fund I–VI risk structures"],
    icon: "lucide:shield",
  },
  STOCKBROKING: {
    name: "Stockbroking account",
    description: "Trade and invest in the Nigerian stock market.",
    benefits: ["Real-time NGX order matching", "Institutional equity research", "Integrated dividend collection"],
    icon: "lucide:candlestick-chart",
  },
  INSURANCE: {
    name: "Investment account",
    description:
      "Grow your wealth with professionally managed funds from Stanbic IBTC Asset Management.",
    benefits: ["Diversified fund options", "Professional portfolio management", "Flexible contributions"],
    icon: "lucide:trending-up",
  },
};

export function productDisplayName(productCode: ProductCode | null | undefined, fallback?: string): string {
  if (productCode && PRODUCT_DISPLAY_COPY[productCode]) {
    return PRODUCT_DISPLAY_COPY[productCode].name;
  }
  return fallback ?? "this product";
}

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
  /** Holdings landing page — the new app root. */
  holdings: "/",
  bank: "/bank",
  pensions: "/pensions",
  stockbroking: "/stockbroking",
  /** Subsidiary picker — primary "Open an account" entry point. */
  home: "/apply",
  applySubsidiary: (slug: SubsidiarySlug) => `/apply/${slug}`,
  apply: (productCode: string) => `/apply/${productCode}`,
} as const;

/**
 * Per-product document-upload slots. Defaults to the original ID + passport
 * photo pair; products that need more (e.g. Stockbroking's signature) extend
 * it. Keeps DocumentUploadStep fully data-driven — no per-product branches.
 */
export interface DocumentSlotConfig {
  key: string;
  label: string;
  helperText: string;
  accept: string;
}

const DEFAULT_DOCUMENT_SLOTS: DocumentSlotConfig[] = [
  {
    key: "idDocumentName",
    label: "Government-issued ID",
    helperText: "A clear photo or scan of your ID, passport, or driver's licence (max 10 MB).",
    accept: "image/*,.pdf",
  },
  {
    key: "passportPhotoName",
    label: "Passport photograph",
    helperText: "A recent, plain-background passport photo (max 10 MB).",
    accept: "image/*",
  },
];

const SIGNATURE_SLOT: DocumentSlotConfig = {
  key: "signatureName",
  label: "Signature",
  helperText: "A photo or scan of your signature on plain white paper (max 10 MB).",
  accept: "image/*",
};

export const PRODUCT_DOCUMENT_SLOTS: Record<ProductCode, DocumentSlotConfig[]> = {
  SAVINGS: DEFAULT_DOCUMENT_SLOTS,
  CURRENT: DEFAULT_DOCUMENT_SLOTS,
  PENSION_RSA: DEFAULT_DOCUMENT_SLOTS,
  STOCKBROKING: [...DEFAULT_DOCUMENT_SLOTS, SIGNATURE_SLOT],
  INSURANCE: DEFAULT_DOCUMENT_SLOTS,
};
