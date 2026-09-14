"use client";

import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {DraftStep, ProductCode, StartApplicationResponse} from "@/app/_types";

type SecurityCheckSubStep = "SECURITY_QUESTION" | "FACIAL_RECOGNITION" | null;

interface OnboardingState {
  productCode: ProductCode | null;
  draftId: string | null;
  /** Mirrors the server's currentStep — this is the source of truth, never diverges except for sub-step UI below. */
  currentStep: DraftStep | null;
  isExistingCustomer: boolean;
  requiresSecurityCheck: boolean;
  /** Accumulated form values, kept locally only for prefill across steps — never the source of truth for persistence. */
  formData: Record<string, unknown>;
  /** UI-only: which security sub-modal is showing. Never round-trips to the server. */
  securityCheckSubStep: SecurityCheckSubStep;

  setFromStartResponse: (response: StartApplicationResponse, productCode: ProductCode) => void;
  setCurrentStep: (step: DraftStep) => void;
  patchFormData: (partial: Record<string, unknown>) => void;
  setSecurityCheckSubStep: (subStep: SecurityCheckSubStep) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  productCode: null,
  draftId: null,
  currentStep: null,
  isExistingCustomer: false,
  requiresSecurityCheck: false,
  formData: {},
  securityCheckSubStep: null,
} satisfies Omit<
  OnboardingState,
  "setFromStartResponse" | "setCurrentStep" | "patchFormData" | "setSecurityCheckSubStep" | "reset"
>;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setFromStartResponse: (response, productCode) =>
        set({
          productCode,
          draftId: response.draftId,
          currentStep: response.currentStep,
          isExistingCustomer: response.isExistingCustomer,
          requiresSecurityCheck: response.requiresSecurityCheck,
          formData: response.formData ?? {},
          // Existing customers land straight on SECURITY_VERIFICATION — make
          // sure the first sub-modal is queued up rather than left null.
          securityCheckSubStep: response.requiresSecurityCheck ? "SECURITY_QUESTION" : null,
        }),

      setCurrentStep: (step) => set({currentStep: step}),

      patchFormData: (partial) => set((state) => ({formData: {...state.formData, ...partial}})),

      setSecurityCheckSubStep: (subStep) => set({securityCheckSubStep: subStep}),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: "onboarding-draft",
      // Only what's needed to resume a same-tab reload — everything else
      // (isExistingCustomer, requiresSecurityCheck, sub-step) is re-derived
      // from the server via GET /applications/{draftId} or a fresh /start.
      partialize: (state) => ({
        productCode: state.productCode,
        draftId: state.draftId,
        currentStep: state.currentStep,
        formData: state.formData,
        isExistingCustomer: state.isExistingCustomer,
        requiresSecurityCheck: state.requiresSecurityCheck,
      }),
    },
  ),
);
