"use server";

import {apiRequest} from "@/app/_lib";
import {
  mockFinalizeApplication,
  mockGetApplication,
  mockGetProduct,
  mockGetProducts,
  mockGetSecurityCheckQuestions,
  mockSaveDraft,
  mockStartApplication,
  mockSubmitSecurityCheck,
} from "@/app/_lib/mocks/handlers";
import type {
  ApiResult,
  ApplicationDraftResponse,
  FinalizeApplicationResponse,
  LookupCustomerRequest,
  LookupCustomerResponse,
  Product,
  SaveDraftRequest,
  SaveDraftResponse,
  SecurityCheckQuestionsResponse,
  SecurityCheckRequest,
  SecurityCheckResponse,
  StartApplicationRequest,
  StartApplicationResponse,
} from "@/app/_types";

/**
 * Every action here returns an ApiResult<T> ({ data } | { error, errorCode })
 * and never throws — same contract as apiRequest itself. TanStack Query wants
 * thrown errors, not returned ones, so each hook in _hooks/index.ts wraps the
 * matching action in a small throw-adapter rather than calling it directly.
 *
 * MOCKS_ENABLED: when MOCK_MODE=true (or API_URL is still a placeholder),
 * catalog/draft actions route to the in-memory mock layer.
 *
 * MOCK_SECURITY_CHECK: security questions + submit stay mocked even against
 * a live API until BE wires those routes. Set MOCK_SECURITY_CHECK=false to
 * hit GET/POST /applications/{draftId}/security-check...
 *
 * Customer lookup is never mocked — OTP is client-side; the lookup itself
 * must hit the real store so created customers can be found.
 */
const MOCKS_ENABLED =
  process.env.MOCK_MODE === "true" ||
  (process.env.MOCK_MODE !== "false" &&
    (!process.env.API_URL || process.env.API_URL.includes("api.example.com")));

const MOCK_SECURITY_CHECK = MOCKS_ENABLED || process.env.MOCK_SECURITY_CHECK !== "false";

// GET /products
export async function getProductsAction(): Promise<ApiResult<Product[]>> {
  if (MOCKS_ENABLED) return mockGetProducts();
  return apiRequest.get<Product[]>("/products");
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
  if (MOCK_SECURITY_CHECK) return mockGetSecurityCheckQuestions(draftId);
  return apiRequest.get<SecurityCheckQuestionsResponse>(
    `/applications/${draftId}/security-check/questions`,
  );
}

// POST /applications/{draftId}/security-check
export async function submitSecurityCheckAction(
  draftId: string,
  input: SecurityCheckRequest,
): Promise<ApiResult<SecurityCheckResponse>> {
  if (MOCK_SECURITY_CHECK) return mockSubmitSecurityCheck(draftId, input);
  return apiRequest.post<SecurityCheckResponse>(`/applications/${draftId}/security-check`, input);
}

// POST /applications/{draftId}/finalize
export async function finalizeApplicationAction(
  draftId: string,
): Promise<ApiResult<FinalizeApplicationResponse>> {
  if (MOCKS_ENABLED) return mockFinalizeApplication(draftId);
  return apiRequest.post<FinalizeApplicationResponse>(`/applications/${draftId}/finalize`, {});
}

// POST /customers/lookup — never mocked. See docs/customer-lookup-contract.md.
export async function lookupCustomerAction(
  input: LookupCustomerRequest,
): Promise<ApiResult<LookupCustomerResponse>> {
  return apiRequest.post<LookupCustomerResponse>("/customers/lookup", input);
}
