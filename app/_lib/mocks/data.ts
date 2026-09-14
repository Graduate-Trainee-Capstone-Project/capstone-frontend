import "server-only";
import type {
  ApplicationDraftResponse,
  Channel,
  DraftStatus,
  DraftStep,
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
  formData: Record<string, unknown>;
  channel: Channel;
  status: DraftStatus;
  isExistingCustomer: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  securityCheckAttempts: Record<SecurityCheckType, number>;
}

export interface MockCustomerRecord {
  customerId: string;
  formData: Record<string, unknown>;
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
    isActive: true,
  },
  {
    productId: "prod-current",
    productCode: "CURRENT",
    productName: "Current account",
    requiredIdentifiers: ["BVN"],
    additionalFieldsSchema: [
      {field: "chequeBookRequested", label: "Request a cheque book", type: "checkbox", required: false},
    ],
    isActive: true,
  },
  {
    productId: "prod-pension",
    productCode: "PENSION_RSA",
    productName: "Pension (RSA)",
    requiredIdentifiers: ["NIN", "PHONE"],
    additionalFieldsSchema: [
      {field: "employerName", label: "Employer name", type: "text", required: false},
      {
        field: "contributionScheme",
        label: "Contribution scheme",
        type: "select",
        options: ["MandatoryCPS", "Voluntary", "MicroPensionPlan"],
        required: true,
      },
    ],
    isActive: true,
  },
  {
    productId: "prod-stockbroking",
    productCode: "STOCKBROKING",
    productName: "Stockbroking",
    requiredIdentifiers: ["EMAIL"],
    additionalFieldsSchema: [{field: "riskProfile", label: "Risk profile", type: "text", required: false}],
    isActive: false,
  },
  {
    productId: "prod-insurance",
    productCode: "INSURANCE",
    productName: "Insurance",
    requiredIdentifiers: ["EMAIL", "PHONE"],
    additionalFieldsSchema: [{field: "policyType", label: "Policy type", type: "text", required: false}],
    isActive: false,
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
    address: {street: "12 Marina Rd", city: "Lagos", state: "Lagos"},
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
    productCode: draft.productCode as ApplicationDraftResponse["productCode"],
    currentStep: draft.currentStep,
    formData: draft.formData,
    isExistingCustomer: draft.isExistingCustomer,
    status: draft.status,
    lastUpdatedAt: draft.lastUpdatedAt,
  };
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
