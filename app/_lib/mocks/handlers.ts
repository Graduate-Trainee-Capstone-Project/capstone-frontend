import "server-only";
import type {
  ApiResult,
  ApplicationDraftResponse,
  FinalizeApplicationResponse,
  Product,
  ProductsResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  SecurityCheckQuestionsResponse,
  SecurityCheckRequest,
  SecurityCheckResponse,
  SecurityCheckType,
  StartApplicationRequest,
  StartApplicationResponse,
} from "@/app/_types";
import {
  DraftRecord,
  draftKey,
  generateId,
  identifierKey,
  mockDrafts,
  mockIdentifierIndex,
  mockProducts,
  mockResumeIndex,
  toApplicationDraftResponse,
} from "@/app/_lib/mocks/data";
import {SECURITY_CHECK_MAX_ATTEMPTS} from "@/app/_constants";

/** Simulated network latency so loading states are visible during the demo. */
function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CANNED_SECURITY_QUESTIONS: SecurityCheckQuestionsResponse = {
  questions: [
    {questionId: "q1", prompt: "What is your mother's maiden name?"},
    {questionId: "q2", prompt: "What was the name of your first school?"},
  ],
};

// ─── GET /products ───

export async function mockGetProducts(): Promise<ApiResult<ProductsResponse>> {
  await delay();
  return {data: {products: mockProducts}, status: 200};
}

// ─── GET /products/{productCode} ───

export async function mockGetProduct(productCode: string): Promise<ApiResult<Product>> {
  await delay(250);
  const product = mockProducts.find((p) => p.productCode === productCode);
  if (!product) {
    return {error: "Product not found.", errorCode: "NOT_FOUND", status: 404};
  }
  return {data: product, status: 200};
}

// ─── POST /applications/start ───

