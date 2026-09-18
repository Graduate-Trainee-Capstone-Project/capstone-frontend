"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useProduct, useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Input} from "@/app/_ui/Input";
import {Select} from "@/app/_ui/Select";
import {Checkbox} from "@/app/_ui/Checkbox";
import {Skeleton} from "@/app/_ui/Skeleton";
import {debounce} from "@/app/_utils/debounce";
import {readSchemaField, toBackendProductFormData} from "@/app/_utils/formData";
import {previousWizardStep} from "@/app/_utils/wizard";
import {validateIdentifier} from "@/app/_utils/validators";
import {rememberBvn, rememberedBvn} from "@/app/_utils/knownBvn";
import {AUTOSAVE_DEBOUNCE_MS, additionalFieldsFor, ROUTES} from "@/app/_constants";
import {stanbicIBTCBranches} from "@/app/_constants/stanbic_ibtc_branches";
import type {AdditionalField, DraftStep, SaveDraftRequest} from "@/app/_types";
import {WizardStepActions} from "@/app/_components/onboarding/WizardStepActions";
import {IdentifierField} from "@/app/_components/onboarding/IdentifierField";

function initialValueFor(field: AdditionalField, cached: unknown): string | boolean {
  if (field.field === "bvn") {
    if (typeof cached === "string" && cached.trim()) return cached.trim();
    return rememberedBvn();
  }
  if (field.type === "checkbox") return typeof cached === "boolean" ? cached : false;
  return typeof cached === "string" || typeof cached === "number" ? String(cached) : "";
}

/**
 * BE's flat SaveDraftRequest only recognizes preferredBranch/checkBookRequested
 * from this screen (mapped by toBackendProductFormData); other schema fields
 * (title, employerName, ...) ride along as harmless extra form fields the BE
 * form binder ignores — see B4 in the briefing.
 */
function toSavePayload(values: Record<string, string | boolean>, currentStep: DraftStep): SaveDraftRequest {
  const bvn = typeof values.bvn === "string" ? values.bvn.trim() : "";
  if (bvn) rememberBvn(bvn);
  return {
    currentStep,
    channel: "WEB",
    ...toBackendProductFormData(values),
  };
}

/**
 * Generic form-builder driven entirely by product.additionalFieldsSchema —
 * "Pension asks for employer + contribution scheme" vs "Savings asks for
 * branch preference" is data, not a switch on productCode.
 */
