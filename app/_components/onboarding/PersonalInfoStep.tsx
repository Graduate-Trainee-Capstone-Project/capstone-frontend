"use client";

import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useSaveDraft} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {Input} from "@/app/_ui/Input";
import {Select} from "@/app/_ui/Select";
import {Button} from "@/app/_ui/Button";
import {debounce} from "@/app/_utils/debounce";
import {isRequired} from "@/app/_utils/validators";
import {AUTOSAVE_DEBOUNCE_MS, ROUTES} from "@/app/_constants";
import type {DraftFormData, DraftStep, SaveDraftRequest} from "@/app/_types";

interface PersonalInfoFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: {street: string; city: string; state: string};
  nextOfKin: {fullName: string; relationship: string; phone: string};
}

const GENDER_OPTIONS = [
  {value: "MALE", label: "Male"},
  {value: "FEMALE", label: "Female"},
];

function buildInitialFormData(cached: DraftFormData): PersonalInfoFormData {
  // BE's address is AddressInfo[]; the form only ever edits one entry.
  const address = cached.address?.[0] ?? {};
  const nextOfKin = cached.nextOfKin ?? {};

  return {
    firstName: cached.firstName ?? "",
    middleName: cached.middleName ?? "",
    lastName: cached.lastName ?? "",
    dateOfBirth: cached.dateOfBirth ?? "",
    gender: cached.gender ?? "",
    address: {street: address.street ?? "", city: address.city ?? "", state: address.state ?? ""},
    nextOfKin: {
      fullName: nextOfKin.fullName ?? "",
      relationship: nextOfKin.relationship ?? "",
      phone: nextOfKin.phone ?? "",
    },
  };
}

/**
 * The Zustand store still holds the GET-shaped, nested DraftFormData (for
 * cross-step prefill/display) — separate from the flat multipart payload BE
 * actually accepts on save. nextOfKin has no BE column at all, so it's
 * dropped here rather than invented as non-standard form fields.
 */
function toStorePatch(formData: PersonalInfoFormData): Partial<DraftFormData> {
  return {
    firstName: formData.firstName || undefined,
    middleName: formData.middleName || undefined,
    lastName: formData.lastName || undefined,
    dateOfBirth: formData.dateOfBirth || undefined,
    gender: formData.gender || undefined,
    address: [{street: formData.address.street, city: formData.address.city, state: formData.address.state}],
    nextOfKin: formData.nextOfKin,
    nationality: "Nigerian",
  };
}

/** BE's actual multipart/form-data SaveDraftRequest — flat, no nested `formData`. */
function toSavePayload(formData: PersonalInfoFormData, currentStep: DraftStep): SaveDraftRequest {
  return {
    currentStep,
    channel: "WEB",
    firstName: formData.firstName || undefined,
    middleName: formData.middleName || undefined,
    lastName: formData.lastName || undefined,
    dateOfBirth: formData.dateOfBirth || undefined,
    gender: formData.gender || undefined,
    street: formData.address.street || undefined,
    city: formData.address.city || undefined,
    state: formData.address.state || undefined,
    nationality: "Nigerian",
  };
}

const REQUIRED_FIELDS: Array<keyof PersonalInfoFormData> = ["firstName", "lastName", "dateOfBirth", "gender"];

