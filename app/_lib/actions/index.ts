'use server';

import { apiRequest } from '@/app/_lib';
import {
  mockFinalizeApplication,
  mockGetApplication,
  mockGetProduct,
  mockGetProducts,
  mockGetSecurityCheckQuestions,
  mockSaveDraft,
  mockStartApplication,
  mockSubmitSecurityCheck,
} from '@/app/_lib/mocks/handlers';
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
} from '@/app/_types';

/**
 * Every action here returns an ApiResult<T> ({ data } | { error, errorCode })
 * and never throws — same contract as apiRequest itself. TanStack Query wants
 * thrown errors, not returned ones, so each hook in _hooks/index.ts wraps the
 * matching action in a small throw-adapter rather than calling it directly.
 *
 * MOCKS_ENABLED: when MOCK_MODE=true (or API_URL is still a placeholder),
 * catalog/draft actions route to the in-memory mock layer.
 *
 * Security-check questions + submit are ALWAYS mocked, regardless of
 * MOCKS_ENABLED — same as OTP. BE has no working route for these yet (only
 * a GET of past checks, no way to fetch questions; see B6 in
 * docs/justin-backend-alignment-briefing.md), so unlike every other action
 * here there is no live branch to fall back to.
 *
 * Customer lookup is never mocked — OTP is client-side; the lookup itself
 * must hit the real store so created customers can be found.
 */
const MOCKS_ENABLED =
  process.env.MOCK_MODE === 'true' ||
  (process.env.MOCK_MODE !== 'false' &&
    (!process.env.API_URL || process.env.API_URL.includes('api.example.com')));

/**
 * BE's /save is multipart/form-data with flat fields, not JSON (see
 * SaveDraftRequest in _types). Every entry gets appended as-is: a File
 * instance keeps its filename, everything else is stringified. undefined/
 * null/"" are skipped so an unset field never overwrites what's already
 * saved — BE null-coalesces per field against the stored record.
 */
function buildSaveDraftFormData(input: SaveDraftRequest): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null || value === '') continue;
    if (value instanceof File) {
      formData.append(key, value, value.name);
      continue;
    }
    formData.append(key, String(value));
  }
  return formData;
}

// GET /products
export async function getProductsAction(): Promise<ApiResult<Product[]>> {
  if (MOCKS_ENABLED) return mockGetProducts();
  return apiRequest.get<Product[]>('/products');
}

// GET /products/by/{productCode}
export async function getProductAction(
  productCode: string,
): Promise<ApiResult<Product>> {
  if (MOCKS_ENABLED) return mockGetProduct(productCode);
  return apiRequest.get<Product>(`/products/by/${productCode}`);
}

// POST /applications/start
export async function startApplicationAction(
  input: StartApplicationRequest,
): Promise<ApiResult<StartApplicationResponse>> {
  if (MOCKS_ENABLED) return mockStartApplication(input);
  return apiRequest.post<StartApplicationResponse>(
    '/applications/start',
    input,
  );
}

// GET /applications/{draftId}
export async function getApplicationAction(
  draftId: string,
): Promise<ApiResult<ApplicationDraftResponse>> {
  if (MOCKS_ENABLED) return mockGetApplication(draftId);
  return apiRequest.get<ApplicationDraftResponse>(`/applications/${draftId}`);
}

// PUT /applications/{draftId}/save — multipart/form-data, flat fields.
export async function saveDraftAction(
  draftId: string,
  input: SaveDraftRequest,
): Promise<ApiResult<SaveDraftResponse>> {
  if (MOCKS_ENABLED) return mockSaveDraft(draftId, input);
  return apiRequest.putForm<SaveDraftResponse>(
    `/applications/${draftId}/save`,
    buildSaveDraftFormData(input),
  );
}

// GET /applications/{draftId}/security-check/questions — always mocked, see note above.
export async function getSecurityCheckQuestionsAction(
  draftId: string,
): Promise<ApiResult<SecurityCheckQuestionsResponse>> {
  return mockGetSecurityCheckQuestions(draftId);
}

// POST /applications/{draftId}/security-check — always mocked, see note above.
export async function submitSecurityCheckAction(
  draftId: string,
  input: SecurityCheckRequest,
): Promise<ApiResult<SecurityCheckResponse>> {
  return mockSubmitSecurityCheck(draftId, input);
}

// POST /applications/{draftId}/finalize
export async function finalizeApplicationAction(
  draftId: string,
): Promise<ApiResult<FinalizeApplicationResponse>> {
  if (MOCKS_ENABLED) return mockFinalizeApplication(draftId);
  return apiRequest.post<FinalizeApplicationResponse>(
    `/applications/${draftId}/finalize`,
    {},
  );
}

// POST /customers/lookup — never mocked. See docs/customer-lookup-contract.md.
export async function lookupCustomerAction(
  input: LookupCustomerRequest,
): Promise<ApiResult<LookupCustomerResponse>> {
  return apiRequest.post<LookupCustomerResponse>('/customers/lookup', input);
}
