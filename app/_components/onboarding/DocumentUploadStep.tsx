"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSaveDraft } from "@/app/_hooks";
import { useOnboardingStore } from "@/app/_hooks/useOnboardingStore";
import { Button } from "@/app/_ui/Button";
import { cn } from "@/app/_utils/cn";
import { documentsFromCache } from "@/app/_utils/formData";
import { PRODUCT_DOCUMENT_SLOTS, ROUTES, type DocumentSlotConfig } from "@/app/_constants";

/**
 * BE's /save accepts ONE real file per call (`documentType` + `documentFile`,
 * multipart/form-data) and REPLACES the stored Documents list wholesale —
 * there's no append, so each newly-saved document currently overwrites
 * whichever one was saved before it (a BE limitation, not something this
 * screen can work around; flagged separately). Each file is saved the
 * moment it's chosen rather than batched, since the BE can't accept more
 * than one per request anyway.
 */
export function DocumentUploadStep() {
  const router = useRouter();
  const draftId = useOnboardingStore((state) => state.draftId);
  const productCode = useOnboardingStore((state) => state.productCode);
  const cachedFormData = useOnboardingStore((state) => state.formData);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const resetStore = useOnboardingStore((state) => state.reset);
  const saveDraft = useSaveDraft(draftId ?? "");

  const documentSlots = productCode ? PRODUCT_DOCUMENT_SLOTS[productCode] : [];

  const [names, setNames] = useState<Record<string, string>>(() =>
    documentsFromCache(cachedFormData, documentSlots),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  function handleFileChange(slot: DocumentSlotConfig, file: File | null) {
    if (!file) return;
    setNames((prev) => ({ ...prev, [slot.key]: file.name }));
    setErrors((prev) => ({ ...prev, [slot.key]: "" }));
    patchFormData({ documents: [{ type: slot.label, url: file.name }] });
    saveDraft.mutate(
      { currentStep: "DOCUMENT_UPLOAD", channel: "WEB", documentType: slot.label, documentFile: file },
      { onError: (error) => toast.error(error.message || "Couldn't upload right now. Please try again.") },
    );
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const slot of documentSlots) {
      if (!names[slot.key]?.trim()) nextErrors[slot.key] = `${slot.label} is required.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveAndContinueLater() {
    saveDraft.mutate(
      { currentStep: "DOCUMENT_UPLOAD", channel: "WEB" },
      {
        onSuccess: () => {
          toast.success("Saved — come back anytime with your details to pick up where you left off.");
          resetStore();
          router.push(ROUTES.home);
        },
        onError: (error) => toast.error(error.message || "Couldn't save right now. Please try again."),
      },
    );
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    saveDraft.mutate(
      { currentStep: "REVIEW", channel: "WEB" },
      {
        onSuccess: (data) => setCurrentStep(data.currentStep),
        onError: (error) => toast.error(error.message || "Couldn't save right now. Please try again."),
      },
    );
  }

  return (
    <form onSubmit={handleContinue} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">Upload your documents</h2>
        <p className="text-sm text-grey-600">We need these to verify your application.</p>
      </div>

      <div className="flex flex-col gap-5">
        {documentSlots.map((slot) => (
          <div key={slot.key} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-grey-800">{slot.label}</span>
            <label
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed bg-grey-50 px-3.5 py-3 text-sm transition-colors duration-150 hover:bg-grey-100",
                errors[slot.key] ? "border-error-400" : "border-grey-300",
              )}
            >
              <span className={cn("truncate", names[slot.key] ? "text-grey-900" : "text-grey-500")}>
                {names[slot.key] || "Choose a file..."}
              </span>
              <span className="shrink-0 rounded-md border border-grey-300 bg-white px-2.5 py-1 text-xs font-medium text-grey-700">
                Browse
              </span>
              <input
                type="file"
                accept={slot.accept}
                className="hidden"
                onChange={(e) => handleFileChange(slot, e.target.files?.[0] ?? null)}
              />
            </label>
            {errors[slot.key] ? (
              <span className="text-xs text-error-400">{errors[slot.key]}</span>
            ) : (
              <span className="text-xs text-grey-500">{slot.helperText}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={handleSaveAndContinueLater}
          isLoading={saveDraft.isPending}
        >
          Save and continue later
        </Button>
        <Button type="submit" isLoading={saveDraft.isPending}>
          Continue
        </Button>
      </div>
    </form>
  );
}
