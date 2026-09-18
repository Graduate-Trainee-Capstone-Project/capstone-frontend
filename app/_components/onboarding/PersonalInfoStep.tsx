'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import {useSaveDraft} from '@/app/_hooks';
import {useOnboardingStore} from '@/app/_hooks/useOnboardingStore';
import {Input} from '@/app/_ui/Input';
import {Select} from '@/app/_ui/Select';
import {Skeleton} from '@/app/_ui/Skeleton';
import {Spinner} from '@/app/_ui/Spinner';
import {debounce} from '@/app/_utils/debounce';
import {
  isRequired,
  isValidEmail,
  isValidPhone,
  normalizePhone,
} from '@/app/_utils/validators';
import {previousWizardStep} from '@/app/_utils/wizard';
import {AUTOSAVE_DEBOUNCE_MS, NIGERIAN_STATES, ROUTES} from '@/app/_constants';
import type {DraftFormData, DraftStep, SaveDraftRequest} from '@/app/_types';
import {toDateInputFormat} from '@/app/_utils';
import {WizardStepActions} from '@/app/_components/onboarding/WizardStepActions';

interface PersonalInfoFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: {houseNumber: string; street: string; city: string; state: string};
}

const GENDER_OPTIONS = [
  {value: 'MALE', label: 'Male'},
  {value: 'FEMALE', label: 'Female'},
];

/** How long the mock BVN fetch "takes" — long enough to read as a real lookup, short enough not to feel broken. */
const BVN_PREFILL_DELAY_MS = 2500;

