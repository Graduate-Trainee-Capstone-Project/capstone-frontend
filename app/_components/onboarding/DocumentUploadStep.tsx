"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Button} from "@/app/_ui/Button";
import {cn} from "@/app/_utils/cn";
import {documentsFromCache, toDocumentsPayload} from "@/app/_utils/formData";
import {debounce} from "@/app/_utils/debounce";
import {AUTOSAVE_DEBOUNCE_MS, PRODUCT_DOCUMENT_SLOTS, ROUTES, type DocumentSlotConfig} from "@/app/_constants";

/**
 * No real storage backend for the demo — only the filename is captured and
 * sent to /save as documents[]. Which slots render is data-driven off
 * PRODUCT_DOCUMENT_SLOTS.
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
  const namesRef = useRef(names);
  namesRef.current = names;

  const debouncedAutosaveRef = useRef<() => void>(() => {});
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      if (!draftId) return;
      const payload = toDocumentsPayload(namesRef.current, documentSlots);
      patchFormData(payload);
      saveDraft.mutate({currentStep: "DOCUMENT_UPLOAD", formData: payload, channel: "WEB"});
    }, AUTOSAVE_DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId, productCode]);

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  function handleFileChange(key: DocumentSlotConfig["key"], file: File | null) {
    const name = file?.name ?? "";
    setNames((prev) => ({...prev, [key]: name}));
    setErrors((prev) => ({...prev, [key]: ""}));
    if (name) debouncedAutosaveRef.current();
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const slot of documentSlots) {
      if (!names[slot.key]?.trim()) nextErrors[slot.key] = `${slot.label} is required.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function saveDocuments(nextStep: "DOCUMENT_UPLOAD" | "REVIEW", onSuccess: (currentStep: typeof nextStep) => void) {
    const payload = toDocumentsPayload(names, documentSlots);
    patchFormData(payload);
    saveDraft.mutate(
      {currentStep: nextStep, formData: payload, channel: "WEB"},
      {
        onSuccess: (data) => onSuccess(data.currentStep as typeof nextStep),
        onError: (error) => toast.error(error.message || "Couldn't save right now. Please try again."),
      },
    );
  }

  function handleSaveAndContinueLater() {
    saveDocuments("DOCUMENT_UPLOAD", () => {
      toast.success("Saved — come back anytime with your details to pick up where you left off.");
      resetStore();
      router.push(ROUTES.home);
    });
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    saveDocuments("REVIEW", (currentStep) => {
      setCurrentStep(currentStep);
    });
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
                onChange={(e) => handleFileChange(slot.key, e.target.files?.[0] ?? null)}
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
