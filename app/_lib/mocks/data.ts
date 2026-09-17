import "server-only";
import type {
  AddressInfo,
  ApplicationDraftResponse,
  Channel,
  DraftFormData,
  DraftStatus,
  DraftStep,
  ExistingCustomerData,
  IdentifierType,
  Product,
  SecurityCheckType,
} from "@/app/_types";

/**
 * In-memory fake DB standing in for the .NET API + its Postgres/SQL tables
 * while the real backend isn't reachable. Everything here mirrors the shape
 * described in docs/schema-document-v2.md closely enough to demo the actual
 * thesis (resume, existing-customer detection, dedup) without a live server.
 *
 * IMPORTANT: this only survives for the lifetime of the Next dev server
 * process (module-level state). That's fine for a local demo; it is NOT a
 * substitute for the real backend and must never ship to production.
 */

export interface DraftRecord {
  draftId: string;
  productCode: string;
  productId: string;
  customerId: string | null;
  primaryIdentifierType: IdentifierType;
  primaryIdentifierValue: string;
  secondaryIdentifierType?: IdentifierType;
  secondaryIdentifierValue?: string;
  currentStep: DraftStep;
  formData: DraftFormData;
  channel: Channel;
  status: DraftStatus;
  isExistingCustomer: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  expiresAt: string;
}

export interface MockCustomerRecord {
  customerId: string;
  formData: DraftFormData;
}

// ─── Products catalog ───

export const mockProducts: Product[] = [
  {
    productId: "prod-savings",
    productCode: "SAVINGS",
    productName: "Savings account",
    requiredIdentifiers: ["BVN"],
    additionalFieldsSchema: [
      {field: "branchPreference", label: "Preferred branch", type: "text", required: false},
    ],
  },
  {
    productId: "prod-current",
    productCode: "CURRENT",
    productName: "Current account",
    requiredIdentifiers: ["BVN"],
    additionalFieldsSchema: [
      {field: "chequeBookRequested", label: "Request a cheque book", type: "checkbox", required: false},
    ],
  },
  {
    productId: "prod-pension",
    productCode: "PENSION_RSA",
    productName: "Pension (RSA)",
    requiredIdentifiers: ["NIN", "PHONE"],
    additionalFieldsSchema: [
      {
        field: "title",
        label: "Title",
        type: "select",
        options: ["Mr", "Mrs", "Miss", "Dr", "Chief", "Engr"],
        required: true,
      },
      {field: "otherName", label: "Other name", type: "text", required: false},
      {
        field: "maritalStatus",
        label: "Marital status",
        type: "select",
        options: ["Single", "Married", "Divorced", "Widowed"],
        required: true,
      },
      {field: "maidenOrFormerName", label: "Maiden or former name", type: "text", required: false},
      {
        field: "religion",
        label: "Religion",
        type: "select",
        options: ["Christianity", "Islam", "Traditional", "Other"],
        required: false,
      },
      {field: "placeOfBirth", label: "Place of birth", type: "text", required: true},
      {field: "lgaOfResidence", label: "LGA of residence", type: "text", required: false},
      {field: "employerName", label: "Employer name", type: "text", required: false},
      {
        field: "contributionScheme",
        label: "Contribution scheme",
        type: "select",
        options: ["MandatoryCPS", "Voluntary", "MicroPensionPlan"],
        required: true,
      },
    ],
  },
  {
    productId: "prod-stockbroking",
    productCode: "STOCKBROKING",
    productName: "Stockbroking",
    requiredIdentifiers: ["BVN"],
    additionalFieldsSchema: [
      {
        field: "bankAccountOption",
        label: "Settlement bank account",
        type: "select",
        options: [
          "Use my Stanbic IBTC account",
          "I'll create a Stanbic IBTC account",
          "Use another bank",
        ],
        required: true,
      },
      {field: "bankName", label: "Bank name", type: "text", required: false},
      {field: "existingBankAccountNumber", label: "Account number", type: "text", required: false},
      {field: "riskProfile", label: "Risk profile", type: "text", required: false},
    ],
  },
  {
    productId: "prod-insurance",
    productCode: "INSURANCE",
    productName: "Insurance",
    requiredIdentifiers: ["EMAIL", "PHONE"],
    additionalFieldsSchema: [{field: "policyType", label: "Policy type", type: "text", required: false}],
  },
];

