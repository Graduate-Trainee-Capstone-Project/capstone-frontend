import {Spinner} from "@/app/_components/ui/Spinner";

/**
 * Screens 4-7 (Product-specific info, Document upload, Review, Confirmation)
 * are Justin's. Once currentStep advances past our scope, show this instead
 * of a blank screen so Screens 0-3 stay demoable end to end on their own.
 */
export function HandoffPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-grey-200 bg-white p-10 text-center">
      <Spinner size="lg" />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-grey-900">Continuing to product details...</h3>
        <p className="text-sm text-grey-600">
          Your progress has been saved. The next step of your application isn&apos;t built yet.
        </p>
      </div>
    </div>
  );
}