export async function mockStartApplication(
  input: StartApplicationRequest,
): Promise<ApiResult<StartApplicationResponse>> {
  await delay(600);

  const product = mockProducts.find((p) => p.productCode === input.productCode);
  if (!product) {
    return {error: "Product not found.", errorCode: "NOT_FOUND", status: 404};
  }
  if (!product.isActive) {
    return {
      error: "This product isn't accepting applications yet.",
      errorCode: "PRODUCT_INACTIVE",
      status: 400,
    };
  }

  const needsSecondary = product.requiredIdentifiers.length > 1;
  if (needsSecondary && !input.secondaryIdentifierValue?.trim()) {
    return {
      error: `This product requires ${product.requiredIdentifiers[1]} in addition to ${product.requiredIdentifiers[0]}.`,
      errorCode: "VALIDATION_ERROR",
      errorField: "secondaryIdentifierValue",
      status: 400,
    };
  }

  const primaryType = product.requiredIdentifiers[0];
  const secondaryType = needsSecondary ? product.requiredIdentifiers[1] : undefined;

  // 1. Resume: same product + primary identifier, still IN_PROGRESS.
  const resumeKey = draftKey(input.productCode, input.primaryIdentifierValue);
  const existingDraftId = mockResumeIndex.get(resumeKey);
  if (existingDraftId) {
    const draft = mockDrafts.get(existingDraftId);
    if (draft && draft.status === "IN_PROGRESS") {
      draft.channel = input.channel;
      draft.lastUpdatedAt = new Date().toISOString();
      return {
        data: {
          draftId: draft.draftId,
          isResumed: true,
          isExistingCustomer: draft.isExistingCustomer,
          requiresSecurityCheck: false,
          currentStep: draft.currentStep,
          formData: draft.formData,
        },
        status: 200,
      };
    }
  }

  // 2. Not found — check CustomerIdentifiers for an existing customer.
  const primaryMatch = mockIdentifierIndex.get(identifierKey(primaryType, input.primaryIdentifierValue));
  const secondaryMatch =
    secondaryType && input.secondaryIdentifierValue
      ? mockIdentifierIndex.get(identifierKey(secondaryType, input.secondaryIdentifierValue))
      : undefined;
  const matchedCustomer = primaryMatch ?? secondaryMatch;

  const draftId = generateId("draft");
  const now = new Date().toISOString();

  if (matchedCustomer) {
    const draft: DraftRecord = {
      draftId,
      productCode: input.productCode,
      productId: product.productId,
      customerId: matchedCustomer.customerId,
      primaryIdentifierType: primaryType,
      primaryIdentifierValue: input.primaryIdentifierValue,
      secondaryIdentifierType: secondaryType,
      secondaryIdentifierValue: input.secondaryIdentifierValue,
      currentStep: "SECURITY_VERIFICATION",
      formData: {...matchedCustomer.formData},
      channel: input.channel,
      status: "IN_PROGRESS",
      isExistingCustomer: true,
      createdAt: now,
      lastUpdatedAt: now,
      securityCheckAttempts: {SECURITY_QUESTION: 0, FACIAL_RECOGNITION: 0, OTP: 0},
    };
    mockDrafts.set(draftId, draft);
    mockResumeIndex.set(resumeKey, draftId);

    return {
      data: {
        draftId,
        isResumed: false,
        isExistingCustomer: true,
        requiresSecurityCheck: true,
        currentStep: "SECURITY_VERIFICATION",
        formData: draft.formData,
      },
      status: 200,
    };
  }

  // 3. No match — brand new applicant.
  const draft: DraftRecord = {
    draftId,
    productCode: input.productCode,
    productId: product.productId,
    customerId: null,
    primaryIdentifierType: primaryType,
    primaryIdentifierValue: input.primaryIdentifierValue,
    secondaryIdentifierType: secondaryType,
    secondaryIdentifierValue: input.secondaryIdentifierValue,
    currentStep: "PERSONAL_INFO",
    formData: {},
    channel: input.channel,
    status: "IN_PROGRESS",
    isExistingCustomer: false,
    createdAt: now,
    lastUpdatedAt: now,
    securityCheckAttempts: {SECURITY_QUESTION: 0, FACIAL_RECOGNITION: 0, OTP: 0},
  };
  mockDrafts.set(draftId, draft);
  mockResumeIndex.set(resumeKey, draftId);

  return {
    data: {
      draftId,
      isResumed: false,
      isExistingCustomer: false,
      requiresSecurityCheck: false,
      currentStep: "PERSONAL_INFO",
      formData: {},
    },
    status: 200,
  };
}

// ─── GET /applications/{draftId} ───

export async function mockGetApplication(draftId: string): Promise<ApiResult<ApplicationDraftResponse>> {
  await delay(250);
  const draft = mockDrafts.get(draftId);
  if (!draft) {
    return {error: "Application not found or has expired.", errorCode: "NOT_FOUND", status: 404};
  }
  if (draft.status === "SUBMITTED") {
    return {
      error: "This application has already been submitted.",
      errorCode: "DRAFT_ALREADY_SUBMITTED",
      status: 409,
    };
  }
  return {data: toApplicationDraftResponse(draft), status: 200};
}

// ─── PUT /applications/{draftId}/save ───

export async function mockSaveDraft(
  draftId: string,
  input: SaveDraftRequest,
): Promise<ApiResult<SaveDraftResponse>> {
  await delay(350);
  const draft = mockDrafts.get(draftId);
  if (!draft) {
    return {error: "Application not found or has expired.", errorCode: "NOT_FOUND", status: 404};
  }
  if (draft.status === "SUBMITTED") {
    return {
      error: "This application has already been submitted.",
      errorCode: "DRAFT_ALREADY_SUBMITTED",
      status: 409,
    };
  }

  // /save MERGES formData into what's already stored — client only ever
  // sends the current step's delta.
  draft.formData = {...draft.formData, ...input.formData};
  draft.currentStep = input.currentStep;
  draft.channel = input.channel;
  draft.lastUpdatedAt = new Date().toISOString();

  return {
    data: {
      draftId: draft.draftId,
      currentStep: draft.currentStep,
      lastUpdatedAt: draft.lastUpdatedAt,
      status: draft.status,
    },
    status: 200,
  };
}

