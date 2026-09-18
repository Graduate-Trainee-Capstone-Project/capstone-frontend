import type {DraftStep} from "@/app/_types";

/** Data-entry order after identifier capture. Security is not a Back target. */
export const WIZARD_STEPS = [
  "IDENTIFIER_CAPTURE",
  "PERSONAL_INFO",
  "PRODUCT_SPECIFIC_INFO",
  "DOCUMENT_UPLOAD",
  "REVIEW",
] as const;

export type WizardDataStep = (typeof WIZARD_STEPS)[number];

export const WIZARD_STEP_META: Record<WizardDataStep, {label: string; shortLabel: string}> = {
  IDENTIFIER_CAPTURE: {label: "Identity", shortLabel: "Identity"},
  PERSONAL_INFO: {label: "Personal details", shortLabel: "Personal"},
  PRODUCT_SPECIFIC_INFO: {label: "Product details", shortLabel: "Product"},
  DOCUMENT_UPLOAD: {label: "Documents", shortLabel: "Documents"},
  REVIEW: {label: "Review", shortLabel: "Review"},
};

/** 0-based index into WIZARD_STEPS. Security stays on Identity so the bar does not jump. */
export function wizardStepIndex(current: DraftStep | null): number {
  if (!current || current === "SECURITY_VERIFICATION" || current === "IDENTITY_CHECK") return 0;
  if (current === "SUBMITTED") return WIZARD_STEPS.length - 1;
  const index = (WIZARD_STEPS as readonly DraftStep[]).indexOf(current);
  return index === -1 ? 0 : index;
}

export function isWizardComplete(current: DraftStep | null): boolean {
  return current === "SUBMITTED";
}

/**
 * Previous step for the Back control. Existing customers skip
 * SECURITY_VERIFICATION on the way back (already passed) and have no
 * earlier data step from personal info.
 */
export function previousWizardStep(
  current: DraftStep,
  isExistingCustomer: boolean,
): DraftStep | null {
  if (current === "PERSONAL_INFO") {
    return isExistingCustomer ? null : "IDENTIFIER_CAPTURE";
  }

  const dataOrder: DraftStep[] = [
    "PERSONAL_INFO",
    "PRODUCT_SPECIFIC_INFO",
    "DOCUMENT_UPLOAD",
    "REVIEW",
  ];
  const index = dataOrder.indexOf(current);
  if (index <= 0) return null;
  return dataOrder[index - 1] ?? null;
}
