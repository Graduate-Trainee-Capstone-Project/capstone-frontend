# Unified Onboarding — Build Plan & Cursor Prompt (Steps 0–3)

**Owner of this build phase:** you — Screens 0 (Product selection), 1 (Identifier capture), 2 (Security verification), 3 (Personal info). Justin picks up 4–7 (Product-specific info, Document upload, Review & consent, Confirmation).
**Backend:** Emmanuel/Anu, .NET, building against the contract in Part 2.
**Status:** schema-document-v2 confirmed by Emmanuel/Anu. Building in parallel against the contract as-is; any backend-side changes get communicated back to the group and this doc gets updated.

---

# PART 1 — SCHEMA (agreed, v2)

## 1.1 The core idea

Every product defines its own required identifier(s) as **data**, not code:

| Product | Required identifier(s) |
|---|---|
| Savings account | BVN |
| Current account | BVN |
| Pension (RSA) | NIN + mobile number |
| Stockbroking | Email |
| Insurance | Email + mobile number |

This lives in `Products.RequiredIdentifiers` (JSON array). The frontend asks the API "what do you need for this product?" instead of branching per product — this is what makes a bank account and a pension account go through the **literal same flow**. A customer who's never banked with Stanbic and only wants a pension account hits the exact same code path a Savings applicant does.

## 1.2 Shared enums

```ts
enum IdentifierType { BVN = "BVN", NIN = "NIN", EMAIL = "EMAIL", PHONE = "PHONE" }

enum ProductCode {
  SAVINGS = "SAVINGS", CURRENT = "CURRENT", PENSION_RSA = "PENSION_RSA",
  STOCKBROKING = "STOCKBROKING", INSURANCE = "INSURANCE"
}

enum DraftStep {
  IDENTIFIER_CAPTURE = "IDENTIFIER_CAPTURE",       // first screen, always
  IDENTITY_CHECK = "IDENTITY_CHECK",               // system determines new vs existing
  PERSONAL_INFO = "PERSONAL_INFO",                 // skipped if existing customer
  PRODUCT_SPECIFIC_INFO = "PRODUCT_SPECIFIC_INFO",
  SECURITY_VERIFICATION = "SECURITY_VERIFICATION", // existing customers only
  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
  REVIEW = "REVIEW",
  SUBMITTED = "SUBMITTED"
}

enum DraftStatus { IN_PROGRESS = "IN_PROGRESS", SUBMITTED = "SUBMITTED", ABANDONED = "ABANDONED", EXPIRED = "EXPIRED" }
enum Channel { WEB = "WEB", MOBILE = "MOBILE", USSD = "USSD", BRANCH_ASSISTED = "BRANCH_ASSISTED" }
enum CustomerProductStatus { PENDING = "PENDING", ACTIVE = "ACTIVE", REJECTED = "REJECTED", CLOSED = "CLOSED" }
enum SecurityCheckType { SECURITY_QUESTION = "SECURITY_QUESTION", FACIAL_RECOGNITION = "FACIAL_RECOGNITION", OTP = "OTP" }
enum SecurityCheckStatus { PENDING = "PENDING", PASSED = "PASSED", FAILED = "FAILED" }
```

## 1.3 Core tables

**Products** — `ProductId` (PK), `ProductCode` (unique), `ProductName`, `RequiredIdentifiers` (JSON array — the data-driven field), `AdditionalFieldsSchema` (JSON — extra fields for PRODUCT_SPECIFIC_INFO), `IsActive`, `CreatedAt`.

**CustomerIdentifiers** — `IdentifierId` (PK), `CustomerId` (FK), `IdentifierType`, `IdentifierValueHash` (SHA-256, **never the raw value** — this is the lookup key), `IdentifierValueMasked` (e.g. `•••••1234`), `IsVerified`, `VerifiedAt`, `CreatedAt`.
→ **Unique constraint on `(IdentifierType, IdentifierValueHash)`.** This single constraint is what physically prevents the duplicate-BVN bug found in Stanbic's real flow, and is the entire mechanism behind "check-existing-customer."