// ─── Drafts, keyed by draftId ───

export const mockDrafts = new Map<string, DraftRecord>();

// Resume lookup: "productCode:primaryIdentifierValue" -> draftId, maintained
// only while the draft is IN_PROGRESS — mirrors the real unique constraint
// on (ProductId, PrimaryIdentifierValueHash) WHERE Status = 'IN_PROGRESS'.
export const mockResumeIndex = new Map<string, string>();

// ─── Identifier index: "TYPE:value" -> existing customer, seeded so the
// existing-customer + cross-product-reuse demo path is reachable deterministically ───

export const mockIdentifierIndex = new Map<string, MockCustomerRecord>();

const SEED_CUSTOMER_ID = "cust-seed-adaeze";

mockIdentifierIndex.set("BVN:12345678901", {
  customerId: SEED_CUSTOMER_ID,
  formData: {
    firstName: "Adaeze",
    lastName: "Okonkwo",
    dateOfBirth: "1995-04-12",
    gender: "FEMALE",
    nationality: "Nigerian",
    address: [{street: "12 Marina Rd", city: "Lagos", state: "Lagos"}],
    nextOfKin: {fullName: "Chidi Okonkwo", relationship: "Sibling", phone: "+2348012345678"},
  },
});
mockIdentifierIndex.set("NIN:98765432109", {
  customerId: SEED_CUSTOMER_ID,
  formData: {
    firstName: "Adaeze",
    lastName: "Okonkwo",
    dateOfBirth: "1995-04-12",
    gender: "FEMALE",
    nationality: "Nigerian",
  },
});

export function identifierKey(type: IdentifierType, value: string): string {
  return `${type}:${value}`;
}

export function draftKey(productCode: string, primaryIdentifierValue: string): string {
  return `${productCode}:${primaryIdentifierValue}`;
}

export function toApplicationDraftResponse(draft: DraftRecord): ApplicationDraftResponse {
  return {
    draftId: draft.draftId,
    productId: draft.productId,
    primaryIdentifierType: draft.primaryIdentifierType,
    secondaryIdentifierType: draft.secondaryIdentifierType ?? null,
    currentStep: draft.currentStep,
    formData: draft.formData,
    channel: draft.channel,
    status: draft.status,
    createdAt: draft.createdAt,
    lastUpdatedAt: draft.lastUpdatedAt,
    expiresAt: draft.expiresAt,
  };
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

// ─── Security-check attempt counters, keyed by draftId only — deliberately
// NOT part of DraftRecord/mockDrafts. Security checks are always mocked
// (see actions/index.ts), even when the rest of the app is pointed at the
// live API, so draftId is frequently a real BE-issued Guid that mockDrafts
// has never heard of. Tracking attempts here instead of on draft.* keeps
// the fail-once-then-pass / lockout demo behavior working regardless of
// whether the draft itself is a mock or a live one. ───

const mockSecurityCheckAttempts = new Map<string, Record<SecurityCheckType, number>>();

export function getSecurityCheckAttempts(draftId: string): Record<SecurityCheckType, number> {
  let attempts = mockSecurityCheckAttempts.get(draftId);
  if (!attempts) {
    attempts = {SECURITY_QUESTION: 0, FACIAL_RECOGNITION: 0, OTP: 0};
    mockSecurityCheckAttempts.set(draftId, attempts);
  }
  return attempts;
}

function toSingleAddressString(address?: AddressInfo[] | null): string | null {
  const first = address?.[0];
  if (!first) return null;
  const parts = [first.houseNumber, first.street, first.city, first.state, first.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * BE's "new existing-customer start" returns an empty formData and puts the
 * matched profile on existingCustomer instead (a flattened, single-address
 * shape) — see docs/justin-backend-alignment-briefing.md B2.
 */
export function toExistingCustomerData(formData: DraftFormData): ExistingCustomerData {
  return {
    firstName: formData.firstName ?? "",
    middleName: formData.middleName ?? null,
    lastName: formData.lastName ?? "",
    dateOfBirth: formData.dateOfBirth ?? null,
    gender: formData.gender ?? null,
    phoneNumber: formData.phoneNumber ?? null,
    email: formData.email ?? null,
    address: toSingleAddressString(formData.address),
  };
}
