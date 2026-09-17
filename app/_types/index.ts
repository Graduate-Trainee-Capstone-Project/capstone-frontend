// ─── Enums (as string unions, matching backend enum values exactly) ───

export type IdentifierType = "BVN" | "NIN" | "EMAIL" | "PHONE";

export type ProductCode = "SAVINGS" | "CURRENT" | "PENSION_RSA" | "STOCKBROKING" | "INSURANCE";

export type DraftStep =
  | "IDENTIFIER_CAPTURE"
  | "IDENTITY_CHECK"
  | "PERSONAL_INFO"
  | "PRODUCT_SPECIFIC_INFO"
  | "SECURITY_VERIFICATION"
  | "DOCUMENT_UPLOAD"
  | "REVIEW"
  | "SUBMITTED";

export type DraftStatus = "IN_PROGRESS" | "SUBMITTED" | "ABANDONED" | "EXPIRED";

export type Channel = "WEB" | "MOBILE" | "USSD" | "BRANCH_ASSISTED";

export type SecurityCheckType = "SECURITY_QUESTION" | "FACIAL_RECOGNITION" | "OTP";

export type SecurityCheckStatus = "PENDING" | "PASSED" | "FAILED";

// ─── Error shape (every error response follows this) ───

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DRAFT_ALREADY_SUBMITTED"
  | "SECURITY_CHECK_FAILED"
  | "PRODUCT_INACTIVE"
  | "INTERNAL_ERROR";

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  field?: string;
}

/** Discriminated result returned by every action in _lib/actions. Never throws. */
export interface ApiResult<T> {
  data?: T;
  error?: string;
  errorCode?: ApiErrorCode;
  errorField?: string;
  status: number;
}

// ─── GET /products, GET /products/{productCode} ───

export interface AdditionalField {
  field: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "checkbox";
  required: boolean;
  options?: string[];
}

export interface Product {
  productId: string;
  productCode: ProductCode;
  productName: string;
  requiredIdentifiers: IdentifierType[];
  additionalFieldsSchema: AdditionalField[];
}

// ─── DraftFormData — BE's persisted shape (SaveDraftRequest.formData /
// StartApplicationResponse.formData / ApplicationDraftResponse.formData).
// Known BE-typed fields only, per DraftFormData DTO. The index signature
// keeps room for product-schema fields (employerName, contributionScheme,
// bankAccountOption, ...) and nextOfKin that FE still collects locally but
// BE does not yet persist — see docs/justin-backend-alignment-briefing.md B4. ───

export interface AddressInfo {
  houseNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface NextOfKinInfo {
  fullName?: string;
  relationship?: string;
  phone?: string;
}

export interface DraftFormData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  address?: AddressInfo[] | null;
  accountType?: string;
  initialDeposit?: number;
  currency?: string;
  preferredBranch?: string;
  checkBookRequested?: boolean;
  documents?: DraftDocument[];
  nationality?: string;
  /** FE-only — BE has no NOK field yet; sent but ignored until BE adds it. */
  nextOfKin?: NextOfKinInfo;
  /** FE-only product-schema extras (title, employerName, ...) — BE ignores unknown keys. */
  [key: string]: unknown;
}

// ─── existingCustomer on POST /applications/start response ───

export interface ExistingCustomerData {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  /** A single street-address string, not our {street, city, state} shape. */
  address?: string | null;
}

// ─── POST /applications/start ───

export interface StartApplicationRequest {
  productCode: ProductCode;
  primaryIdentifierValue: string;
  secondaryIdentifierValue?: string;
  channel: Channel;
}

export interface StartApplicationResponse {
  draftId: string;
  isResumed: boolean;
  isExistingCustomer: boolean;
  requiresSecurityCheck: boolean;
  currentStep: DraftStep;
  formData: DraftFormData;
  /** New existing-customer start: formData is empty and the profile lands here instead. */
  existingCustomer: ExistingCustomerData | null;
}