**Customers** — deliberately thin: `CustomerId` (PK), `FirstName`/`MiddleName`/`LastName`, `DateOfBirth`, `Gender`, `Nationality`, `Status`, `CreatedAt`/`UpdatedAt`. Matching data lives in `CustomerIdentifiers`, not here. Row only created once an application finalizes or a draft is matched to a prior customer.

**DraftApplications** — the actual deliverable:
`DraftId` (PK, not the resume key), `ProductId` (FK), `CustomerId` (FK, nullable), `PrimaryIdentifierType`, `PrimaryIdentifierValueHash` (**this + ProductId is the real resume lookup key**), `SecondaryIdentifierType`/`Hash` (nullable — e.g. PHONE for Pension/Insurance), `CurrentStep`, `FormDataJson`, `Channel` (last channel used), `Status`, `CreatedAt`/`LastUpdatedAt`, `ExpiresAt` (30 days recommended).
→ **Unique constraint on `(ProductId, PrimaryIdentifierValueHash)` where `Status = 'IN_PROGRESS'`.** Only one active draft per product per identifier.

**CustomerProducts** — `CustomerProductId` (PK), `CustomerId` (FK), `ProductId` (FK), `DraftId` (FK, nullable — traceability), `Status`, `CreatedAt`. Unique on `(CustomerId, ProductId)`.

## 1.4 Product-specific detail tables (created only at finalize, from FormDataJson)

- **SavingsAccountDetails** — AccountNumber, Currency (NGN default), Balance, DateOpened, Status.
- **CurrentAccountDetails** — same + ChequeBookRequested.
- **PensionAccountDetails** — RsaPin (mock), PfaName (default: Stanbic IBTC Pension Managers Limited), EmployerName, ContributionScheme (MandatoryCPS/Voluntary/MicroPensionPlan), DateRegistered, Status.
- **StockbrokingAccountDetails** *(stub — future product)* — CscsAccountNumber (mock), RiskProfile.
- **InsuranceAccountDetails** *(stub — future product)* — PolicyNumber (mock), PolicyType.

Adding a real 4th/5th product later = one row in `Products` + one detail table shaped like the above. No changes to `DraftApplications`, `CustomerIdentifiers`, or lookup logic.

## 1.5 Supporting tables

- **SecurityChecks** — `DraftId` (FK), `CheckType`, `Status`, `CreatedAt`/`CompletedAt`. Mocked: a POST just writes `Status = PASSED` (or fails ~1-in-N for a demo-able failure path). Fires when IDENTITY_CHECK finds an existing customer adding a new product.
- **ConsentLog** — `CustomerId`, `ProductId`, `ConsentType` (e.g. `REUSE_KYC_DATA`), `GrantedAt`, `Channel`. Closes the "don't silently reuse KYC across products" compliance gap.

## 1.6 Core lookup logic (§6 of schema-document-v2 — what Emmanuel/Anu build first)

```
POST /applications/start
  1. Look up Products by productCode → RequiredIdentifiers
  2. hash(primaryIdentifierValue), hash(secondaryIdentifierValue) if present
  3. Look for existing DraftApplications WHERE ProductId=X AND PrimaryIdentifierValueHash=hash
     AND Status='IN_PROGRESS' → FOUND: return as-is (isResumed=true), FormDataJson + CurrentStep intact
  4. NOT FOUND — check CustomerIdentifiers WHERE IdentifierType=primaryType AND
     IdentifierValueHash=hash (and secondary, if required)
     → MATCHED existing Customer: new DraftApplications row, CustomerId=matched,
       CurrentStep=PRODUCT_SPECIFIC_INFO (personal info skipped),
       response: { isExistingCustomer: true, requiresSecurityCheck: true }
     → NO MATCH: new DraftApplications row, CustomerId=null, CurrentStep=PERSONAL_INFO,
       response: { isExistingCustomer: false, requiresSecurityCheck: false }
```

## 1.7 Known, stated scope cuts (say these out loud in the presentation, don't let a judge find them)

- Real BVN/NIN/NIBSS/NIMC verification is **mocked**. OTP and biometric checks are mocked too.
- CBN Tier 1/2/3 classification is cut entirely — worth one sentence that a production version would model this.
- **Resuming a draft by identifier alone has no re-authentication step** — anyone who knows a BVN could, in this MVP, pull up an in-progress application. Name this in Security & Compliance as a known MVP gap, not an oversight.
- Dynamic step-ordering engine (OnboardingSteps master catalog) was cut in favor of a fixed `CurrentStep` enum walked in the same order for every product — 3–5 products doesn't justify the complexity for a demo.

