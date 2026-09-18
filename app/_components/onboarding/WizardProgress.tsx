"use client";

import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {cn} from "@/app/_utils/cn";
import {
  WIZARD_STEPS,
  WIZARD_STEP_META,
  isWizardComplete,
  wizardStepIndex,
} from "@/app/_utils/wizard";

export function WizardProgress() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const complete = isWizardComplete(currentStep);
  const activeIndex = complete ? WIZARD_STEPS.length - 1 : wizardStepIndex(currentStep);
  const total = WIZARD_STEPS.length;
  const displayStep = complete ? total : activeIndex + 1;
  const activeMeta = WIZARD_STEP_META[WIZARD_STEPS[complete ? total - 1 : activeIndex]];
  const fillPercent = complete ? 100 : (activeIndex / (total - 1)) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-primary-900">
          {complete ? "Application complete" : `Step ${displayStep} of ${total}`}
          <span className="font-medium text-grey-500">
            {" "}
            · {complete ? "Submitted" : activeMeta.label}
          </span>
        </p>
        <p className="hidden text-xs font-medium text-grey-400 sm:block">
          {complete ? "100%" : `${Math.round((displayStep / total) * 100)}%`}
        </p>
      </div>

      {/* Mobile compact bar */}
      <div className="sm:hidden">
        <div className="h-1.5 overflow-hidden rounded-full bg-grey-200">
          <div
            className="h-full rounded-full bg-primary-500 transition-all duration-300"
            style={{width: `${complete ? 100 : (displayStep / total) * 100}%`}}
          />
        </div>
      </div>

      {/* Desktop numbered stepper */}
      <ol className="hidden sm:flex sm:items-start">
        {WIZARD_STEPS.map((step, index) => {
          const meta = WIZARD_STEP_META[step];
          const isDone = complete || index < activeIndex;
          const isCurrent = !complete && index === activeIndex;

          return (
            <li key={step} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    index === 0 ? "bg-transparent" : isDone || isCurrent ? "bg-primary-500" : "bg-grey-200",
                  )}
                  style={index === 0 ? undefined : {width: undefined}}
                  aria-hidden
                />
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200",
                    isDone && "bg-primary-500 text-white",
                    isCurrent && "bg-primary-400 text-white ring-4 ring-primary-100/40",
                    !isDone && !isCurrent && "bg-grey-100 text-grey-500",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isDone ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    index === total - 1
                      ? "bg-transparent"
                      : isDone
                        ? "bg-primary-500"
                        : "bg-grey-200",
                  )}
                  aria-hidden
                />
              </div>
              <span
                className={cn(
                  "px-1 text-center text-[11px] font-semibold",
                  isCurrent || isDone ? "text-primary-900" : "text-grey-400",
                )}
              >
                {meta.shortLabel}
              </span>
            </li>
          );
        })}
      </ol>
      <span className="sr-only">
        {complete
          ? "All application steps complete"
          : `Step ${displayStep} of ${total}: ${activeMeta.label}. Progress ${Math.round(fillPercent)} percent.`}
      </span>
    </div>
  );
}