// ─── GET /applications/{draftId} ───
// No productCode, no isExistingCustomer, no customerId (commented out in the
// BE mapper) on this response — productCode is kept from the URL / Zustand
// store instead. See docs/justin-backend-alignment-briefing.md B3.

export interface ApplicationDraftResponse {
  draftId: string;
  /** Guid — not a ProductCode. Cross-reference against the store's productCode. */
  productId: string;
  primaryIdentifierType: IdentifierType;
  secondaryIdentifierType?: IdentifierType | null;
  currentStep: DraftStep;
  formData: DraftFormData;
  channel: Channel;
  status: DraftStatus;
  createdAt: string;
  lastUpdatedAt: string;
  expiresAt: string;
}

// ─── PUT /applications/{draftId}/save ───
// multipart/form-data, FLAT fields — not JSON, no nested `formData` wrapper.
// BE switched this endpoint from [FromBody] JSON to [Consumes("multipart/
// form-data")] [FromForm] on 2026-09-16 (commit cbd5d75) to support real
// document uploads. Field names match OnboardingPlatform.Core.DTOs.Requests.
// SaveDraftRequest exactly (case-insensitive on the wire, ASP.NET form
// binder default). Each save only carries the fields relevant to the
// current screen — BE null-coalesces per field against the stored record,
// EXCEPT Address and Documents, which it replaces wholesale whenever
// `street`/`documentFile` is present — see B4 in the briefing and
// justin-backend-alignment-briefing.md for the address-array caveat this
// superseded, plus the still-open BE bug where Documents has no append,
// only wholesale replace (one file survives per call).

export interface SaveDraftRequest {
  currentStep: DraftStep;
  channel: Channel;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  accountType?: string;
  initialDeposit?: number;
  currency?: string;
  preferredBranch?: string;
  checkBookRequested?: boolean;
  houseNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  /** BE labels the file by this on save — we use the slot's label, e.g. "Government-issued ID". */
  documentType?: string;
  /** A real binary upload — BE only accepts ONE per save call. */
  documentFile?: File;
  /** BE has no column for this yet — sent as a harmless extra field, same as any other unknown key. */
  [key: string]: unknown;
}

export interface SaveDraftResponse {
  draftId: string;
  currentStep: DraftStep;
  lastUpdatedAt: string;
  status: DraftStatus;
}

// ─── GET /applications/{draftId}/security-check/questions ───

export interface SecurityQuestion {
  questionId: string;
  prompt: string;
}

export interface SecurityCheckQuestionsResponse {
  questions: SecurityQuestion[];
}

// ─── POST /applications/{draftId}/security-check ───

export interface SecurityCheckAnswer {
  questionId: string;
  answer: string;
}

export interface SecurityCheckRequest {
  checkType: SecurityCheckType;
  answers?: SecurityCheckAnswer[];
}

export interface SecurityCheckResponse {
  checkType: SecurityCheckType;
  status: SecurityCheckStatus;
  attemptsRemaining?: number;
}

// ─── POST /applications/{draftId}/finalize ───

export interface FinalizeApplicationResponse {
  customerId: string;
  customerProductId: string;
  productAccountReference: string;
  /** BE sends CustomerProductStatus.ToString() — "ACTIVE", "PENDING", "REJECTED", "CLOSED", ... */
  status: string;
}

// ─── POST /customers/lookup ───
// Product-agnostic "already a customer?" shortcut. OTP is client-side only;
// after any 6-digit code is entered, the frontend calls this live endpoint
// (never mocked). BE team: identifierType is the product's first required
// identifier (often BVN, sometimes EMAIL / NIN / PHONE).

export interface LookupCustomerRequest {
  identifierType: IdentifierType;
  identifierValue: string;
}

export interface LookupCustomerResponse {
  matched: boolean;
  formData?: Record<string, unknown>;
}

export interface DraftDocument {
  type?: string | null;
  url?: string | null;
}