function FieldSkeleton({label}: {label: string}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-medium text-grey-400">{label}</span>
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

function buildInitialFormData(cached: DraftFormData): PersonalInfoFormData {
  const address = cached.address?.[0] ?? {};

  return {
    firstName: cached.firstName ?? '',
    middleName: cached.middleName ?? '',
    lastName: cached.lastName ?? '',
    dateOfBirth: cached.dateOfBirth ?? '',
    gender: cached.gender ?? '',
    email: cached.email ?? '',
    phoneNumber: cached.phoneNumber ?? '',
    address: {
      houseNumber: address.houseNumber ?? '',
      street: address.street ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
    },
  };
}

function toStorePatch(formData: PersonalInfoFormData): Partial<DraftFormData> {
  return {
    firstName: formData.firstName || undefined,
    middleName: formData.middleName || undefined,
    lastName: formData.lastName || undefined,
    dateOfBirth: formData.dateOfBirth || undefined,
    gender: formData.gender || undefined,
    email: formData.email || undefined,
    phoneNumber: formData.phoneNumber ? normalizePhone(formData.phoneNumber) : undefined,
    address: [
      {
        houseNumber: formData.address.houseNumber,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
      },
    ],
    nationality: 'Nigerian',
  };
}

/** BE's multipart/form-data SaveDraftRequest — flat, no nested `formData`. */
function toSavePayload(
  formData: PersonalInfoFormData,
  currentStep: DraftStep,
): SaveDraftRequest {
  return {
    currentStep,
    channel: 'WEB',
    firstName: formData.firstName || undefined,
    middleName: formData.middleName || undefined,
    lastName: formData.lastName || undefined,
    dateOfBirth: formData.dateOfBirth || undefined,
    gender: formData.gender || undefined,
    email: formData.email || undefined,
    phoneNumber: formData.phoneNumber
      ? normalizePhone(formData.phoneNumber)
      : undefined,
    houseNumber: formData.address.houseNumber || undefined,
    street: formData.address.street || undefined,
    city: formData.address.city || undefined,
    state: formData.address.state || undefined,
    nationality: 'Nigerian',
  };
}

export function PersonalInfoStep() {
  const router = useRouter();
  const draftId = useOnboardingStore((state) => state.draftId);
  const cachedFormData = useOnboardingStore((state) => state.formData);
  const isExistingCustomer = useOnboardingStore((state) => state.isExistingCustomer);
  const patchFormData = useOnboardingStore((state) => state.patchFormData);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const resetStore = useOnboardingStore((state) => state.reset);
  const pendingBvnPrefill = useOnboardingStore((state) => state.pendingBvnPrefill);
  const setPendingBvnPrefill = useOnboardingStore((state) => state.setPendingBvnPrefill);
  const saveDraft = useSaveDraft(draftId ?? '');

  const previousStep = previousWizardStep('PERSONAL_INFO', isExistingCustomer);

  const [formData, setFormData] = useState<PersonalInfoFormData>(() =>
    buildInitialFormData(cachedFormData),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Captured once at mount: whether this screen arrived with a mock BVN
  // lookup to "resolve" — a later Stage-1 visit clears pendingBvnPrefill
  // after it's applied, so this never re-triggers on its own.
  const [isPrefilling, setIsPrefilling] = useState(() => pendingBvnPrefill !== null);

  useEffect(() => {
    if (!pendingBvnPrefill) return;
    const bioData = pendingBvnPrefill;

    const timeoutId = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        firstName: bioData.firstName ?? prev.firstName,
        middleName: bioData.middleName ?? prev.middleName,
        lastName: bioData.lastName ?? prev.lastName,
        dateOfBirth: bioData.dateOfBirth ?? prev.dateOfBirth,
        gender: bioData.gender ?? prev.gender,
        phoneNumber: bioData.phoneNumber ?? prev.phoneNumber,
        address: {
          houseNumber: bioData.address?.[0]?.houseNumber ?? prev.address.houseNumber,
          street: bioData.address?.[0]?.street ?? prev.address.street,
          city: bioData.address?.[0]?.city ?? prev.address.city,
          state: bioData.address?.[0]?.state ?? prev.address.state,
        },
      }));
      patchFormData(bioData);
      setPendingBvnPrefill(null);
      setIsPrefilling(false);
    }, BVN_PREFILL_DELAY_MS);

    return () => clearTimeout(timeoutId);
    // Runs once against the value present at mount — deliberately not
    // re-run if pendingBvnPrefill changes later.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const committedRef = useRef(false);

  const debouncedAutosaveRef = useRef<(() => void) & {cancel?: () => void}>(
    () => {},
  );
  useEffect(() => {
    debouncedAutosaveRef.current = debounce(() => {
      if (!draftId || committedRef.current) return;
      const snapshot = formDataRef.current;
      patchFormData(toStorePatch(snapshot));
      saveDraft.mutate(toSavePayload(snapshot, 'PERSONAL_INFO'));
    }, AUTOSAVE_DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  function updateField<K extends keyof PersonalInfoFormData>(
    key: K,
    value: PersonalInfoFormData[K],
  ) {
    setFormData((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key as string]: ''}));
  }

  function updateAddress(field: keyof PersonalInfoFormData['address'], value: string) {
    setFormData((prev) => ({
      ...prev,
      address: {...prev.address, [field]: value},
    }));
    setErrors((prev) => ({...prev, [field]: ''}));
  }

  function handleBlur() {
    debouncedAutosaveRef.current();
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    for (const field of [
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
    ] as const) {
      const result = isRequired(String(formData[field] ?? ''));
      if (!result.valid)
        nextErrors[field] = result.message ?? 'This field is required.';
    }

    const emailResult = isRequired(formData.email);
    if (!emailResult.valid) {
      nextErrors.email = emailResult.message ?? 'This field is required.';
    } else {
      const format = isValidEmail(formData.email);
      if (!format.valid) nextErrors.email = format.message ?? 'Enter a valid email address.';
    }

    const phoneRequired = isRequired(formData.phoneNumber);
    if (!phoneRequired.valid) {
      nextErrors.phoneNumber = phoneRequired.message ?? 'This field is required.';
    } else {
      const format = isValidPhone(formData.phoneNumber);
      if (!format.valid)
        nextErrors.phoneNumber = format.message ?? 'Enter a valid Nigerian mobile number.';
    }

    const streetResult = isRequired(formData.address.street);
    if (!streetResult.valid)
      nextErrors.street = streetResult.message ?? 'This field is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function persist(step: DraftStep, onSuccess?: (currentStep: DraftStep) => void) {
    if (!draftId) return;
    committedRef.current = true;
    debouncedAutosaveRef.current.cancel?.();
    patchFormData(toStorePatch(formData));
    saveDraft.mutate(toSavePayload(formData, step), {
      onSuccess: (data) => onSuccess?.(data.currentStep),
      onError: (error) => {
        committedRef.current = false;
        toast.error(error.message || "Couldn't save right now. Please try again.");
      },
    });
  }

  function handleSaveAndContinueLater() {
    persist('PERSONAL_INFO', () => {
      toast.success(
        'Saved — come back anytime with your details to pick up where you left off.',
      );
      resetStore();
      router.push(ROUTES.home);
    });
  }

  function handleBack() {
    if (!previousStep) return;
    persist(previousStep, (step) => setCurrentStep(step));
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    persist('PRODUCT_SPECIFIC_INFO', (step) => setCurrentStep(step));
  }

  return (
    <form
      onSubmit={handleContinue}
      method='post'
      className='flex flex-col gap-6'
      onBlur={handleBlur}
    >
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-grey-900'>
          Tell us about yourself
        </h2>
        <p className='text-sm text-grey-600'>
          This helps us set up your profile correctly.
        </p>
      </div>

      {isPrefilling && (
        <div className='flex items-center gap-2 rounded-lg border border-primary-100/40 bg-primary-100/5 px-4 py-3 text-sm text-primary-400'>
          <Spinner size='sm' />
          <span>Fetching your details from BVN&hellip;</span>
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {isPrefilling ? (
          <>
            <FieldSkeleton label='First name' />
            <FieldSkeleton label='Middle name (optional)' />
            <FieldSkeleton label='Last name' />
            <FieldSkeleton label='Date of birth' />
            <FieldSkeleton label='Gender' />
          </>
        ) : (
          <>
            <Input
              label='First name'
              name='firstName'
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label='Middle name (optional)'
              name='middleName'
              value={formData.middleName}
              onChange={(e) => updateField('middleName', e.target.value)}
            />
            <Input
              label='Last name'
              name='lastName'
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              error={errors.lastName}
              required
            />
            <Input
              label='Date of birth'
              name='dateOfBirth'
              type='date'
              value={toDateInputFormat(formData.dateOfBirth)}
              onChange={(e) => updateField('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />
            <Select
              label='Gender'
              name='gender'
              options={GENDER_OPTIONS}
              placeholder='Select gender'
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              error={errors.gender}
              required
            />
          </>
        )}
        <Input
          label='Email address'
          name='email'
          type='email'
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          required
        />
        {isPrefilling ? (
          <FieldSkeleton label='Phone number' />
        ) : (
          <Input
            label='Phone number'
            name='phoneNumber'
            type='tel'
            inputMode='tel'
            value={formData.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            error={errors.phoneNumber}
            required
          />
        )}
      </div>

      <div className='flex flex-col gap-4'>
        <h3 className='text-sm font-semibold text-grey-800'>Address</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {isPrefilling ? (
            <>
              <FieldSkeleton label='House number' />
              <FieldSkeleton label='Street' />
              <FieldSkeleton label='City' />
              <FieldSkeleton label='State' />
            </>
          ) : (
            <>
              <Input
                label='House number'
                name='houseNumber'
                value={formData.address.houseNumber}
                onChange={(e) => updateAddress('houseNumber', e.target.value)}
              />
              <Input
                label='Street'
                name='street'
                value={formData.address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                error={errors.street}
                required
              />
              <Input
                label='City'
                name='city'
                value={formData.address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
              />
              <Select
                label='State'
                name='state'
                options={NIGERIAN_STATES}
                placeholder='Select state'
                value={formData.address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      <WizardStepActions
        onBack={handleBack}
        hideBack={!previousStep}
        onSaveLater={handleSaveAndContinueLater}
        isLoading={saveDraft.isPending}
      />
    </form>
  );
}