export function PersonalInfoStep() {
  const router = useRouter();
  const draftId = useOnboardingStore((state) => state.draftId);
  const cachedFormData = useOnboardingStore((state) => state.formData);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const resetStore = useOnboardingStore((state) => state.reset);
  const saveDraft = useSaveDraft(draftId ?? "");

  const [formData, setFormData] = useState<PersonalInfoFormData>(() => buildInitialFormData(cachedFormData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mirrors `formData` so the debounced autosave closure (built once per
  // draftId in the effect below) always reads the LATEST values rather than
  // whatever was current when the closure was created.
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Set once Continue / Save-and-continue-later has fired its own save —
  // guards the debounce, not just cancels it once: clicking a submit button
  // leaves it focused, and React unmounting this form right after a
  // successful transition fires a FRESH blur on it, re-arming the debounce
  // AFTER the explicit cancel() below already ran. That stale timer would
  // otherwise fire ~800ms later with old data and currentStep: "PERSONAL_INFO",
  // which useSaveDraft's cache merge + ApplyProductClient's reactive
  // setCurrentStep would use to silently revert the just-completed transition.
  const committedRef = useRef(false);

  // Always sends the FULL current snapshot, never a delta — BE replaces
  // Address wholesale whenever `street` is present (it isn't merged
  // per-sub-field), so a partial save would risk dropping previously-saved
  // city/state.
  const debouncedAutosaveRef = useRef<(() => void) & {cancel?: () => void}>(() => {});
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      if (!draftId || committedRef.current) return;
      const snapshot = formDataRef.current;
      patchFormData(toStorePatch(snapshot));
      saveDraft.mutate(toSavePayload(snapshot, "PERSONAL_INFO"));
    }, AUTOSAVE_DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  function updateField<K extends keyof PersonalInfoFormData>(key: K, value: PersonalInfoFormData[K]) {
    setFormData((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key as string]: ""}));
  }

  function updateNested<Group extends "address" | "nextOfKin">(
    group: Group,
    field: keyof PersonalInfoFormData[Group],
    value: string,
  ) {
    setFormData((prev) => ({...prev, [group]: {...prev[group], [field]: value}}));
  }

  function handleBlur() {
    debouncedAutosaveRef.current();
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      const result = isRequired(String(formData[field] ?? ""));
      if (!result.valid) nextErrors[field] = result.message ?? "This field is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSaveAndContinueLater() {
    if (!draftId) return;
    committedRef.current = true;
    debouncedAutosaveRef.current.cancel?.();
    patchFormData(toStorePatch(formData));
    saveDraft.mutate(
      toSavePayload(formData, "PERSONAL_INFO"),
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
    if (!draftId) return;
    if (!validate()) return;

    committedRef.current = true;
    debouncedAutosaveRef.current.cancel?.();
    patchFormData(toStorePatch(formData));
    saveDraft.mutate(
      toSavePayload(formData, "PRODUCT_SPECIFIC_INFO"),
      {
        onSuccess: (data) => setCurrentStep(data.currentStep),
        onError: (error) => toast.error(error.message || "Couldn't save right now. Please try again."),
      },
    );
  }

  return (
    <form onSubmit={handleContinue} className="flex flex-col gap-6" onBlur={handleBlur}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-grey-900">Tell us about yourself</h2>
        <p className="text-sm text-grey-600">This helps us set up your profile correctly.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          error={errors.firstName}
          required
        />
        <Input
          label="Middle name (optional)"
          name="middleName"
          value={formData.middleName}
          onChange={(e) => updateField("middleName", e.target.value)}
        />
        <Input
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          error={errors.lastName}
          required
        />
        <Input
          label="Date of birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateField("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
          required
        />
        <Select
          label="Gender"
          name="gender"
          options={GENDER_OPTIONS}
          placeholder="Select gender"
          value={formData.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          error={errors.gender}
          required
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-grey-800">Address</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Street"
            name="street"
            value={formData.address.street}
            onChange={(e) => updateNested("address", "street", e.target.value)}
          />
          <Input
            label="City"
            name="city"
            value={formData.address.city}
            onChange={(e) => updateNested("address", "city", e.target.value)}
          />
          <Input
            label="State"
            name="state"
            value={formData.address.state}
            onChange={(e) => updateNested("address", "state", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-grey-800">Next of kin</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Full name"
            name="nextOfKinFullName"
            value={formData.nextOfKin.fullName}
            onChange={(e) => updateNested("nextOfKin", "fullName", e.target.value)}
          />
          <Input
            label="Relationship"
            name="nextOfKinRelationship"
            value={formData.nextOfKin.relationship}
            onChange={(e) => updateNested("nextOfKin", "relationship", e.target.value)}
          />
          <Input
            label="Phone"
            name="nextOfKinPhone"
            value={formData.nextOfKin.phone}
            onChange={(e) => updateNested("nextOfKin", "phone", e.target.value)}
          />
        </div>
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
