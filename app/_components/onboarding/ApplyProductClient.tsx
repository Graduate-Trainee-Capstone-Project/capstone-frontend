"use client";

import {useEffect} from "react";
import toast from "react-hot-toast";
import {ApiRequestError, useApplication} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {IdentifierCaptureStep} from "@/app/_components/onboarding/IdentifierCaptureStep";
import {SecurityVerificationStep} from "@/app/_components/onboarding/SecurityVerificationStep";
import {PersonalInfoStep} from "@/app/_components/onboarding/PersonalInfoStep";
import {ProductSpecificInfoStep} from "@/app/_components/onboarding/ProductSpecificInfoStep";
import {DocumentUploadStep} from "@/app/_components/onboarding/DocumentUploadStep";
import {ReviewStep} from "@/app/_components/onboarding/ReviewStep";
import {ConfirmationStep} from "@/app/_components/onboarding/ConfirmationStep";
import {Skeleton} from "@/app/_ui/Skeleton";
import type {ProductCode} from "@/app/_types";

interface ApplyProductClientProps {
  productCode: ProductCode;
}

/**
 * Pure switch on state — no business logic lives here. Same URL, reloaded
 * on a different device (or the same tab), re-derives everything: if a
 * cached draftId for this exact product exists, resync from the server via
 * GET /applications/{draftId}; otherwise fall back to identifier capture,
 * which re-triggers the identifier-based resume/existing-customer flow.
 */
export function ApplyProductClient({productCode}: ApplyProductClientProps) {
  const storedProductCode = useOnboardingStore((state) => state.productCode);
  const draftId = useOnboardingStore((state) => state.draftId);
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const reset = useOnboardingStore((state) => state.reset);

  const hasMatchingCachedDraft = Boolean(draftId) && storedProductCode === productCode;
  const applicationQuery = useApplication(hasMatchingCachedDraft ? (draftId as string) : undefined);

  useEffect(() => {
    if (!applicationQuery.data) return;
    setCurrentStep(applicationQuery.data.currentStep);
    patchFormData(applicationQuery.data.formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationQuery.data]);

  useEffect(() => {
    if (!applicationQuery.error) return;
    if (applicationQuery.error instanceof ApiRequestError) {
      if (applicationQuery.error.code === "DRAFT_ALREADY_SUBMITTED") {
        toast("This application was already submitted.");
      }
    }
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationQuery.error]);

  if (hasMatchingCachedDraft && applicationQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (currentStep === "SECURITY_VERIFICATION") {
    return <SecurityVerificationStep />;
  }

  if (currentStep === "PERSONAL_INFO") {
    return <PersonalInfoStep />;
  }

  if (currentStep === "PRODUCT_SPECIFIC_INFO") {
    return <ProductSpecificInfoStep />;
  }

  if (currentStep === "DOCUMENT_UPLOAD") {
    return <DocumentUploadStep />;
  }

  if (currentStep === "REVIEW") {
    return <ReviewStep />;
  }

  if (currentStep === "SUBMITTED") {
    return <ConfirmationStep />;
  }

  return <IdentifierCaptureStep productCode={productCode} />;
}
