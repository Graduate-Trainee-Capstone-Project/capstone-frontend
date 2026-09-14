"use client";

import {useState} from "react";
import {useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Modal} from "@/app/_components/ui/Modal";
import {SecurityQuestionModal} from "@/app/_components/onboarding/SecurityQuestionModal";
import {FacialCaptureModal} from "@/app/_components/onboarding/FacialCaptureModal";

/**
 * Existing customers only — fires whenever requiresSecurityCheck came back
 * true from /start, never based on productCode. Two sub-modals must both
 * PASS before we advance past this screen.
 */
export function SecurityVerificationStep() {
  const draftId = useOnboardingStore((state) => state.draftId);
  const securityCheckSubStep = useOnboardingStore((state) => state.securityCheckSubStep);
  const setSecurityCheckSubStep = useOnboardingStore((state) => state.setSecurityCheckSubStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const saveDraft = useSaveDraft(draftId ?? "");

  const [isExhausted, setIsExhausted] = useState(false);

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  if (isExhausted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-error-100 bg-error-50 p-8 text-center">
        <h3 className="text-base font-semibold text-error-600">We couldn&apos;t verify your identity</h3>
        <p className="text-sm text-grey-600">
          You&apos;ve reached the maximum number of attempts. Please contact support to continue.
        </p>
      </div>
    );
  }

  function handleFacialPassed() {
    setSecurityCheckSubStep(null);
    saveDraft.mutate(
      {currentStep: "PRODUCT_SPECIFIC_INFO", formData: {}, channel: "WEB"},
      {onSuccess: (data) => setCurrentStep(data.currentStep)},
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">Verify it&apos;s you</h2>
        <p className="text-sm text-grey-600">We found an existing profile — a quick check keeps it secure.</p>
      </div>

      <Modal isOpen={securityCheckSubStep === "SECURITY_QUESTION"} title="Security questions" dismissible={false}>
        <SecurityQuestionModal
          draftId={draftId}
          onPassed={() => setSecurityCheckSubStep("FACIAL_RECOGNITION")}
          onExhausted={() => setIsExhausted(true)}
        />
      </Modal>

      <Modal isOpen={securityCheckSubStep === "FACIAL_RECOGNITION"} title="Face verification" dismissible={false}>
        <FacialCaptureModal draftId={draftId} onPassed={handleFacialPassed} onExhausted={() => setIsExhausted(true)} />
      </Modal>
    </div>
  );
}
