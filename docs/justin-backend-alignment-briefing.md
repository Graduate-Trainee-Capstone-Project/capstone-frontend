# Briefing for Justin — FE/BE alignment

This is the handoff after Kachi’s work on **frontend-only gaps** (bucket A). Your job is **bucket B**: places where both sides already have an endpoint, but the frontend still expects a different URL or JSON shape than the .NET API actually returns.

**Rule we agreed:** adopt the backend. Do not keep the old frontend contract and ask BE to match us. Types, payloads, and screens should consume **exactly** what the controllers/DTOs return.

Related files:

- Lookup contract we proposed to BE: [`customer-lookup-contract.md`](./customer-lookup-contract.md)
- Actions (mock vs live switch): `app/_lib/actions/index.ts`
- Types: `app/_types/index.ts`
- HTTP client: `app/_lib/index.ts`

---

## 1. What already shipped (bucket A) — do not undo

These are done. You can read them for context; you should not revert them while aligning to BE.

### Hybrid mocks

`MOCK_MODE=true` (current `.env.local`) still mocks **almost everything**, so local demo works.

Against a **live** API (`MOCK_MODE=false` + real `API_URL`):

| Action | Behaviour |
|---|---|
| Products, start, get draft, save, finalize | Live API |
| Security questions + submit | **Still mocked** until `MOCK_SECURITY_CHECK=false` |
| Customer lookup `POST /customers/lookup` | **Never mocked** |

Security mock is demo theatre: first security-question attempt fails, second passes, lockout after 3; facial always passes. BE’s `PerformCheckAsync` always inserts `PASSED` and has no questions — leave the mock until they wire routes.

### Already-a-customer banner

- OTP is **client-only**. Any **6 digits** unlocks the next step. No `/bvn-otp` calls.
- Then we call **live** `POST /customers/lookup` with `{ identifierType, identifierValue }`.
- Identifier type is the product’s first required identifier (BVN, or NIN/email/phone).
- No match → toast, continue as new. Network error → toast.
- BE have not shipped this route yet. When they do, retarget `lookupCustomerAction` if the path/shape differs. See [`customer-lookup-contract.md`](./customer-lookup-contract.md).

### Products list

- `GET /products` is typed as `Product[]` (raw array, not `{ products: [...] }`).
- `ProductGrid` uses `data.map(...)`.
- Empty array → “No products are available right now” (not an error).
- `isActive` / “Coming soon” removed. BE already filters inactive products in SQL.

### Errors from live API

`app/_lib/index.ts` reads `data.message`, then `data.details`, then the old `data.error.message` fallback.

Do not rely on `error.code === "DRAFT_ALREADY_SUBMITTED"` / `"VALIDATION_ERROR"` for live traffic. Mocks may still set `errorCode`. `ApplyProductClient` also matches message text like “already submitted” / “not in progress”.

### Forms

- Nationality field removed. Saves always send `nationality: "Nigerian"`.
- Next of kin still on the form and in the save payload. BE `DraftFormData` has **no** NOK — it will be dropped until they add it.
- Documents save as `{ documents: [{ type: slotLabel, url: fileName }] }`.
- Product extras: UI still uses schema field names; save maps `branchPreference` → `preferredBranch`, `chequeBookRequested` → `checkBookRequested` (`app/_utils/formData.ts`). Other schema keys are sent as-is and BE will likely ignore them.
- Personal, product-specific, and documents all have debounce autosave + **Save and continue later**.

### Env

```
API_URL=https://api.example.com   # placeholder → mocks stay on
MOCK_MODE=true                    # force all mocks except lookup
# MOCK_SECURITY_CHECK=false       # only when BE has questions + POST security-check
```

To talk to the real API: set `API_URL` to the .NET origin (no trailing slash) and `MOCK_MODE=false`. Restart `next dev`.

---

## 2. What you own (bucket B) — adopt BE shapes

Work through these in order. After each, the screen should run against Swagger/the deployed API, not against our old types.

Assume JSON **camelCase** (ASP.NET `AddNewtonsoftJson` default). Guids are strings. Dates are ISO DateTime, not necessarily `yyyy-MM-dd`.

### B1. `GET /products/{code}` URL

| Frontend today | Backend |
|---|---|
| `GET /products/SAVINGS` | `GET /products/by/SAVINGS` |

**Change:** `getProductAction` in `app/_lib/actions/index.ts` → `` `/products/by/${productCode}` ``.

`ProductResponse` has no `isActive` (already removed on FE). `additionalFieldsSchema` is `object | null` on BE, not guaranteed `AdditionalField[]`. If the DB JSON is our array shape, the product-info step still works; if not, guard or parse — don’t crash.

### B2. `POST /applications/start` response

Path and request body already match (`productCode`, `primaryIdentifierValue`, `secondaryIdentifierValue`, `channel`).

**BE extra / different:**

```ts
{
  draftId: string;
  isResumed: boolean;
  isExistingCustomer: boolean;
  requiresSecurityCheck: boolean;
  currentStep: string;
  formData: DraftFormData;          // typed object, NOT a bag
  existingCustomer: ExistingCustomerData | null;  // FE does not have this yet
}
```

`ExistingCustomerData`:

```ts
{
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;  // a single street string, not { street, city, state }
}
```

