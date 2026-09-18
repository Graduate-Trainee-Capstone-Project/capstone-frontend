"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ApiRequestError, useProduct, useStartApplication } from "@/app/_hooks";
import { saveDraftAction } from "@/app/_lib/actions";
import { useOnboardingStore } from "@/app/_hooks/useOnboardingStore";
import { IdentifierField } from "@/app/_components/onboarding/IdentifierField";
import { ExistingCustomerBanner } from "@/app/_components/onboarding/ExistingCustomerBanner";
import { Button } from "@/app/_ui/Button";
import { Skeleton } from "@/app/_ui/Skeleton";
import { normalizePhone, validateIdentifier } from "@/app/_utils/validators";
import type { DraftStep, ExistingCustomerData, IdentifierType, ProductCode, SaveDraftRequest } from "@/app/_types";

interface IdentifierCaptureStepProps {
  productCode: ProductCode;
}

/**
 * existingCustomer is only ever returned ONCE, at the moment /start first
 * matches a customer for a new product — it's never re-sent on resume. If
 * the user abandons before PersonalInfoStep saves anything, that profile
 * data would otherwise be gone for good on a later resume. Persisting it
 * into the draft immediately (still on SECURITY_VERIFICATION) makes it
 * durable, so a resumed draft's own formData carries it forward instead.
 */
function toExistingCustomerSavePayload(existing: ExistingCustomerData, currentStep: DraftStep): SaveDraftRequest {
  return {
    currentStep,
    channel: "WEB",
    firstName: existing.firstName || undefined,
    middleName: existing.middleName || undefined,
    lastName: existing.lastName || undefined,
    dateOfBirth: existing.dateOfBirth || undefined,
    gender: existing.gender || undefined,
    phoneNumber: existing.phoneNumber || undefined,
    email: existing.email || undefined,
    street: existing.address || undefined,
  };
}

export function IdentifierCaptureStep({ productCode }: IdentifierCaptureStepProps) {
  const { data: product, isLoading, isError } = useProduct(productCode);
  const startApplication = useStartApplication();
  const setFromStartResponse = useOnboardingStore((state) => state.setFromStartResponse);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const requiredIdentifiers = product.requiredIdentifiers;
  const [primaryType, secondaryType] = requiredIdentifiers;

  function handleChange(type: IdentifierType, value: string) {
    setValues((prev) => ({ ...prev, [type]: value }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
  }

  function normalize(type: IdentifierType, value: string): string {
    return type === "PHONE" ? normalizePhone(value) : value.trim();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    for (const type of requiredIdentifiers) {
      const result = validateIdentifier(type, values[type] ?? "");
      if (!result.valid) nextErrors[type] = result.message ?? "Invalid value.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const primaryIdentifierValue = normalize(primaryType, values[primaryType]);
    const secondaryIdentifierValue = secondaryType ? normalize(secondaryType, values[secondaryType]) : undefined;

    startApplication.mutate(
      {
        productCode,
        primaryIdentifierValue,
        secondaryIdentifierValue,
        channel: "WEB",
      },
      {
        onSuccess: (data) => {
          setFromStartResponse(data, productCode);

          if (data.isResumed) {
            toast.success("Welcome back — resuming your application.");
          } else if (data.isExistingCustomer) {
            toast("We found an existing profile — a quick verification is needed.");
          }

          // Fire-and-forget: persist existingCustomer's prefill into the
          // draft now, while we still have it — see toExistingCustomerSavePayload.
          if (data.existingCustomer) {
            void saveDraftAction(data.draftId, toExistingCustomerSavePayload(data.existingCustomer, data.currentStep));
          }
        },
        onError: (error) => {
          if (error instanceof ApiRequestError && error.code === "VALIDATION_ERROR" && error.field) {
            const fieldType = error.field === "secondaryIdentifierValue" ? secondaryType : primaryType;
            if (fieldType) {
              setErrors((prev) => ({ ...prev, [fieldType]: error.message }));
              return;
            }
          }
          toast.error(error.message || "Something went wrong. Please try again.");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <ExistingCustomerBanner
        identifierType={primaryType ?? "BVN"}
        onPrefilled={patchFormData}
      />

      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">{product.productName}</h2>
        <p className="text-sm text-grey-600">
          Tell us a little about yourself so we can check whether you already have a profile with us.
        </p>
      </div>

      {requiredIdentifiers.map((type) => (
        <IdentifierField
          key={type}
          type={type}
          value={values[type] ?? ""}
          onChange={(value) => handleChange(type, value)}
          error={errors[type]}
          disabled={startApplication.isPending}
        />
      ))}

      <Button type="submit" isLoading={startApplication.isPending} fullWidth>
        Continue
      </Button>
    </form>
  );
}
