'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DraftFormData,
  DraftStep,
  ExistingCustomerData,
  FinalizeApplicationResponse,
  ProductCode,
  StartApplicationResponse,
} from '@/app/_types';

/**
 * New existing-customer starts come back with empty formData and the profile
 * on `existingCustomer` instead — map it into the same bag PersonalInfoStep
 * reads from. `address` is a single street string on existingCustomer (not
 * our {street, city, state} shape), so it lands in address[0].street only.
 */
function prefillFromExistingCustomer(
  existing: ExistingCustomerData,
): Partial<DraftFormData> {
  const prefill: Partial<DraftFormData> = {
    firstName: existing.firstName,
    lastName: existing.lastName,
  };
  if (existing.middleName) prefill.middleName = existing.middleName;
  if (existing.dateOfBirth) prefill.dateOfBirth = existing.dateOfBirth;
  if (existing.gender) prefill.gender = existing.gender;
  if (existing.phoneNumber) prefill.phoneNumber = existing.phoneNumber;
  if (existing.email) prefill.email = existing.email;
  if (existing.address)
    prefill.address = [
      { houseNumber: '', street: existing.address, city: '', state: '' },
    ];
  return prefill;
}

/**
 * Shallow-merges top-level formData keys, but deep-merges address instead
 * of overwriting it wholesale — autosave only ever sends the fields
 * changed since the last save, so a plain shallow merge would drop
 * previously-saved sibling fields (e.g. saving a new `street` alone
 * would blank out `city`/`state` in the store).
 */
function mergeFormData(
  base: DraftFormData,
  partial: Partial<DraftFormData>,
): DraftFormData {
  const merged: DraftFormData = { ...base, ...partial };

  if (partial.address) {
    const prevAddress = base.address?.[0] ?? {};
    const nextAddress = partial.address[0] ?? {};
    merged.address = [{ ...prevAddress, ...nextAddress }];
  } else {
    merged.address = base.address;
  }

  return merged;
}

type SecurityCheckSubStep =
  | 'OTP'
  | 'SECURITY_QUESTION'
  | 'FACIAL_RECOGNITION'
  | null;

interface OnboardingState {
  productCode: ProductCode | null;
  draftId: string | null;
  /** Mirrors the server's currentStep — this is the source of truth, never diverges except for sub-step UI below. */
  currentStep: DraftStep | null;
  isExistingCustomer: boolean;
  requiresSecurityCheck: boolean;
  /** Accumulated form values, kept locally only for prefill across steps — never the source of truth for persistence. */
  formData: DraftFormData;
  /** UI-only: which security sub-modal is showing. Never round-trips to the server. */
  securityCheckSubStep: SecurityCheckSubStep;
  /**
   * POST /finalize's response has no analog on GET /applications/{draftId},
   * so it can't be re-derived from the server after the fact — the
   * Confirmation screen reads it straight from here instead of a query.
   */
  finalizeResult: FinalizeApplicationResponse | null;
  /**
   * Primary identifier from this session's identifier screen — used only
   * for the same-tab duplicate-product guard. Never persisted.
   */
  primaryIdentifierValue: string | null;

  setFromStartResponse: (
    response: StartApplicationResponse,
    productCode: ProductCode,
  ) => void;
  setPrimaryIdentifierValue: (value: string) => void;
  setCurrentStep: (step: DraftStep) => void;
  patchFormData: (partial: Partial<DraftFormData>) => void;
  setSecurityCheckSubStep: (subStep: SecurityCheckSubStep) => void;
  setFinalizeResult: (result: FinalizeApplicationResponse) => void;
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
  finalizeResult: null,
  primaryIdentifierValue: null,
} satisfies Omit<
  OnboardingState,
  | 'setFromStartResponse'
  | 'setPrimaryIdentifierValue'
  | 'setCurrentStep'
  | 'patchFormData'
  | 'setSecurityCheckSubStep'
  | 'setFinalizeResult'
  | 'reset'
>;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setFromStartResponse: (response, productCode) => {
        const formDataFromResponse = response.formData ?? {};
        const hasFormData = Object.keys(formDataFromResponse).length > 0;

        set({
          productCode,
          draftId: response.draftId,
          currentStep: response.currentStep,
          isExistingCustomer: response.isExistingCustomer,
          requiresSecurityCheck: response.requiresSecurityCheck,
          formData:
            hasFormData || !response.existingCustomer
              ? formDataFromResponse
              : prefillFromExistingCustomer(response.existingCustomer),
          // Existing customers land on SECURITY_VERIFICATION — OTP then facial.
          securityCheckSubStep:
            response.requiresSecurityCheck ||
            response.currentStep === 'SECURITY_VERIFICATION'
              ? 'OTP'
              : null,
        });
      },

      setPrimaryIdentifierValue: (value) =>
        set({ primaryIdentifierValue: value }),

      setCurrentStep: (step) => set({ currentStep: step }),

      patchFormData: (partial) =>
        set((state) => ({ formData: mergeFormData(state.formData, partial) })),

      setSecurityCheckSubStep: (subStep) =>
        set({ securityCheckSubStep: subStep }),

      setFinalizeResult: (result) => set({ finalizeResult: result }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'onboarding-draft',
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
        finalizeResult: state.finalizeResult,
      }),
    },
  ),
);
