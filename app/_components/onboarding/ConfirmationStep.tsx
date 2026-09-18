"use client";

import {useRouter} from "next/navigation";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Button} from "@/app/_ui/Button";
import {ROUTES} from "@/app/_constants";
import {displayAccountReference} from "@/app/_utils/applicationCopy";
import {BrandLogo} from "@/app/_components/brand/BrandLogo";

const SUCCESS_COPY =
  "Dear customer, your application was submitted successfully. Your account reference is";

export function ConfirmationStep() {
  const router = useRouter();
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
        <p className="text-sm text-grey-600">
          Your application was submitted successfully. Your account reference is not shown in this
          session — it was issued when you submitted. You can close this page.
        </p>
        <Button onClick={handleDone}>Done</Button>
      </div>
    );
  }

  const reference = displayAccountReference(finalizeResult.productAccountReference);

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <BrandLogo variant="blue" size="sm" className="self-center" />
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
          {SUCCESS_COPY} {reference}.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-grey-50 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-500">Account reference</span>
          <span className="text-sm font-semibold text-grey-900">{reference}</span>
        </div>
        {reference !== finalizeResult.productAccountReference ? (
          <p className="text-left text-xs text-grey-500">
            Issued reference: {finalizeResult.productAccountReference}
          </p>
        ) : null}
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
