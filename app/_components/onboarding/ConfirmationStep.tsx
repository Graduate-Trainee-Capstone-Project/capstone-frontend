"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/app/_hooks/useOnboardingStore";
import { Button } from "@/app/_ui/Button";
import { ROUTES } from "@/app/_constants";

export function ConfirmationStep() {
  const router = useRouter();
  const productCode = useOnboardingStore((state) => state.productCode);
  const finalizeResult = useOnboardingStore((state) => state.finalizeResult);
  const reset = useOnboardingStore((state) => state.reset);

  function handleDone() {
    reset();
    router.push(ROUTES.home);
  }

  if (!finalizeResult) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-grey-200 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-grey-900">Application submitted</h3>
        <p className="text-sm text-grey-600">Your application went through, but we lost track of the details here.</p>
        <Button onClick={handleDone}>Done</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-success-50 text-success-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-7"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">You&apos;re all set!</h2>
        <p className="text-sm text-grey-600">
          {productCode ? `Your ${productCode.replace(/_/g, " ").toLowerCase()} application` : "Your application"} was
          submitted successfully.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-grey-50 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-500">Account reference</span>
          <span className="text-sm font-semibold text-grey-900">{finalizeResult.productAccountReference}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-500">Status</span>
          <span className="text-sm font-semibold text-success-500">{finalizeResult.status}</span>
        </div>
      </div>

      <Button onClick={handleDone} fullWidth>
        Done
      </Button>
    </div>
  );
}
