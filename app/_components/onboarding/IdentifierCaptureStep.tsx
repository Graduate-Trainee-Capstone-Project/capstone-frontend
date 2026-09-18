"use client";

import {useState} from "react";
import toast from "react-hot-toast";
import {ApiRequestError, useProduct, useStartApplication} from "@/app/_hooks";
import {saveDraftAction} from "@/app/_lib/actions";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {IdentifierField} from "@/app/_components/onboarding/IdentifierField";
import {Button} from "@/app/_ui/Button";
import {Skeleton} from "@/app/_ui/Skeleton";
import {normalizePhone, validateIdentifier} from "@/app/_utils/validators";
import {hasCompletedProduct} from "@/app/_utils/completedProducts";
import {rememberBvn} from "@/app/_utils/knownBvn";
import {lookupMockBvnBioData} from "@/app/_utils/mockBvnDirectory";
import {productDisplayName} from "@/app/_constants";
import type {DraftFormData, DraftStep, ExistingCustomerData, IdentifierType, ProductCode, SaveDraftRequest} from "@/app/_types";

interface IdentifierCaptureStepProps {
  productCode: ProductCode;
}

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

export function IdentifierCaptureStep({productCode}: IdentifierCaptureStepProps) {
  const {data: product, isLoading, isError} = useProduct(productCode);
  const startApplication = useStartApplication();
  const setFromStartResponse = useOnboardingStore((state) => state.setFromStartResponse);
  const setPrimaryIdentifierValue = useOnboardingStore((state) => state.setPrimaryIdentifierValue);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const setPendingBvnPrefill = useOnboardingStore((state) => state.setPendingBvnPrefill);

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
  const productName = productDisplayName(productCode, product.productName);

  function handleChange(type: IdentifierType, value: string) {
    setValues((prev) => ({...prev, [type]: value}));
    setErrors((prev) => ({...prev, [type]: ""}));
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
    const secondaryIdentifierValue = secondaryType
      ? normalize(secondaryType, values[secondaryType])
      : undefined;

    if (values.BVN) rememberBvn(values.BVN);

    if (hasCompletedProduct(primaryIdentifierValue, productCode)) {
      toast.error(`Dear customer, you already have a ${productName} account with us.`);
      return;
    }

    setPrimaryIdentifierValue(primaryIdentifierValue);

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

          if (values.BVN && !data.existingCustomer) {
            const bvnBioData = lookupMockBvnBioData(values.BVN);
            if (bvnBioData) setPendingBvnPrefill(bvnBioData);
          }

          const identifierPrefill: Partial<DraftFormData> = {};
          if (values.EMAIL) identifierPrefill.email = normalize("EMAIL", values.EMAIL);
          if (values.PHONE) identifierPrefill.phoneNumber = normalize("PHONE", values.PHONE);
          if (Object.keys(identifierPrefill).length > 0) {
            patchFormData(identifierPrefill);
          }

          if (data.isResumed) {
            toast.success("Welcome back — resuming your application.");
          } else if (data.isExistingCustomer) {
            toast.success(
              `We found your existing Stanbic IBTC profile. We'll use it to fast-track this ${productName} application — a quick verification is next.`,
            );
          }

          if (data.existingCustomer) {
            void saveDraftAction(data.draftId, {
              ...toExistingCustomerSavePayload(data.existingCustomer, data.currentStep),
              ...identifierPrefill,
            });
          } else if (identifierPrefill.email || identifierPrefill.phoneNumber) {
            void saveDraftAction(data.draftId, {
              currentStep: data.currentStep,
              channel: "WEB",
              ...identifierPrefill,
            });
          }
        },
        onError: (error) => {
          if (error instanceof ApiRequestError && error.code === "VALIDATION_ERROR" && error.field) {
            const fieldType = error.field === "secondaryIdentifierValue" ? secondaryType : primaryType;
            if (fieldType) {
              setErrors((prev) => ({...prev, [fieldType]: error.message}));
              return;
            }
          }
          toast.error(error.message || "Something went wrong. Please try again.");
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-grey-900">{productName}</h2>
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
    </div>
  );
}