export function ProductSpecificInfoStep() {
  const router = useRouter();
  const productCode = useOnboardingStore((state) => state.productCode);
  const draftId = useOnboardingStore((state) => state.draftId);
  const cachedFormData = useOnboardingStore((state) => state.formData);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const isExistingCustomer = useOnboardingStore((state) => state.isExistingCustomer);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const resetStore = useOnboardingStore((state) => state.reset);

  const {data: product, isLoading, isError} = useProduct(productCode ?? undefined);
  const saveDraft = useSaveDraft(draftId ?? "");

  const schema = additionalFieldsFor(product);

  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mirrors `values` so the debounced autosave closure always reads the
  // LATEST fields rather than whatever was current when it was created.
  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    const fields = additionalFieldsFor(product);
    if (!fields.length) return;
    setValues((prev) => {
      const next = {...prev};
      for (const field of fields) {
        if (next[field.field] === undefined) {
          next[field.field] = initialValueFor(field, readSchemaField(cachedFormData, field.field));
        }
      }
      return next;
    });
  }, [product, cachedFormData]);

  // Set once Continue / Save-and-continue-later has fired its own save —
  // guards the debounce, not just cancels it once: a submit button stays
  // focused after being clicked, and unmounting this form right after a
  // successful transition fires a FRESH blur on it, re-arming the debounce
  // AFTER the explicit cancel() below already ran. See the matching comment
  // in PersonalInfoStep for the full failure mode this prevents.
  const committedRef = useRef(false);

  // Always sends the FULL current snapshot, never a delta — consistent with
  // PersonalInfoStep, and avoids ever depending on BE's per-field merge for
  // fields it may not even recognize.
  const debouncedAutosaveRef = useRef<(() => void) & {cancel?: () => void}>(() => {});
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      if (!draftId || committedRef.current) return;
      const snapshot = valuesRef.current;
      patchFormData(snapshot);
      saveDraft.mutate(toSavePayload(snapshot, "PRODUCT_SPECIFIC_INFO"));
    }, AUTOSAVE_DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-32" />
      </div>
    );
  }

  if (isError || !product) {
    return <p className="text-sm text-error-400">We couldn&apos;t load this product. Please go back and try again.</p>;
  }

  function updateField(field: string, value: string | boolean) {
    setValues((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, [field]: ""}));
  }

  function handleBlur() {
    debouncedAutosaveRef.current();
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of schema) {
      if (field.field === "bvn") {
        const result = validateIdentifier("BVN", String(values.bvn ?? ""));
        if (!result.valid) nextErrors.bvn = result.message ?? "Enter a valid BVN.";
        continue;
      }
      if (!field.required) continue;
      const value = values[field.field];
      const isEmpty = field.type === "checkbox" ? value !== true : !String(value ?? "").trim();
      if (isEmpty) nextErrors[field.field] = `${field.label} is required.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function persist(step: DraftStep, onSuccess?: (currentStep: DraftStep) => void) {
    committedRef.current = true;
    debouncedAutosaveRef.current.cancel?.();
    patchFormData(values);
    saveDraft.mutate(toSavePayload(values, step), {
      onSuccess: (data) => onSuccess?.(data.currentStep),
      onError: (error) => {
        committedRef.current = false;
        toast.error(error.message || "Couldn't save right now. Please try again.");
      },
    });
  }

  function handleSaveAndContinueLater() {
    persist("PRODUCT_SPECIFIC_INFO", () => {
      toast.success("Saved — come back anytime with your details to pick up where you left off.");
      resetStore();
      router.push(ROUTES.home);
    });
  }

  function handleBack() {
    const previous = previousWizardStep("PRODUCT_SPECIFIC_INFO", isExistingCustomer);
    if (!previous) return;
    persist(previous, (step) => setCurrentStep(step));
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    persist("DOCUMENT_UPLOAD", (step) => setCurrentStep(step));
  }

  return (
    <form onSubmit={handleContinue} method="post" className="flex flex-col gap-6" onBlur={handleBlur}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">{product.productName} details</h2>
        <p className="text-sm text-grey-600">A few extra details specific to this product.</p>
      </div>

      {schema.length === 0 ? (
        <p className="text-sm text-grey-600">Nothing else is needed for this product — you&apos;re all set.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {schema.map((field) => {
            if (field.type === "checkbox") {
              return (
                <div key={field.field} className="sm:col-span-2">
                  <Checkbox
                    label={field.label}
                    name={field.field}
                    checked={Boolean(values[field.field])}
                    onChange={(e) => updateField(field.field, e.target.checked)}
                  />
                  {errors[field.field] && (
                    <span className="text-xs text-error-400">{errors[field.field]}</span>
                  )}
                </div>
              );
            }

            if (field.field === "bvn") {
              return (
                <div key={field.field} className="sm:col-span-2">
                  <IdentifierField
                    type="BVN"
                    name="bvn"
                    value={String(values.bvn ?? "")}
                    onChange={(value) => updateField("bvn", value)}
                    error={errors.bvn}
                    required={field.required}
                    helperText="We'll keep this on your profile so we can open a Stanbic IBTC bank account for settlement if you don't already have one."
                  />
                </div>
              );
            }

            if (field.field === "branchPreference") {
              return (
                <Select
                  key={field.field}
                  label={field.label}
                  name={field.field}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  options={stanbicIBTCBranches.map((branch) => ({
                    value: branch.value,
                    label: `${branch.label} (${branch.city})`,
                  }))}
                  value={String(values[field.field] ?? "")}
                  onChange={(e) => updateField(field.field, e.target.value)}
                  error={errors[field.field]}
                  required={field.required}
                />
              );
            }

            if (field.type === "select") {
              return (
                <Select
                  key={field.field}
                  label={field.label}
                  name={field.field}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  options={(field.options ?? []).map((option) => ({value: option, label: option}))}
                  value={String(values[field.field] ?? "")}
                  onChange={(e) => updateField(field.field, e.target.value)}
                  error={errors[field.field]}
                  required={field.required}
                />
              );
            }

            return (
              <Input
                key={field.field}
                label={field.label}
                name={field.field}
                type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                value={String(values[field.field] ?? "")}
                onChange={(e) => updateField(field.field, e.target.value)}
                error={errors[field.field]}
                required={field.required}
              />
            );
          })}
        </div>
      )}

      <WizardStepActions
        onBack={handleBack}
        onSaveLater={handleSaveAndContinueLater}
        isLoading={saveDraft.isPending}
      />
    </form>
  );
}
