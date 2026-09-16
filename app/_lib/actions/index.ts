"use server";

import {apiRequest} from "@/app/_lib";
import {
  mockFinalizeApplication,
  mockGetApplication,
  mockGetProduct,
  mockGetProducts,
  mockGetSecurityCheckQuestions,
  mockRequestBvnOtp,
  mockSaveDraft,
  mockStartApplication,
  mockSubmitSecurityCheck,
  mockVerifyBvnOtp,
} from "@/app/_lib/mocks/handlers";
import type {
  ApiResult,
  ApplicationDraftResponse,
  FinalizeApplicationResponse,
  Product,
  ProductsResponse,
  RequestBvnOtpRequest,
  RequestBvnOtpResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  SecurityCheckQuestionsResponse,
  SecurityCheckRequest,
  SecurityCheckResponse,
  StartApplicationRequest,
  StartApplicationResponse,
  VerifyBvnOtpRequest,
  VerifyBvnOtpResponse,
} from "@/app/_types";

/**
 * Every action here returns an ApiResult<T> ({ data } | { error, errorCode })
 * and never throws — same contract as apiRequest itself. TanStack Query wants
 * thrown errors, not returned ones, so each hook in _hooks/index.ts wraps the
 * matching action in a small throw-adapter rather than calling it directly.
 * Keeping the throw at the hook layer means these actions stay reusable from
 * anywhere else too (a Server Component, a plain form action) without dragging
 * TanStack-specific behavior into them.
 *
 * MOCKS_ENABLED: the real .NET API isn't reachable yet (API_URL is still a
 * placeholder). While that's true, every action routes to the in-memory mock
 * layer in app/_lib/mocks instead of apiRequest, so the whole flow — resume,
 * existing-customer detection, security checks — is demoable end to end.
 * Flip MOCK_MODE=false (and point API_URL at the real backend) to switch
 * every action below back to the real contract with zero call-site changes.
 */
const MOCKS_ENABLED =
  process.env.MOCK_MODE === "true" ||
  (process.env.MOCK_MODE !== "false" &&
    (!process.env.API_URL || process.env.API_URL.includes("api.example.com")));

// GET /products
export async function getProductsAction(): Promise<ApiResult<ProductsResponse>> {
  if (MOCKS_ENABLED) return mockGetProducts();
  return apiRequest.get<ProductsResponse>("/products");
}

// GET /products/{productCode}
export async function getProductAction(productCode: string): Promise<ApiResult<Product>> {
  if (MOCKS_ENABLED) return mockGetProduct(productCode);
  return apiRequest.get<Product>(`/products/${productCode}`);
}

// POST /applications/start
export async function startApplicationAction(
  input: StartApplicationRequest,
): Promise<ApiResult<StartApplicationResponse>> {
  if (MOCKS_ENABLED) return mockStartApplication(input);
  return apiRequest.post<StartApplicationResponse>("/applications/start", input);
}

// GET /applications/{draftId}
export async function getApplicationAction(
  draftId: string,
): Promise<ApiResult<ApplicationDraftResponse>> {
  if (MOCKS_ENABLED) return mockGetApplication(draftId);
  return apiRequest.get<ApplicationDraftResponse>(`/applications/${draftId}`);
}

// PUT /applications/{draftId}/save
export async function saveDraftAction(
  draftId: string,
  input: SaveDraftRequest,
): Promise<ApiResult<SaveDraftResponse>> {
  if (MOCKS_ENABLED) return mockSaveDraft(draftId, input);
  return apiRequest.put<SaveDraftResponse>(`/applications/${draftId}/save`, input);
}

// GET /applications/{draftId}/security-check/questions
export async function getSecurityCheckQuestionsAction(
  draftId: string,
): Promise<ApiResult<SecurityCheckQuestionsResponse>> {
  if (MOCKS_ENABLED) return mockGetSecurityCheckQuestions(draftId);
  return apiRequest.get<SecurityCheckQuestionsResponse>(
    `/applications/${draftId}/security-check/questions`,
  );
}

// POST /applications/{draftId}/security-check
export async function submitSecurityCheckAction(
  draftId: string,
  input: SecurityCheckRequest,
): Promise<ApiResult<SecurityCheckResponse>> {
  if (MOCKS_ENABLED) return mockSubmitSecurityCheck(draftId, input);
  return apiRequest.post<SecurityCheckResponse>(`/applications/${draftId}/security-check`, input);
}

// POST /applications/{draftId}/finalize
export async function finalizeApplicationAction(
  draftId: string,
): Promise<ApiResult<FinalizeApplicationResponse>> {
  if (MOCKS_ENABLED) return mockFinalizeApplication(draftId);
  return apiRequest.post<FinalizeApplicationResponse>(`/applications/${draftId}/finalize`, {});
}

// POST /existing-customer/bvn-otp/request — product-agnostic cross-subsidiary lookup, step 1.
export async function requestBvnOtpAction(
  input: RequestBvnOtpRequest,
): Promise<ApiResult<RequestBvnOtpResponse>> {
  if (MOCKS_ENABLED) return mockRequestBvnOtp(input);
  return apiRequest.post<RequestBvnOtpResponse>("/existing-customer/bvn-otp/request", input);
}

// POST /existing-customer/bvn-otp/verify — step 2, returns matched profile formData if found.
export async function verifyBvnOtpAction(
  input: VerifyBvnOtpRequest,
): Promise<ApiResult<VerifyBvnOtpResponse>> {
  if (MOCKS_ENABLED) return mockVerifyBvnOtp(input);
  return apiRequest.post<VerifyBvnOtpResponse>("/existing-customer/bvn-otp/verify", input);
}