---

# PART 2 — FRONTEND PLAN (agreed)

## 2.1 Stack

| Concern | Tool | Why |
|---|---|---|
| Remote/server state | **TanStack Query** | Draft data must never be stale — cross-device resume depends on it. Autosave needs mutation + retry semantics. |
| Local UI-only state | **Zustand** | Modal open/closed, which sub-step is showing, validation banners — never round-trips to the server. |
| Form field values | **React Hook Form** | Minimizes re-renders while typing; validation for free; bundles into `formData` on submit/autosave. |
| Client-side validation | **Zod** + `@hookform/resolvers` | Validate BVN/NIN/email/phone shape before hitting the API. |
| HTTP transport | **Next.js Server Actions**, wrapping `apiRequest` | Keeps the .NET API URL (and any future secret) out of the browser bundle — matters with judges opening dev tools. |
| Notifications | `react-hot-toast` | Resume/existing-customer/error toasts on Screen 1. |

**Data flow per step:** RHF owns fields while typing → on "Continue" (or debounce) → TanStack Query mutation fires the matching Server Action → on success, cache updates and Zustand's `currentStep` mirrors the **server's** `currentStep` from the response. Server's `currentStep` is always the source of truth — Zustand never diverges from it except for sub-step UI state within one screen (e.g. which security-check sub-modal is open).

## 2.2 Already built (this session) — drop into your existing scaffold

- `app/_types/index.ts` — every request/response shape from the contract.
- `app/_lib/index.ts` — server-only `apiRequest` base (`get`/`post`/`put`/`delete`), parses the contract's `{ error: { code, message, field } }` shape, never caches.
- `app/_lib/actions/index.ts` — one Server Action per endpoint, each returning `ApiResult<T>` (`{ data } | { error, errorCode, errorField }`), never throws.
- `app/_hooks/index.ts` — TanStack Query hooks (`useProducts`, `useProduct`, `useStartApplication`, `useApplication`, `useSaveDraft`, `useSecurityCheckQuestions`, `useSubmitSecurityCheck`, `useFinalizeApplication`) — each wraps its action in a throw-adapter (`unwrap`) so `onError`/`isError` actually fire.

**Requires:** `npm install server-only`, and an `.env.local` entry `API_URL=<.NET base URL>` (no `NEXT_PUBLIC_` prefix — it never runs in the browser).

**Hard requirement for Emmanuel/Anu, not just a preference:** success and business-outcome-that-looks-like-failure must stay on 2xx status codes; only genuine errors (validation, not-found, already-submitted, security-check-exhausted, inactive-product, internal) use non-2xx, exactly as the contract's error-code table already specifies. The whole throw/no-throw mechanism in `_hooks` depends on that split holding — e.g. a security check that returns `FAILED` with `attemptsRemaining` is a normal `200`, not an error; only the exhausted-attempts case is `422 SECURITY_CHECK_FAILED`. If that ever gets blurred (e.g. an endpoint starts returning `200` with an error embedded in the body), the throw-adapter won't catch it — flag any deviation immediately rather than silently working around it client-side.

## 2.3 Routing shape

Single dynamic route: `/apply/[productCode]`. Step rendered conditionally inside based on state — not one URL per step. Same URL, reloaded on a different device, re-triggers identifier capture and jumps straight to wherever the draft left off.

## 2.4 What must NOT be hardcoded, anywhere in Steps 0–3

If any of these show up as `if (productCode === 'PENSION_RSA')` in a screen component, that's the unified-engine claim breaking:
- Which identifier field(s) render on Screen 1 — must come from `product.requiredIdentifiers`.
- Whether Screen 3 (Personal Info) shows at all — driven by `isExistingCustomer` from the `/start` response, never by product.
- Screen 2's presence — driven by `requiresSecurityCheck`, not product.

---

# PART 3 — CURSOR PROMPT (Steps 0–3)

Paste everything below into Cursor as one prompt.