// ─── GET /applications/{draftId}/security-check/questions ───

export async function mockGetSecurityCheckQuestions(
  draftId: string,
): Promise<ApiResult<SecurityCheckQuestionsResponse>> {
  await delay(300);
  const draft = mockDrafts.get(draftId);
  if (!draft) {
    return {error: "Application not found or has expired.", errorCode: "NOT_FOUND", status: 404};
  }
  return {data: CANNED_SECURITY_QUESTIONS, status: 200};
}

// ─── POST /applications/{draftId}/security-check ───
// Mocked pass/fail: fails once per check type before passing, so the
// attemptsRemaining/retry UI is demoable, then locks after
// SECURITY_CHECK_MAX_ATTEMPTS.

export async function mockSubmitSecurityCheck(
  draftId: string,
  input: SecurityCheckRequest,
): Promise<ApiResult<SecurityCheckResponse>> {
  await delay(500);
  const draft = mockDrafts.get(draftId);
  if (!draft) {
    return {error: "Application not found or has expired.", errorCode: "NOT_FOUND", status: 404};
  }

  const checkType: SecurityCheckType = input.checkType;
  const attemptsSoFar = draft.securityCheckAttempts[checkType] ?? 0;

  if (attemptsSoFar >= SECURITY_CHECK_MAX_ATTEMPTS) {
    return {
      error: "Too many failed attempts. Please contact support.",
      errorCode: "SECURITY_CHECK_FAILED",
      status: 422,
    };
  }

  draft.securityCheckAttempts[checkType] = attemptsSoFar + 1;

  // Demo-friendly: the very first attempt at each check type "fails" so the
  // retry path is visible, then passes. Facial recognition always passes on
  // "simulate capture" since there's no real answer to get wrong.
  const shouldFail = checkType !== "FACIAL_RECOGNITION" && attemptsSoFar === 0;

  if (shouldFail) {
    const attemptsRemaining = SECURITY_CHECK_MAX_ATTEMPTS - draft.securityCheckAttempts[checkType];
    if (attemptsRemaining <= 0) {
      return {
        error: "Too many failed attempts. Please contact support.",
        errorCode: "SECURITY_CHECK_FAILED",
        status: 422,
      };
    }
    return {
      data: {checkType, status: "FAILED", attemptsRemaining},
      status: 200,
    };
  }

  return {data: {checkType, status: "PASSED"}, status: 200};
}

// ─── POST /applications/{draftId}/finalize ───
// Not part of Screens 0-3, but included so the mock layer is a complete,
// swap-in-and-out stand-in for the real API.

export async function mockFinalizeApplication(
  draftId: string,
): Promise<ApiResult<FinalizeApplicationResponse>> {
  await delay(700);
  const draft = mockDrafts.get(draftId);
  if (!draft) {
    return {error: "Application not found or has expired.", errorCode: "NOT_FOUND", status: 404};
  }

  const customerId = draft.customerId ?? generateId("cust");
  const customerProductId = generateId("custprod");
  draft.customerId = customerId;
  draft.status = "SUBMITTED";
  mockResumeIndex.delete(draftKey(draft.productCode, draft.primaryIdentifierValue));

  mockIdentifierIndex.set(identifierKey(draft.primaryIdentifierType, draft.primaryIdentifierValue), {
    customerId,
    formData: draft.formData,
  });
  if (draft.secondaryIdentifierType && draft.secondaryIdentifierValue) {
    mockIdentifierIndex.set(identifierKey(draft.secondaryIdentifierType, draft.secondaryIdentifierValue), {
      customerId,
      formData: draft.formData,
    });
  }

  return {
    data: {
      customerId,
      customerProductId,
      productAccountReference: Math.floor(1_000_000_000 + Math.random() * 8_999_999_999).toString(),
      status: "ACTIVE",
    },
    status: 200,
  };
}
