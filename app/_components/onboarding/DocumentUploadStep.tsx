"use client";

import {useRef, useState} from "react";
import toast from "react-hot-toast";
import {useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Button} from "@/app/_components/ui/Button";
import {cn} from "@/app/_utils/cn";

interface DocumentSlot {
  key: "idDocumentName" | "passportPhotoName";
  label: string;
  helperText: string;
  accept: string;
}

const DOCUMENT_SLOTS: DocumentSlot[] = [
  {
    key: "idDocumentName",
    label: "Government-issued ID",
    helperText: "A clear photo or scan of your ID, passport, or driver's licence.",
    accept: "image/*,.pdf",
  },
  {
    key: "passportPhotoName",
    label: "Passport photograph",
    helperText: "A recent, plain-background passport photo.",
    accept: "image/*",
  },
];

/**
 * No real storage backend for the demo — only the filename is captured and
 * sent to /save, standing in for an uploaded document reference.
 */
export function DocumentUploadStep() {
  const draftId = useOnboardingStore((state) => state.draftId);
  const cachedFormData = useOnboardingStore((state) => state.formData);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const saveDraft = useSaveDraft(draftId ?? "");

  const [names, setNames] = useState<Record<string, string>>(() => ({
    idDocumentName: typeof cachedFormData.idDocumentName === "string" ? cachedFormData.idDocumentName : "",
    passportPhotoName:
      typeof cachedFormData.passportPhotoName === "string" ? cachedFormData.passportPhotoName : "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pendingChangesRef = useRef<Record<string, unknown>>({});

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  function handleFileChange(key: DocumentSlot["key"], file: File | null) {
    const name = file?.name ?? "";
    setNames((prev) => ({...prev, [key]: name}));
    setErrors((prev) => ({...prev, [key]: ""}));
    if (name) pendingChangesRef.current = {...pendingChangesRef.current, [key]: name};
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const slot of DOCUMENT_SLOTS) {
      if (!names[slot.key]?.trim()) nextErrors[slot.key] = `${slot.label} is required.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const changes = pendingChangesRef.current;
    pendingChangesRef.current = {};
    if (Object.keys(changes).length > 0) patchFormData(changes);

    saveDraft.mutate(
      {currentStep: "REVIEW", formData: changes, channel: "WEB"},
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
        {DOCUMENT_SLOTS.map((slot) => (
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

      <div className="flex justify-end">
        <Button type="submit" isLoading={saveDraft.isPending}>
          Continue
        </Button>
      </div>
    </form>
  );
}
