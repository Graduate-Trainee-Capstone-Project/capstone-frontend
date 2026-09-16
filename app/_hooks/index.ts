"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  finalizeApplicationAction,
  getApplicationAction,
  getProductAction,
  getProductsAction,
  getSecurityCheckQuestionsAction,
  requestBvnOtpAction,
  saveDraftAction,
  startApplicationAction,
  submitSecurityCheckAction,
  verifyBvnOtpAction,
} from "@/app/_lib/actions";
import type {
  ApiResult,
  RequestBvnOtpRequest,
  SaveDraftRequest,
  SecurityCheckRequest,
  StartApplicationRequest,
  VerifyBvnOtpRequest,
} from "@/app/_types";

/**
 * Every Server Action returns { data } | { error, errorCode } and never throws.
 * TanStack Query's onError/isError only fire on a rejected promise, so this
 * adapter is the one place that bridges the two: unwrap on success, throw on
 * error. Attach errorCode/errorField to the thrown Error so screens that need
 * to branch on it (e.g. attemptsRemaining on a failed security check) still
 * can — see SecurityCheckError below.
 */
export class ApiRequestError extends Error {
  code?: string;
  field?: string;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.field = field;
  }
}

function unwrap<T>(result: ApiResult<T>): T {
  if (result.error) {
    throw new ApiRequestError(result.error, result.errorCode, result.errorField);
  }
  return result.data as T;
}

// ─── Query keys — centralized so invalidation stays consistent ───

export const onboardingKeys = {
  products: ["products"] as const,
  product: (productCode: string) => ["products", productCode] as const,
  draft: (draftId: string) => ["applications", draftId] as const,
  securityQuestions: (draftId: string) =>
    ["applications", draftId, "security-check", "questions"] as const,
};

// ─── GET /products ───

export function useProducts() {
  return useQuery({
    queryKey: onboardingKeys.products,
    queryFn: async () => unwrap(await getProductsAction()),
    staleTime: 5 * 60 * 1000, // product catalog barely changes within a session
  });
}

// ─── GET /products/{productCode} ───

export function useProduct(productCode: string | undefined) {
  return useQuery({
    queryKey: onboardingKeys.product(productCode ?? ""),
    queryFn: async () => unwrap(await getProductAction(productCode as string)),
    enabled: Boolean(productCode),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── POST /applications/start ───
// The single most important mutation — resume, dedup-detection, and new-draft
// creation all come back through this one call. Route on the response's
// isResumed / isExistingCustomer / currentStep, don't branch on anything else.

export function useStartApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: StartApplicationRequest) =>
      unwrap(await startApplicationAction(input)),
    onSuccess: (data) => {
      // Seed the draft cache so an immediate GET /applications/{draftId}
      // (e.g. on refresh) doesn't need a network round trip.
      queryClient.setQueryData(onboardingKeys.draft(data.draftId), data);
    },
  });
}

// ─── GET /applications/{draftId} ───
// Used when the frontend already has a cached draftId (e.g. same-tab reload),
// separate from the identifier-based resume in useStartApplication.

export function useApplication(draftId: string | undefined) {
  return useQuery({
    queryKey: onboardingKeys.draft(draftId ?? ""),
    queryFn: async () => unwrap(await getApplicationAction(draftId as string)),
    enabled: Boolean(draftId),
    // Cross-device resume depends on this never serving a stale copy.
    staleTime: 0,
  });
}

// ─── PUT /applications/{draftId}/save ───

export function useSaveDraft(draftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SaveDraftRequest) => unwrap(await saveDraftAction(draftId, input)),
    onSuccess: (data) => {
      queryClient.setQueryData(onboardingKeys.draft(draftId), (prev: unknown) => ({
        ...(typeof prev === "object" && prev ? prev : {}),
        ...data,
      }));
    },
  });
}

// ─── GET /applications/{draftId}/security-check/questions ───

export function useSecurityCheckQuestions(draftId: string | undefined) {
  return useQuery({
    queryKey: onboardingKeys.securityQuestions(draftId ?? ""),
    queryFn: async () => unwrap(await getSecurityCheckQuestionsAction(draftId as string)),
    enabled: Boolean(draftId),
  });
}

// ─── POST /applications/{draftId}/security-check ───
// On FAILED, ApiRequestError.code will be SECURITY_CHECK_FAILED once attempts
// are exhausted (422) — a PASSED/FAILED-with-attemptsRemaining response is a
// normal 200 and resolves through onSuccess instead; check data.status there.

export function useSubmitSecurityCheck(draftId: string) {
  return useMutation({
    mutationFn: async (input: SecurityCheckRequest) =>
      unwrap(await submitSecurityCheckAction(draftId, input)),
  });
}

// ─── POST /applications/{draftId}/finalize ───

export function useFinalizeApplication(draftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrap(await finalizeApplicationAction(draftId)),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: onboardingKeys.draft(draftId)});
    },
  });
}

// ─── POST /existing-customer/bvn-otp/request, /verify ───
// Product-agnostic "already a customer?" shortcut — usable from any apply
// flow's identifier-capture screen, not tied to a productCode query key.

export function useRequestBvnOtp() {
  return useMutation({
    mutationFn: async (input: RequestBvnOtpRequest) => unwrap(await requestBvnOtpAction(input)),
  });
}

export function useVerifyBvnOtp() {
  return useMutation({
    mutationFn: async (input: VerifyBvnOtpRequest) => unwrap(await verifyBvnOtpAction(input)),
  });
}
