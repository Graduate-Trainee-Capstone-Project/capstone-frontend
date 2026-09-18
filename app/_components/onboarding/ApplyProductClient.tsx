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
import {ALREADY_COMPLETED_MESSAGE, isAlreadyCompletedMessage} from "@/app/_utils/applicationCopy";
import type {ProductCode} from "@/app/_types";

interface ApplyProductClientProps {
  productCode: ProductCode;
}

export function ApplyProductClient({productCode}: ApplyProductClientProps) {
  const storedProductCode = useOnboardingStore((state) => state.productCode);
  const draftId = useOnboardingStore((state) => state.draftId);
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const finalizeResult = useOnboardingStore((state) => state.finalizeResult);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const securityCheckSubStep = useOnboardingStore((state) => state.securityCheckSubStep);
  const setSecurityCheckSubStep = useOnboardingStore((state) => state.setSecurityCheckSubStep);
  const reset = useOnboardingStore((state) => state.reset);

  const alreadyFinished = currentStep === "SUBMITTED" || Boolean(finalizeResult);
  const hasMatchingCachedDraft = Boolean(draftId) && storedProductCode === productCode && !alreadyFinished;
  const applicationQuery = useApplication(hasMatchingCachedDraft ? (draftId as string) : undefined);

  useEffect(() => {
    if (!applicationQuery.data) return;
    setCurrentStep(applicationQuery.data.currentStep);
    patchFormData(applicationQuery.data.formData);
    if (applicationQuery.data.currentStep === "SECURITY_VERIFICATION" && !securityCheckSubStep) {
      setSecurityCheckSubStep("OTP");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationQuery.data]);

  useEffect(() => {
    if (!applicationQuery.error) return;

    const message =
      applicationQuery.error instanceof ApiRequestError ? applicationQuery.error.message : "";
    const alreadyCompleted =
      applicationQuery.error instanceof ApiRequestError &&
      (applicationQuery.error.code === "DRAFT_ALREADY_SUBMITTED" ||
        isAlreadyCompletedMessage(message));

    if (finalizeResult || currentStep === "SUBMITTED") {
      setCurrentStep("SUBMITTED");
      return;
    }

    if (alreadyCompleted) {
      toast(ALREADY_COMPLETED_MESSAGE);
    }
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationQuery.error]);

  if (alreadyFinished) {
    return <ConfirmationStep />;
  }

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

  return <IdentifierCaptureStep productCode={productCode} />;
}
