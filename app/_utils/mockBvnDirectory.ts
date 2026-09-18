import type { DraftFormData } from '@/app/_types';

/**
 * Stand-in for a real BVN/NIBSS lookup, which the demo can't call (see
 * docs/onboarding-build-plan-and-cursor-prompt.md — no live BVN verification
 * is in scope). Deliberately separate from `mockIdentifierIndex` in
 * `_lib/mocks/data.ts`: that table means "this person already has a Stanbic
 * account," while this one means "BVN returned demographic data" — true for
 * any BVN holder, not just existing customers. No email: a real BVN record
 * doesn't carry one, so that field is left for the applicant to type.
 * chidinmaifeoma@gmail.com
 */
const MOCK_BVN_DIRECTORY: Record<string, DraftFormData> = {
  '21100022334': {
    firstName: 'Chidinma',
    middleName: 'Ifeoma',
    lastName: 'Eze',
    dateOfBirth: '1992-03-18',
    gender: 'FEMALE',
    phoneNumber: '+2348023456781',
    address: [
      {
        houseNumber: '14',
        street: 'Okpara Avenue',
        city: 'Enugu',
        state: 'Enugu',
      },
    ],
    nationality: 'Nigerian',
  },
  '30099887766': {
    firstName: 'Tunde',
    middleName: 'Ayodele',
    lastName: 'Bakare',
    dateOfBirth: '1988-11-02',
    gender: 'MALE',
    phoneNumber: '+2348134567892',
    address: [
      {
        houseNumber: '27',
        street: 'Allen Avenue',
        city: 'Ikeja',
        state: 'Lagos',
      },
    ],
    nationality: 'Nigerian',
  },
  '40122334455': {
    firstName: 'Amina',
    lastName: 'Bello',
    dateOfBirth: '1997-07-25',
    gender: 'FEMALE',
    phoneNumber: '+2348056789013',
    address: [
      { houseNumber: '5', street: 'Zaria Road', city: 'Kano', state: 'Kano' },
    ],
    nationality: 'Nigerian',
  },
  '50133445566': {
    firstName: 'Emeka',
    middleName: 'Chukwuebuka',
    lastName: 'Nwosu',
    dateOfBirth: '1985-01-30',
    gender: 'MALE',
    phoneNumber: '+2348167890124',
    address: [
      {
        houseNumber: '9',
        street: 'Aminu Kano Crescent',
        city: 'Abuja',
        state: 'FCT',
      },
    ],
    nationality: 'Nigerian',
  },
  '60144556677': {
    firstName: 'Ngozi',
    middleName: 'Blessing',
    lastName: 'Umeh',
    dateOfBirth: '1994-09-14',
    gender: 'FEMALE',
    phoneNumber: '+2348098765435',
    address: [
      {
        houseNumber: '31',
        street: 'Aba Road',
        city: 'Port Harcourt',
        state: 'Rivers',
      },
    ],
    nationality: 'Nigerian',
  },
};

/** Returns null for any BVN outside the 5 seeded demo records — caller falls back to a blank form. */
export function lookupMockBvnBioData(bvn: string): DraftFormData | null {
  return MOCK_BVN_DIRECTORY[bvn.trim()] ?? null;
}
