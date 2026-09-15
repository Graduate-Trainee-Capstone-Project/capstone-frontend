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

export type ApplicationStatus = "ACTIVE" | "PENDING";

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
  /** Drives "coming soon" styling on the product grid — never branch on productCode instead. */
  isActive: boolean;
}

export interface ProductsResponse {
  products: Product[];
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
  formData: Record<string, unknown>;
}

// ─── GET /applications/{draftId} ───

export interface ApplicationDraftResponse {
  draftId: string;
  productCode: ProductCode;
  currentStep: DraftStep;
  formData: Record<string, unknown>;
  isExistingCustomer: boolean;
  status: DraftStatus;
  lastUpdatedAt: string;
}

// ─── PUT /applications/{draftId}/save ───

export interface SaveDraftRequest {
  currentStep: DraftStep;
  formData: Record<string, unknown>;
  channel: Channel;
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
  status: ApplicationStatus;
}

// ─── Cross-subsidiary "already a customer?" BVN lookup (product-agnostic) ───
// Lets any product's identifier-capture screen offer an "ease onboarding"
// shortcut: verify a BVN via OTP, then prefill formData from whatever
// subsidiary the customer already has a profile with — independent of the
// current product's own requiredIdentifiers.

export interface RequestBvnOtpRequest {
  bvn: string;
}

export interface RequestBvnOtpResponse {
  otpToken: string;
  maskedPhone: string;
}

export interface VerifyBvnOtpRequest {
  otpToken: string;
  otp: string;
  bvn: string;
}

export interface VerifyBvnOtpResponse {
  matched: boolean;
  formData?: Record<string, unknown>;
}
