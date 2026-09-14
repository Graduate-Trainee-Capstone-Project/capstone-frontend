# API Contract & Frontend Plan — Unified Onboarding MVP
Built against `schema-document-v2.md`. For Kachi/Justin (frontend) primarily; Emmanuel/Anu should treat Part 1 as the contract to implement against, not gospel — flag anything that doesn't match their actual build before we lock it.

---

# PART 1 — API CONTRACT

**Base URL (placeholder, replace once deployed):** `https://api.digitap-demo.stanbicibtc.dev/v1`

**Conventions:**
- All requests/responses JSON.
- Client sends raw identifier values over HTTPS; hashing happens server-side (Emmanuel/Anu control the hash + salt centrally — client never computes or sends a hash).
- `PUT /applications/{draftId}/save` **merges** `formData` into the existing `FormDataJson`, it does not replace it — the frontend only needs to send the current step's fields, not the whole accumulated object.
- Every error response follows the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "This product requires a mobile number in addition to NIN.",
    "field": "secondaryIdentifierValue"
  }
}
```

**Standard error codes:** `VALIDATION_ERROR` (400) · `NOT_FOUND` (404) · `DRAFT_ALREADY_SUBMITTED` (409) · `SECURITY_CHECK_FAILED` (422) · `PRODUCT_INACTIVE` (400) · `INTERNAL_ERROR` (500)

---

### `GET /products`
Returns every active product with its identifier requirements — this is what makes the frontend product-agnostic.

**200:**
```json
{
  "products": [
    {
      "productId": "uuid",
      "productCode": "SAVINGS",
      "productName": "Savings account",
      "requiredIdentifiers": ["BVN"],
      "additionalFieldsSchema": [{ "field": "branchPreference", "label": "Preferred branch", "type": "text", "required": false }]
    },
    {
      "productId": "uuid",
      "productCode": "PENSION_RSA",
      "productName": "Pension (RSA)",
      "requiredIdentifiers": ["NIN", "PHONE"],
      "additionalFieldsSchema": [
        { "field": "employerName", "label": "Employer name", "type": "text", "required": false },
        { "field": "contributionScheme", "label": "Contribution scheme", "type": "select", "options": ["MandatoryCPS", "Voluntary", "MicroPensionPlan"], "required": true }
      ]
    }
  ]
}
```

### `GET /products/{productCode}`
Same shape as a single item above. `404 NOT_FOUND` if inactive/missing.

---

### `POST /applications/start`
The single most important endpoint — this is resume, dedup-detection, and new-application creation, all in one call.

**Request:**
```json
{
  "productCode": "PENSION_RSA",
  "primaryIdentifierValue": "12345678901",
  "secondaryIdentifierValue": "+2348012345678",
  "channel": "WEB"
}
```
`secondaryIdentifierValue` must be present iff the product requires two identifiers — `400 VALIDATION_ERROR` otherwise.

**200 — brand new draft:**
```json
{
  "draftId": "uuid",
  "isResumed": false,
  "isExistingCustomer": false,
  "requiresSecurityCheck": false,
  "currentStep": "PERSONAL_INFO",
  "formData": {}
}
```

**200 — resumed draft (this is the cross-device demo moment):**
```json
{
  "draftId": "uuid",
  "isResumed": true,
  "isExistingCustomer": false,
  "requiresSecurityCheck": false,
  "currentStep": "PRODUCT_SPECIFIC_INFO",
  "formData": { "firstName": "Adaeze", "lastName": "Okonkwo", "dateOfBirth": "1995-04-12" }
}
```

**200 — existing customer detected (no bank relationship required — this fires identically for a first-time pension applicant who already has, say, a Savings account):**
```json
{
  "draftId": "uuid",
  "isResumed": false,
  "isExistingCustomer": true,
  "requiresSecurityCheck": true,
  "currentStep": "SECURITY_VERIFICATION",
  "formData": { "firstName": "Adaeze", "lastName": "Okonkwo" }
}
```

---

### `GET /applications/{draftId}`
Fetches current draft state directly by ID (used if the frontend already has a `draftId` cached locally, e.g. reloading the same tab — separate from the identifier-based resume in `/start`).

**200:**
```json
{
  "draftId": "uuid",
  "productCode": "SAVINGS",
  "currentStep": "PRODUCT_SPECIFIC_INFO",
  "formData": {},
  "isExistingCustomer": false,
  "status": "IN_PROGRESS",
  "lastUpdatedAt": "2026-09-14T10:32:00Z"
}
```
`404 NOT_FOUND` if missing/expired · `409 DRAFT_ALREADY_SUBMITTED` if already finalized (frontend should route to the confirmation screen, not re-render the form).

---

### `PUT /applications/{draftId}/save`
**Request:**
```json
{
  "currentStep": "PRODUCT_SPECIFIC_INFO",
  "formData": { "employerName": "Stanbic IBTC Bank" },
  "channel": "WEB"
}
```
**200:**
```json
{ "draftId": "uuid", "currentStep": "PRODUCT_SPECIFIC_INFO", "lastUpdatedAt": "2026-09-14T10:35:00Z", "status": "IN_PROGRESS" }
```
`409 DRAFT_ALREADY_SUBMITTED` if the draft is already finalized.

---

### `GET /applications/{draftId}/security-check/questions`
Mock — returns two canned questions.
```json
{ "questions": [{ "questionId": "q1", "prompt": "What is your mother's maiden name?" }, { "questionId": "q2", "prompt": "What was the name of your first school?" }] }
```

### `POST /applications/{draftId}/security-check`
**Request (security question):**
```json
{ "checkType": "SECURITY_QUESTION", "answers": [{ "questionId": "q1", "answer": "Adaeze" }, { "questionId": "q2", "answer": "Corona School" }] }
```
**Request (facial — payload irrelevant, always mocked):**
```json
{ "checkType": "FACIAL_RECOGNITION" }
```
**200 — passed:**
```json
{ "checkType": "SECURITY_QUESTION", "status": "PASSED" }
```
**200 — failed:**
```json
{ "checkType": "SECURITY_QUESTION", "status": "FAILED", "attemptsRemaining": 2 }
```
`422 SECURITY_CHECK_FAILED` once attempts are exhausted — frontend shows a "contact support" mock screen, draft stays locked.

---

### `POST /applications/{draftId}/finalize`
**Request:** `{}` — everything needed was already saved via `/save`.

**200:**
```json
{ "customerId": "uuid", "customerProductId": "uuid", "productAccountReference": "0123456789", "status": "ACTIVE" }
```
`409 VALIDATION_ERROR` listing which required steps (e.g. `SECURITY_VERIFICATION`, `DOCUMENT_UPLOAD`) aren't yet complete.

---

# PART 2 — FRONTEND ARCHITECTURE

## Stack decision

| Concern | Tool | Why |
|---|---|---|
| Remote/server state | **TanStack Query** | Draft data must never be stale (cross-device resume depends on freshness); autosave needs mutation + retry semantics Next's fetch cache doesn't give you against an external API |
| Local UI-only state | **Zustand** | Modal open/closed, which step is mounted, validation banners — things that never need to survive a page reload via the server |
| Form field values | **React Hook Form** | Minimizes re-renders while typing, built-in validation, bundles cleanly into `formData` on submit/autosave |
| Client-side validation | **Zod** (+ `@hookform/resolvers`) | Validate BVN/NIN/email/phone shape before hitting the API at all |
| HTTP client | Plain `fetch` wrapper (typed) | No need for axios — TanStack Query doesn't require it, and you're not doing anything fetch can't |
| Step transition polish | Framer Motion — **optional**, cut first if time is tight | Nice-to-have only |

**Data flow per step:** RHF owns the fields while typing → on "Continue" (or a debounce timer for autosave) → TanStack Query mutation fires `PUT /save` → on success, the query cache updates and Zustand's `currentStep` mirrors the server's `currentStep` from the response → the next screen renders. The server's `currentStep` is always the source of truth; Zustand never diverges from it except for sub-step UI state within a single screen (e.g. which of the two security-check sub-modals is showing).

## Routing shape

Single dynamic route: `/apply/[productCode]`, step rendered conditionally inside based on state — not one URL per step. This matters for the resume demo: the *same URL*, reloaded on a different device, re-triggers identifier capture and jumps straight to wherever the draft left off, rather than needing to guess which step-URL to visit.

## Screen-by-screen plan

**Screen 0 — Product selection**
- Grid of product cards from `GET /products` (Savings, Current, Pension, Stockbroking, Insurance — last two can render as "coming soon" stubs if not fully built)
- Click → routes to `/apply/{productCode}`

**Screen 1 — Identifier capture**
- Fields rendered dynamically from the selected product's `requiredIdentifiers` — one input for Savings (BVN), two for Pension (NIN + phone), one for Stockbroking (email), two for Insurance (email + phone). No per-product component branching — one generic component reading the array.
- Zod validation per identifier type (11-digit BVN/NIN, email format, phone format) before the button even enables.
- "Continue" → `POST /applications/start`. Loading spinner during the call.
- Response branches (all handled from this one screen, no separate "checking" screen needed):
  - `isResumed: true` → toast "Welcome back — resuming your application" → jump straight to whatever `currentStep` came back, form pre-filled from `formData`
  - `isExistingCustomer: true` → toast "We found an existing profile — a quick verification is needed" → Security Verification screen
  - neither → Personal Info screen

**Screen 2 — Security verification** *(existing customers only)*
- Sub-modal A: security questions — two text inputs from `GET .../security-check/questions`, submit → `POST security-check`
- Sub-modal B: facial/passport mock — camera preview (`getUserMedia`, no library needed) → "Simulate capture" button → spinner → checkmark, backed by `POST security-check {checkType: FACIAL_RECOGNITION}`
- Both must return `PASSED` before continuing. On `FAILED`, show `attemptsRemaining` and let them retry; after exhaustion, show a static "contact support" screen — don't build real lockout logic, just the UI state.

**Screen 3 — Personal info** *(new customers only — skipped entirely for existing customers, which is the actual payoff of the unified profile)*
- Name, DOB, gender, nationality, address, next-of-kin fields
- Autosave on blur (debounced `PUT /save`, `currentStep` stays `PERSONAL_INFO` until "Continue")
- Include an explicit **"Save and continue later"** button — don't rely on judges having to awkwardly close a laptop mid-demo. This button fires an immediate save and returns to Screen 0, making the resume moment deliberate and clean to stage live.

**Screen 4 — Product-specific info**
- Fields rendered from `Products.additionalFieldsSchema` for the selected product — generic form-builder component, not a hardcoded form per product. This is where "Pension asks for employer + contribution scheme" and "Savings asks for branch preference" differ, without any product-specific screen code.
- Continue → save, advance to Document Upload

**Screen 5 — Document upload**
- File inputs for ID + passport photo — store filename/placeholder only, no real storage backend needed for the demo unless it's trivial to wire up
- Continue → Review

**Screen 6 — Review & consent**
- Read-only summary of everything captured
- Explicit checkbox: "I consent to Stanbic IBTC using my verified details for this application" — for existing customers, the copy should say "...and reusing my previously verified KYC information," since that's the specific consent gap flagged earlier
- Submit → `POST finalize`

**Screen 7 — Confirmation**
- Shows `productAccountReference` (account number / RSA PIN)
- "Done" → back to Screen 0

## What each screen must NOT hardcode

If any of these end up hardcoded per product, that's a sign the "unified engine" claim is decorative rather than real — worth checking each other's code for this during integration:
- Which identifier field(s) to render (Screen 1)
- Whether Personal Info is shown at all (Screen 3 — driven by `isExistingCustomer`, not by product)
- Which extra fields appear (Screen 4 — driven by `additionalFieldsSchema`, not a switch statement)

---

*One sequencing note: Emmanuel/Anu should confirm the exact `DraftStep` enum values and response shapes above match what they're actually building before you and Justin start wiring real API calls — build against these contracts with mocked responses in parallel starting now, but don't let a mismatch surface for the first time on integration day.*