On **new** existing-customer start, BE returns **empty** `formData` and puts profile on `existingCustomer`. `useOnboardingStore.setFromStartResponse` currently does `formData: response.formData ?? {}` and never reads `existingCustomer`. Prefill the personal-info UI from `existingCustomer` (map that street string into our address shape as best you can).

### B3. `GET /applications/{draftId}` response

Path is correct. Payload is not.

**BE:**

```ts
{
  draftId: string;
  productId: string;           // Guid — NOT productCode
  primaryIdentifierType: string;
  secondaryIdentifierType?: string | null;
  currentStep: string;
  formData: DraftFormData;
  channel: string;
  status: string;
  createdAt: string;
  lastUpdatedAt: string;
  expiresAt: string;
}
```

`customerId` is commented out in the BE mapper. There is **no** `productCode`, **no** `isExistingCustomer`.

Keep `productCode` from the URL / Zustand store. Update `ApplicationDraftResponse` in `app/_types/index.ts`. `ApplyProductClient` already patches `formData` from this GET — once `formData` is `DraftFormData`, that patch must not assume a dictionary of arbitrary keys.

Submitted drafts: BE does **not** return `DRAFT_ALREADY_SUBMITTED` on GET. Finalize 400 is `{ message: "Draft '…' is not in progress." }`.

### B4. Typed `DraftFormData` on save (the big one)

BE `SaveDraftRequest.formData` is **not** `Record<string, unknown>`. Known fields only:

| BE property | Notes |
|---|---|
| `firstName`, `middleName`, `lastName` | strings |
| `dateOfBirth` | `DateTime?` |
| `gender`, `email`, `phoneNumber` | |
| `address` | **`AddressInfo[]`**, not `{ street, city, state }` |
| `accountType`, `initialDeposit`, `currency` | |
| `preferredBranch` | we already map from `branchPreference` |
| `checkBookRequested` | we already map from `chequeBookRequested` — **BE `ApplySave` currently does not copy this field** (BE bug; still send it) |
| `documents` | `{ type, url }[]` — FE already sends this |

`AddressInfo`: `{ houseNumber, street, city, state, country }`.

**FE personal info still sends** `address: { street, city, state }` and `nextOfKin`. You need to:

1. Type `formData` as BE `DraftFormData` (plus optional extras we still collect).
2. On save, send `address: [{ street, city, state }]`.
3. On hydrate/review, read `address[0]`.
4. Keep sending `nextOfKin` if you want; it will be ignored until BE adds it.

Zustand `formData: Record<string, unknown>` and `patchFormData` dictionary-merge will fight this. Replace or wrap with a structured merge so autosave deltas still work.

Pension/stock schema fields (`employerName`, `contributionScheme`, …) are **not** on `DraftFormData`. Ask BE to persist unknown JSON **or** extend the DTO. Do not mock those values when talking to SQL.

### B5. Finalize status

Path matches. Response names match. BE `status` is a **string** (`ACTIVE`, or `CustomerProductStatus.ToString()` → `PENDING` / `REJECTED` / `CLOSED`). Widen `FinalizeApplicationResponse.status` from `"ACTIVE" | "PENDING"` to `string`.

### B6. Security URLs — leave mocked unless BE ships questions

Do **not** point the wizard at `GET /securityCheckBy/{draftId}`. That returns a **list of past checks** `{ securityCheckId, checkType, status, completedAt }[]`, not `{ questions: [...] }`.

`ISecurityService.PerformCheckAsync` exists but **no POST controller** exposes it.

Keep `MOCK_SECURITY_CHECK` as-is until BE add:

- `GET /applications/{draftId}/security-check/questions`
- `POST /applications/{draftId}/security-check`

Then set `MOCK_SECURITY_CHECK=false`.

---

## 3. Suggested order for you

1. **B1** product-by-code URL — small, unblocks the apply page on live API.
2. **B2 + B3** start/get types + `existingCustomer` prefill.
3. **B4** `DraftFormData` through store, personal info, review, autosave.
4. **B5** finalize `status`.
5. When BE lookup exists, compare to [`customer-lookup-contract.md`](./customer-lookup-contract.md) and retarget if needed.
6. Security only after BE has the question/submit routes.

### Files you will almost certainly touch

- `app/_types/index.ts`
- `app/_lib/actions/index.ts`
- `app/_hooks/useOnboardingStore.ts`
- `app/_hooks/index.ts`
- `app/_components/onboarding/PersonalInfoStep.tsx`
- `app/_components/onboarding/ApplyProductClient.tsx`
- `app/_components/onboarding/IdentifierCaptureStep.tsx`
- `app/_components/onboarding/ReviewStep.tsx`
- `app/_utils/formData.ts` (already has product-field + documents helpers)

Mocks in `app/_lib/mocks/` should emit the **same** shapes once types change, or mock and live will diverge again.

---

## 4. Quick “is it live?” checklist

- [ ] `.env.local`: real `API_URL`, `MOCK_MODE=false`
- [ ] Product grid loads from `GET /products` (array)
- [ ] Apply page loads product via `GET /products/by/{code}`
- [ ] Start + resume via identifier
- [ ] Existing customer: empty `formData`, prefill from `existingCustomer`
- [ ] Save personal info: address is an **array**
- [ ] Documents round-trip as `documents[]`
- [ ] Banner lookup: 6-digit OTP then `POST /customers/lookup` (when BE is up)
- [ ] Security still mocked unless flag is off
