import type {DraftStep} from "@/app/_types";

/** Data-entry order after identifier capture. Security is not a Back target. */
export const WIZARD_STEPS: DraftStep[] = [
  "IDENTIFIER_CAPTURE",
  "PERSONAL_INFO",
  "PRODUCT_SPECIFIC_INFO",
  "DOCUMENT_UPLOAD",
  "REVIEW",
];

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