```
You're building Steps 0–3 of a Next.js 15 (App Router) onboarding wizard for a bank's
unified customer onboarding platform. The backend is a separate .NET API — do not build
or mock backend logic; only call the Server Actions that already exist in this repo.

PROJECT CONTEXT
- Stack already installed: @tanstack/react-query, react-hook-form, zustand, react-hot-toast,
  next 15, react 19, tailwind.
- Already built and present in the repo — READ THESE FIRST, do not duplicate their logic:
  - app/_types/index.ts        (every request/response type)
  - app/_lib/index.ts          (server-only apiRequest fetch base)
  - app/_lib/actions/index.ts  (Server Actions: getProductsAction, getProductAction,
                                 startApplicationAction, getApplicationAction, saveDraftAction,
                                 getSecurityCheckQuestionsAction, submitSecurityCheckAction,
                                 finalizeApplicationAction)
  - app/_hooks/index.ts        (TanStack Query hooks: useProducts, useProduct,
                                 useStartApplication, useApplication, useSaveDraft,
                                 useSecurityCheckQuestions, useSubmitSecurityCheck,
                                 useFinalizeApplication, plus ApiRequestError with
                                 .code/.field for branching on specific error codes)

ROUTING
- Single dynamic route: app/(app)/apply/[productCode]/page.tsx
- The step shown is driven entirely by state (Zustand mirroring the server's currentStep),
  NOT by separate URLs per step. Reloading the same URL must re-trigger identifier capture
  and, once identifiers are re-entered, jump straight back to wherever the draft left off.

WHAT TO BUILD

1. Zustand store — app/_hooks/useOnboardingStore.ts (or wherever your store convention lives)
   State:
     - draftId: string | null
     - currentStep: DraftStep | null   // mirrors the server's currentStep, source of truth
     - isExistingCustomer: boolean
     - requiresSecurityCheck: boolean
     - formData: Record<string, unknown>   // accumulated across steps for local prefill only
     - securityCheckSubStep: 'SECURITY_QUESTION' | 'FACIAL_RECOGNITION' | null  // UI-only
   Actions: setFromStartResponse(response), setCurrentStep(step), patchFormData(partial), reset()
   IMPORTANT: this store never calls the API itself and never owns anything that round-trips
   to the server — that's TanStack Query's job. It only tracks "which screen is mounted"
   and transient sub-step UI state.

2. Screen 0 — Product selection
   Route: app/(app)/apply/page.tsx (product picker, before a product is chosen)
   - Use useProducts() to fetch GET /products.
   - Render a responsive grid of product cards: productName, and a short one-line
     description you can hardcode PER PRODUCT NAME as display copy only (this is presentation
     text, not business logic — it's fine to have a static description map here, that is NOT
     the kind of hardcoding to avoid).
   - Stockbroking and Insurance can render as visually distinct "Coming soon" cards
     (non-clickable) if their IsActive flag is false — check the flag, don't hardcode
     which products are stubs by name.
   - Clicking an active product card routes to /apply/[productCode].
   - Loading state: skeleton cards. Error state: toast + retry button.

3. Screen 1 — Identifier capture
   Route: app/(app)/apply/[productCode]/page.tsx renders this by default when
   currentStep is null / IDENTIFIER_CAPTURE.
   - Use useProduct(productCode) to fetch the single product and read requiredIdentifiers.
   - Dynamically render ONE generic identifier-input component per entry in
     requiredIdentifiers — do not branch per identifier type with separate components;
     one component takes an IdentifierType prop and renders the right label/placeholder/
     Zod pattern (BVN: 11 digits, NIN: 11 digits, EMAIL: email format, PHONE: Nigerian
     phone format e.g. +234XXXXXXXXXX or 0XXXXXXXXXX normalized before submit).
   - Use react-hook-form + zod resolver; the "Continue" button stays disabled until valid.
   - On submit: useStartApplication().mutate({ productCode, primaryIdentifierValue,
     secondaryIdentifierValue, channel: 'WEB' })
   - Handle all three response branches from the same screen (no separate "checking" screen):
       - isResumed: true       -> toast.success('Welcome back — resuming your application'),
                                   store.setFromStartResponse(data), route by data.currentStep
       - isExistingCustomer: true -> toast('We found an existing profile — verification needed'),
                                   store.setFromStartResponse(data) (currentStep will be
                                   SECURITY_VERIFICATION), render Screen 2
       - neither                -> store.setFromStartResponse(data) (currentStep will be
                                   PERSONAL_INFO), render Screen 3
   - Handle ApiRequestError from the mutation: show the message via toast.error; if
     err.code === 'VALIDATION_ERROR' and err.field is set, surface it as a field-level
     RHF error instead of a generic toast.
   - Loading state: spinner on the Continue button, inputs disabled during the mutation.

4. Screen 2 — Security verification (existing customers only, currentStep === 'SECURITY_VERIFICATION')
   Two sub-modals, gated by store.securityCheckSubStep:
     a) SECURITY_QUESTION sub-modal
        - useSecurityCheckQuestions(draftId) to fetch the two canned questions.
        - Two text inputs (RHF, both required, no special validation needed — mocked).
        - Submit -> useSubmitSecurityCheck(draftId).mutate({ checkType: 'SECURITY_QUESTION',
          answers: [{questionId, answer}, ...] })
        - On success with status 'PASSED' -> move to sub-modal b.
        - On success with status 'FAILED' -> show attemptsRemaining, let them retry the
          same sub-modal.
        - On thrown ApiRequestError with code 'SECURITY_CHECK_FAILED' (attempts exhausted)
          -> render a static "Contact support" screen, do not allow retry, do not build
          real lockout logic beyond this UI state.
     b) FACIAL_RECOGNITION sub-modal
        - Camera preview via getUserMedia (no library). A "Simulate capture" button that
          shows a brief spinner then calls useSubmitSecurityCheck(draftId).mutate({
          checkType: 'FACIAL_RECOGNITION' }) — payload content is irrelevant, always mocked
          by the backend.
        - On 'PASSED' -> both checks done -> route to whatever currentStep the draft
          actually needs next (call useApplication(draftId) or trust the last save response;
          confirm with backend response shape which is source of truth) -> typically
          PRODUCT_SPECIFIC_INFO, which is Justin's screen — for now, just transition
          currentStep in the store and render a "Continuing to product details..." handoff
          state if Screen 4 isn't built yet.
   Both checks must PASS before advancing past Screen 2.

5. Screen 3 — Personal info (new customers only, currentStep === 'PERSONAL_INFO')
   - RHF form: firstName, middleName (optional), lastName, dateOfBirth, gender, nationality,
     address (street, city, state), nextOfKin (fullName, relationship, phone). Zod-validate
     each field per the schema's expected types.
   - Autosave on blur: debounce ~800ms, fire useSaveDraft(draftId).mutate({
     currentStep: 'PERSONAL_INFO', formData: <only the fields that changed>, channel: 'WEB' })
     — remember PUT /save MERGES formData server-side, so only send the delta, not the
     whole accumulated object.
   - Explicit "Save and continue later" button: fires an immediate save with current
     currentStep, then routes back to Screen 0 (/apply). This is the deliberate resume
     staging point for the demo — treat it as a required element, not optional polish.
   - "Continue" button: save with currentStep advancing to 'PRODUCT_SPECIFIC_INFO', then
     hand off to Justin's Screen 4 (render a simple "Continuing..." placeholder if Screen 4
     isn't merged yet, so Steps 0–3 are demoable end-to-end on their own).

GENERAL RULES FOR ALL FOUR SCREENS
- No screen may contain `if (productCode === ...)` or `if (identifierType === ...)` logic
  that changes which fields render — that must always come from the product/response data.
- Every mutation must handle both the ApiRequestError throw path (toast + optionally
  field-level error) and a loading state (disabled inputs + spinner), not just the happy path.
- Keep all step components under app/_components, one file per screen, named for the step
  they render (e.g. IdentifierCaptureStep.tsx, SecurityVerificationStep.tsx,
  PersonalInfoStep.tsx), with the [productCode]/page.tsx acting purely as a switch on
  currentStep that renders the right one — no business logic in the page file itself.
- Use react-hot-toast for all success/error/info messaging, consistent tone across screens.

Build these four in order (0 → 1 → 2 → 3), confirming each renders and calls its
Server Action correctly before moving to the next.
```
