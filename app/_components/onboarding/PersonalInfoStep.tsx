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
import {withDefaultNationality} from "@/app/_utils/formData";

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

function buildInitialFormData(cached: Record<string, unknown>): PersonalInfoFormData {
  const address = (cached.address as Partial<PersonalInfoFormData["address"]>) ?? {};
  const nextOfKin = (cached.nextOfKin as Partial<PersonalInfoFormData["nextOfKin"]>) ?? {};

  return {
    firstName: (cached.firstName as string) ?? "",
    middleName: (cached.middleName as string) ?? "",
    lastName: (cached.lastName as string) ?? "",
    dateOfBirth: (cached.dateOfBirth as string) ?? "",
    gender: (cached.gender as string) ?? "",
    address: {street: address.street ?? "", city: address.city ?? "", state: address.state ?? ""},
    nextOfKin: {
      fullName: nextOfKin.fullName ?? "",
      relationship: nextOfKin.relationship ?? "",
      phone: nextOfKin.phone ?? "",
    },
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

  // Tracks fields changed since the last successful save — /save MERGES
  // server-side, so we only ever send the delta, never the whole object.
  const pendingChangesRef = useRef<Record<string, unknown>>({});

  // Built inside an effect (after render, not during it) so the debounced
  // closure reading pendingChangesRef never runs as a side effect of render.
  const debouncedAutosaveRef = useRef<() => void>(() => {});
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      const changes = pendingChangesRef.current;
      if (Object.keys(changes).length === 0 || !draftId) return;
      pendingChangesRef.current = {};
      patchFormData(withDefaultNationality(changes));
      saveDraft.mutate({
        currentStep: "PERSONAL_INFO",
        formData: withDefaultNationality(changes),
        channel: "WEB",
      });
    }, AUTOSAVE_DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  function updateField<K extends keyof PersonalInfoFormData>(key: K, value: PersonalInfoFormData[K]) {
    setFormData((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key as string]: ""}));
    pendingChangesRef.current = {...pendingChangesRef.current, [key]: value};
  }

  function updateNested<Group extends "address" | "nextOfKin">(
    group: Group,
    field: keyof PersonalInfoFormData[Group],
    value: string,
  ) {
    setFormData((prev) => {
      const nextGroup = {...(prev[group] as object), [field]: value};
      return {...prev, [group]: nextGroup};
    });
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      [group]: {...(pendingChangesRef.current[group] as object), [field]: value},
    };
  }

  function handleBlur() {
    debouncedAutosaveRef.current();
  }

  function flushPendingChangesNow(): Record<string, unknown> {
    const changes = pendingChangesRef.current;
    pendingChangesRef.current = {};
    if (Object.keys(changes).length > 0) patchFormData(withDefaultNationality(changes));
    return changes;
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
    const changes = flushPendingChangesNow();
    saveDraft.mutate(
      {currentStep: "PERSONAL_INFO", formData: withDefaultNationality(changes), channel: "WEB"},
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

    const changes = flushPendingChangesNow();
    saveDraft.mutate(
      {currentStep: "PRODUCT_SPECIFIC_INFO", formData: withDefaultNationality(changes), channel: "WEB"},
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
