"use client";

import {useState} from "react";
import toast from "react-hot-toast";
import {useFinalizeApplication, useProduct, useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Checkbox} from "@/app/_ui/Checkbox";
import {Skeleton} from "@/app/_ui/Skeleton";
import {PRODUCT_DOCUMENT_SLOTS, additionalFieldsFor} from "@/app/_constants";
import {readSchemaField} from "@/app/_utils/formData";
import {previousWizardStep} from "@/app/_utils/wizard";
import {recordCompletedProduct} from "@/app/_utils/completedProducts";
import {ALREADY_COMPLETED_MESSAGE, isAlreadyCompletedMessage} from "@/app/_utils/applicationCopy";
import {WizardStepActions} from "@/app/_components/onboarding/WizardStepActions";
import type {DraftDocument} from "@/app/_types";

interface SummaryRow {
  label: string;
  value: string;
}

const PERSONAL_LABELS: Record<string, string> = {
  firstName: "First name",
  middleName: "Middle name",
  lastName: "Last name",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  email: "Email address",
  phoneNumber: "Phone number",
  nationality: "Nationality",
};

function rowsFrom(record: Record<string, string>, formData: Record<string, unknown>): SummaryRow[] {
  return Object.entries(record)
    .map(([key, label]) => ({label, value: String(formData[key] ?? "").trim()}))
    .filter((row) => row.value.length > 0);
}

function SummaryList({title, rows}: {title: string; rows: SummaryRow[]}) {
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-grey-800">{title}</h3>
      <dl className="flex flex-col divide-y divide-grey-100 rounded-lg border border-grey-200">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
            <dt className="text-sm text-grey-500">{row.label}</dt>
            <dd className="text-sm font-medium text-grey-900 text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Read-only recap of everything captured across Screens 3-5, generic over
 * whichever additionalFieldsSchema fields this product collected — no
 * per-product rendering branches.
 */
export function ReviewStep() {
  const productCode = useOnboardingStore((state) => state.productCode);
  const draftId = useOnboardingStore((state) => state.draftId);
  const isExistingCustomer = useOnboardingStore((state) => state.isExistingCustomer);
  const formData = useOnboardingStore((state) => state.formData);
  const primaryIdentifierValue = useOnboardingStore((state) => state.primaryIdentifierValue);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const setFinalizeResult = useOnboardingStore((state) => state.setFinalizeResult);

  const {data: product, isLoading} = useProduct(productCode ?? undefined);
  const finalizeApplication = useFinalizeApplication(draftId ?? "");
  const saveDraft = useSaveDraft(draftId ?? "");

  const [consented, setConsented] = useState(false);
  const [consentError, setConsentError] = useState("");

  if (!draftId) {
    return <p className="text-sm text-error-400">Your session expired. Please start again.</p>;
  }

  const personalRows = rowsFrom(PERSONAL_LABELS, formData);
  const addressRows = rowsFrom(
    {houseNumber: "House number", street: "Street", city: "City", state: "State"},
    (formData.address?.[0] as unknown as Record<string, unknown>) ?? {},
  );
  const productRows: SummaryRow[] = additionalFieldsFor(product)
    .map((field) => {
      const raw = readSchemaField(formData, field.field);
      if (raw === undefined || raw === null || raw === "") return null;
      const value = typeof raw === "boolean" ? (raw ? "Yes" : "No") : String(raw);
      return {label: field.label, value};
    })
    .filter((row): row is SummaryRow => row !== null);
  const documents = Array.isArray(formData.documents) ? (formData.documents as DraftDocument[]) : [];
  const documentRows: SummaryRow[] =
    documents.length > 0
      ? documents
          .filter((doc) => doc.type && doc.url)
          .map((doc) => ({label: String(doc.type), value: String(doc.url)}))
      : rowsFrom(
          Object.fromEntries((productCode ? PRODUCT_DOCUMENT_SLOTS[productCode] : []).map((slot) => [slot.key, slot.label])),
          formData,
        );

  const consentCopy = isExistingCustomer
    ? "I consent to Stanbic IBTC using my verified details for this application and reusing my previously verified KYC information."
    : "I consent to Stanbic IBTC using my verified details for this application.";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consented) {
      setConsentError("Please confirm your consent to continue.");
      return;
    }

    finalizeApplication.mutate(undefined, {
      onSuccess: (data) => {
        if (primaryIdentifierValue && productCode) {
          recordCompletedProduct(primaryIdentifierValue, productCode);
        }
        setFinalizeResult(data);
        setCurrentStep("SUBMITTED");
      },
      onError: (error) => {
        if (isAlreadyCompletedMessage(error.message)) {
          toast(ALREADY_COMPLETED_MESSAGE);
          setCurrentStep("SUBMITTED");
          return;
        }
        toast.error(error.message || "Couldn't submit your application. Please try again.");
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">Review your application</h2>
        <p className="text-sm text-grey-600">
          Make sure everything below looks right before you submit{product ? ` for ${product.productName}` : ""}.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <SummaryList title="Personal information" rows={personalRows} />
          <SummaryList title="Address" rows={addressRows} />
          <SummaryList title="Product details" rows={productRows} />
          <SummaryList title="Documents" rows={documentRows} />
        </div>
      )}

      <div className="flex flex-col gap-1 border-t border-grey-100 pt-5">
        <Checkbox
          label={consentCopy}
          checked={consented}
          onChange={(e) => {
            setConsented(e.target.checked);
            if (e.target.checked) setConsentError("");
          }}
          error={consentError}
        />
      </div>

      <WizardStepActions
        onBack={() => {
          const previous = previousWizardStep("REVIEW", isExistingCustomer);
          if (!previous || !draftId) return;
          saveDraft.mutate(
            {currentStep: previous, channel: "WEB"},
            {
              onSuccess: (data) => setCurrentStep(data.currentStep),
              onError: (error) =>
                toast.error(error.message || "Couldn't go back right now. Please try again."),
            },
          );
        }}
        continueLabel="Submit application"
        isLoading={finalizeApplication.isPending || saveDraft.isPending}
      />
    </form>
  );
}
