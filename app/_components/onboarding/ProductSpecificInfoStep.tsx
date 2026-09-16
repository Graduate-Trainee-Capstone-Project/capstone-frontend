"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useProduct, useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Input} from "@/app/_ui/Input";
import {Select} from "@/app/_ui/Select";
import {Checkbox} from "@/app/_ui/Checkbox";
import {Button} from "@/app/_ui/Button";
import {Skeleton} from "@/app/_ui/Skeleton";
import {debounce} from "@/app/_utils/debounce";
import {readSchemaField, toBackendProductFormData} from "@/app/_utils/formData";
import {AUTOSAVE_DEBOUNCE_MS, ROUTES} from "@/app/_constants";
import type {AdditionalField} from "@/app/_types";

function initialValueFor(field: AdditionalField, cached: unknown): string | boolean {
  if (field.type === "checkbox") return typeof cached === "boolean" ? cached : false;
  return typeof cached === "string" || typeof cached === "number" ? String(cached) : "";
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
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const resetStore = useOnboardingStore((state) => state.reset);

  const {data: product, isLoading, isError} = useProduct(productCode ?? undefined);
  const saveDraft = useSaveDraft(draftId ?? "");

  const schema = product?.additionalFieldsSchema ?? [];

  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pendingChangesRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const fields = product?.additionalFieldsSchema;
    if (!fields?.length) return;
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

  const debouncedAutosaveRef = useRef<() => void>(() => {});
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      const changes = pendingChangesRef.current;
      if (Object.keys(changes).length === 0 || !draftId) return;
      pendingChangesRef.current = {};
      patchFormData(changes);
      saveDraft.mutate({
        currentStep: "PRODUCT_SPECIFIC_INFO",
        formData: toBackendProductFormData(changes),
        channel: "WEB",
      });
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
    pendingChangesRef.current = {...pendingChangesRef.current, [field]: value};
  }

  function handleBlur() {
    debouncedAutosaveRef.current();
  }

  function flushPendingChangesNow(): Record<string, unknown> {
    const changes = pendingChangesRef.current;
    pendingChangesRef.current = {};
    if (Object.keys(changes).length > 0) patchFormData(changes);
    return changes;
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of schema) {
      if (!field.required) continue;
      const value = values[field.field];
      const isEmpty = field.type === "checkbox" ? value !== true : !String(value ?? "").trim();
      if (isEmpty) nextErrors[field.field] = `${field.label} is required.`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveAndContinueLater() {
    const changes = flushPendingChangesNow();
    saveDraft.mutate(
      {
        currentStep: "PRODUCT_SPECIFIC_INFO",
        formData: toBackendProductFormData(changes),
        channel: "WEB",
      },
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

    const changes = flushPendingChangesNow();
    patchFormData(values);
    saveDraft.mutate(
      {
        currentStep: "DOCUMENT_UPLOAD",
        formData: toBackendProductFormData({...values, ...changes}),
        channel: "WEB",
      },
      {
        onSuccess: (data) => setCurrentStep(data.currentStep),
        onError: (error) => toast.error(error.message || "Couldn't save right now. Please try again."),
      },
    );
  }

  return (
    <form onSubmit={handleContinue} className="flex flex-col gap-6" onBlur={handleBlur}>
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
