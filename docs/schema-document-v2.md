# Unified Onboarding — Schema v2 (Build-Ready)
**Merges:** original schema-document (Emmanuel/Anu) → DigiTap Onboarding Schema & Flow (full-engine version) → Justin's chat findings (5-day MVP scope cut)
**This is the version to build against. Target: code-complete by 16th, integration/rehearsal on 17th, present 18th.**

---

## 0. What changed and why (read this before you build anything)

Three inputs got merged here:

1. **Original schema-document** — had the right instinct (`Customers` as root, product tables hanging off it) but no resume state and no way to detect the same person across different products.
2. **DigiTap Onboarding Schema & Flow (v1)** — added `OnboardingProgress`, `OnboardingStepInstance`, `ProductStepMap`, `BvnVerificationSession`. Correct concept, but sized for a multi-month production build with Tier 1/2/3 CBN logic, not a 5-day demo.
3. **Justin's chat findings** — the actual demo scope: one real backend, save/resume by identifier across devices, check-existing-customer must query real data (not be scripted), mocked biometrics/security checks, and — the requirement that changes the whole shape of this — **different products key off different identifiers** (BVN for bank accounts, NIN+phone for pension, email for stockbroking, email+phone for insurance), and **every product goes through the identical flow**, including bank accounts. There's no special case for "bank account" vs "pension" vs anything else.

What got cut from v1, explicitly, so nobody thinks it's missing by accident:
- **Full step-orchestration engine** (`OnboardingSteps` master catalog + dynamic `ProductStepMap` ordering) — replaced with a fixed `CurrentStep` enum walked in the same order for every product. You have 3–5 products, not 30; dynamic reordering isn't earning its complexity for a demo.
- **CBN Tier 1/2/3 classification** — cut entirely. Not needed to prove the resume/dedup story. Worth one sentence in the presentation that a production version would model this.
- **Real BVN/NIN/NIBSS/NIMC verification** — mocked. OTP and biometric checks are mocked too.
- **Dedicated `BvnVerificationSession` table** — folded into `DraftApplications` + a generic `SecurityChecks` table, since you're not doing real OTP-against-NIBSS this round.

What's the same, and non-negotiable: **the unified identity concept survives fully** — a customer's data lives once, centrally, and every product references it. That's the actual thesis. Everything else below exists to serve that.

---

## 1. The one abstraction everything hangs on

**Every product defines its own required identifier(s), as data, not as code.**

| Product | Required identifier(s) |
|---|---|
| Savings account | BVN |
| Current account | BVN |
| Pension (RSA) | NIN + mobile number |
| Stockbroking | Email |
| Insurance | Email + mobile number |

This table lives inside the `Products` row (`RequiredIdentifiers` field) — the frontend asks the API "what do you need for this product?" instead of a switch statement per product. This is also what makes a bank account and a pension account go through **the literal same flow**: the engine doesn't know or care what "BVN" means, it just knows this product needs identifier type X (and optionally Y), looks up whether that identifier is already attached to a `Customer`, and proceeds from there. A customer who's never banked with you and only wants a pension account hits the exact same code path a Savings applicant does.

---

## 2. Shared enums

```typescript
enum IdentifierType {
  BVN = "BVN",
  NIN = "NIN",
  EMAIL = "EMAIL",
  PHONE = "PHONE"
}

enum ProductCode {
  SAVINGS = "SAVINGS",
  CURRENT = "CURRENT",
  PENSION_RSA = "PENSION_RSA",
  STOCKBROKING = "STOCKBROKING",
  INSURANCE = "INSURANCE"
}

enum DraftStep {
  IDENTIFIER_CAPTURE = "IDENTIFIER_CAPTURE",     // first screen, always — identifier(s) entered
  IDENTITY_CHECK = "IDENTITY_CHECK",             // system determines new vs existing customer
  PERSONAL_INFO = "PERSONAL_INFO",               // skipped if existing customer already has it
  PRODUCT_SPECIFIC_INFO = "PRODUCT_SPECIFIC_INFO",
  SECURITY_VERIFICATION = "SECURITY_VERIFICATION", // only triggered for existing customers adding a product
  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
  REVIEW = "REVIEW",
  SUBMITTED = "SUBMITTED"
}

enum DraftStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  ABANDONED = "ABANDONED",
  EXPIRED = "EXPIRED"
}

enum Channel {
  WEB = "WEB",
  MOBILE = "MOBILE",
  USSD = "USSD",
  BRANCH_ASSISTED = "BRANCH_ASSISTED"
}

enum CustomerProductStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED"
}

enum SecurityCheckType {
  SECURITY_QUESTION = "SECURITY_QUESTION",
  FACIAL_RECOGNITION = "FACIAL_RECOGNITION",
  OTP = "OTP"
}

enum SecurityCheckStatus {
  PENDING = "PENDING",
  PASSED = "PASSED",
  FAILED = "FAILED"
}
```

---

## 3. Core tables

### 3.1 `Products`

| Field | Type | Notes |
|---|---|---|
| ProductId | uuid, PK | |
| ProductCode | enum `ProductCode`, unique | |
| ProductName | string | Display name shown in UI |
| RequiredIdentifiers | `IdentifierType[]` (JSON array) | e.g. `["BVN"]`, `["NIN","PHONE"]`, `["EMAIL"]`, `["EMAIL","PHONE"]` — **this field is what makes the engine data-driven** |
| AdditionalFieldsSchema | JSON | Lightweight list of the extra fields this product's `PRODUCT_SPECIFIC_INFO` step needs (see §8 for sample payloads) |
| IsActive | bool | |
| CreatedAt | datetime | |

### 3.2 `CustomerIdentifiers`

| Field | Type | Notes |
|---|---|---|
| IdentifierId | uuid, PK | |
| CustomerId | FK → `Customers` | |
| IdentifierType | enum `IdentifierType` | |
| IdentifierValueHash | string | SHA-256 hash of the raw value — **this is the lookup key**, never the raw BVN/NIN |
| IdentifierValueMasked | string | e.g. `"•••••1234"` — safe to display in UI |
| IsVerified | bool | Whether OTP/verification passed for this specific identifier |
| VerifiedAt | datetime, nullable | |
| CreatedAt | datetime | |

**Unique constraint on `(IdentifierType, IdentifierValueHash)`.** This single constraint is what physically prevents (and detects) the exact bug you found in Stanbic's real flow — the same BVN silently creating a second account. It's also the whole mechanism behind "check-existing-customer," which per Justin's chat has to be real, not scripted: it's one indexed lookup.

### 3.3 `Customers`

| Field | Type | Notes |
|---|---|---|
| CustomerId | uuid, PK | |
| FirstName / MiddleName / LastName | string | |
| DateOfBirth | date, nullable | |
| Gender | string, nullable | |
| Nationality | string, nullable | |
| Status | enum (`ACTIVE`/`SUSPENDED`/`CLOSED`) | |
| CreatedAt / UpdatedAt | datetime | |

Deliberately thin. The actual matching/identifying data lives in `CustomerIdentifiers`, not here — this row only gets created once an application is finalized (new customer) or once a draft is matched to a prior one (existing customer).

### 3.4 `DraftApplications` — the actual deliverable

This is the table the whole demo hinges on. Cross-device resume, existing-customer detection, and per-product flexibility all come from this one table.

| Field | Type | Notes |
|---|---|---|
| DraftId | uuid, PK | Returned to frontend for reference, but **not** the resume key |
| ProductId | FK → `Products` | |
| CustomerId | FK → `Customers`, nullable | Null until either matched to an existing customer or finalized as a new one |
| PrimaryIdentifierType | enum `IdentifierType` | The product's first required identifier |
| PrimaryIdentifierValueHash | string | **This + `ProductId` is the actual resume lookup key** |
| SecondaryIdentifierType | enum `IdentifierType`, nullable | e.g. `PHONE` for Pension/Insurance |
| SecondaryIdentifierValueHash | string, nullable | |
| CurrentStep | enum `DraftStep` | Where the applicant is right now |
| FormDataJson | JSON | Everything captured so far, keyed by field name — see §8 |
| Channel | enum `Channel` | Updated on every save — last channel used |
| Status | enum `DraftStatus` | |
| CreatedAt / LastUpdatedAt | datetime | |
| ExpiresAt | datetime | Recommend 30 days from `CreatedAt` — a draft shouldn't resume forever |

**Unique constraint on `(ProductId, PrimaryIdentifierValueHash)` where `Status = 'IN_PROGRESS'`.** Only one active draft per product per identifier — this is what makes "enter BVN on laptop, come back on phone, same draft comes up" deterministic rather than accidental.

### 3.5 `CustomerProducts`

| Field | Type | Notes |
|---|---|---|
| CustomerProductId | uuid, PK | |
| CustomerId | FK → `Customers` | |
| ProductId | FK → `Products` | |
| DraftId | FK → `DraftApplications`, nullable | Traceability back to the application that created it |
| Status | enum `CustomerProductStatus` | |
| CreatedAt | datetime | |

Unique constraint on `(CustomerId, ProductId)` — adjust only if your product set genuinely allows multiples of the same product per customer (unlikely for MVP scope).

---

## 4. Product-specific detail tables

Created only at finalize, from `FormDataJson`. Kept intentionally light — these exist to show the flow completes into a real product record, not to model every real-world field.

### 4.1 `SavingsAccountDetails`

| Field | Type |
|---|---|
| SavingsAccountId, PK | |
| CustomerProductId, FK | |
| AccountNumber | string(10) |
| Currency | default `NGN` |
| Balance | decimal, default 0 |
| DateOpened | date |
| Status | enum (Active/Dormant/Closed) |

### 4.2 `CurrentAccountDetails`

| Field | Type |
|---|---|
| CurrentAccountId, PK | |
| CustomerProductId, FK | |
| AccountNumber | string(10) |
| Currency | default `NGN` |
| Balance | decimal, default 0 |
| ChequeBookRequested | bool |
| DateOpened | date |
| Status | enum |

### 4.3 `PensionAccountDetails`

| Field | Type |
|---|---|
| RsaAccountId, PK | |
| CustomerProductId, FK | |
| RsaPin | string — mock-generated for demo |
| PfaName | default `Stanbic IBTC Pension Managers Limited` |
| EmployerName | string, nullable |
| ContributionScheme | enum (`MandatoryCPS`/`Voluntary`/`MicroPensionPlan`) |
| DateRegistered | date |
| Status | enum |

### 4.4 `StockbrokingAccountDetails` *(stub — future product, not built this round)*

| Field | Type |
|---|---|
| StockbrokingAccountId, PK | |
| CustomerProductId, FK | |
| CscsAccountNumber | string, mock |
| RiskProfile | string |

### 4.5 `InsuranceAccountDetails` *(stub — future product, not built this round)*

| Field | Type |
|---|---|
| InsurancePolicyId, PK | |
| CustomerProductId, FK | |
| PolicyNumber | string, mock |
| PolicyType | string |

Adding a real 4th/5th product later means: one row in `Products`, one detail table like the above, no changes to `DraftApplications`, `CustomerIdentifiers`, or the lookup logic in §6.

---

## 5. Supporting tables

### 5.1 `SecurityChecks`

| Field | Type | Notes |
|---|---|---|
| SecurityCheckId, PK | | |
| DraftId, FK → `DraftApplications` | | |
| CheckType | enum `SecurityCheckType` | |
| Status | enum `SecurityCheckStatus` | |
| CreatedAt / CompletedAt | datetime | |

Mocked — `POST` to complete a check just writes `Status = PASSED` (or fails ~1-in-N if you want a demo-able failure path). This is what fires when `IDENTITY_CHECK` finds an existing customer trying to add a new product.

### 5.2 `ConsentLog`

| Field | Type | Notes |
|---|---|---|
| ConsentId, PK | | |
| CustomerId, FK | | |
| ProductId, FK | | |
| ConsentType | string, e.g. `REUSE_KYC_DATA` | |
| GrantedAt | datetime | |
| Channel | enum `Channel` | |

Cheap to build, closes the exact compliance gap flagged earlier: don't silently reuse a customer's KYC across products without one explicit "yes, use my details for this" click.

---

## 6. The core lookup logic (this is the actual thing Emmanuel and Anu build)

```
POST /applications/start
  input: { productCode, primaryIdentifierValue, secondaryIdentifierValue?, channel }

  1. Look up Products by productCode → get RequiredIdentifiers
  2. hash(primaryIdentifierValue), hash(secondaryIdentifierValue) if present

  3. Look for an existing DraftApplications row:
       WHERE ProductId = X AND PrimaryIdentifierValueHash = hash AND Status = 'IN_PROGRESS'
     → FOUND: return it as-is (isResumed = true), with FormDataJson + CurrentStep intact

  4. NOT FOUND — check CustomerIdentifiers:
       WHERE IdentifierType = primaryType AND IdentifierValueHash = hash
       (and secondary, if the product requires one)
     → MATCHED an existing Customer:
         create new DraftApplications row, CustomerId = matched customer,
         CurrentStep = PRODUCT_SPECIFIC_INFO (personal info already exists — skip it)
         response: { isExistingCustomer: true, requiresSecurityCheck: true }
     → NO MATCH:
         create new DraftApplications row, CustomerId = null,
         CurrentStep = PERSONAL_INFO
         response: { isExistingCustomer: false, requiresSecurityCheck: false }

PUT /applications/{draftId}/save
  input: { currentStep, formData, channel }
  → update DraftApplications.FormDataJson, CurrentStep, Channel, LastUpdatedAt

POST /applications/{draftId}/security-check
  input: { checkType }
  → mock: insert SecurityChecks row, Status = PASSED

POST /applications/{draftId}/finalize
  1. IF DraftApplications.CustomerId IS NULL:
       create Customers row from FormDataJson
       create CustomerIdentifiers row(s) for the identifier(s) used on this draft
  2. create CustomerProducts row (CustomerId, ProductId, DraftId, Status = ACTIVE)
  3. create the matching product detail row (SavingsAccountDetails / PensionAccountDetails / etc.)
     from FormDataJson
  4. set DraftApplications.Status = SUBMITTED
  → response includes the generated account reference (account number / RSA PIN / etc.)
```

This is not the full API spec (endpoint auth, error codes, pagination — not needed for a demo), just enough to pin down exactly what each table is for. If you want the full contract fleshed out (request/response shapes for every field), that's a quick follow-up once this is agreed.

---

## 7. TypeScript interfaces (for the frontend build)

```typescript
interface Product {
  productId: string;
  productCode: "SAVINGS" | "CURRENT" | "PENSION_RSA" | "STOCKBROKING" | "INSURANCE";
  productName: string;
  requiredIdentifiers: ("BVN" | "NIN" | "EMAIL" | "PHONE")[];
}

interface StartApplicationRequest {
  productCode: string;
  primaryIdentifierValue: string;
  secondaryIdentifierValue?: string;
  channel: "WEB" | "MOBILE" | "USSD" | "BRANCH_ASSISTED";
}

interface StartApplicationResponse {
  draftId: string;
  isResumed: boolean;
  isExistingCustomer: boolean;
  requiresSecurityCheck: boolean;
  currentStep: string;       // DraftStep
  formData: Record<string, unknown>;
}

interface SaveDraftRequest {
  currentStep: string;
  formData: Record<string, unknown>;
  channel: string;
}

interface SecurityCheckRequest {
  checkType: "SECURITY_QUESTION" | "FACIAL_RECOGNITION" | "OTP";
}

interface SecurityCheckResponse {
  status: "PASSED" | "FAILED";
}

interface FinalizeApplicationResponse {
  customerId: string;
  customerProductId: string;
  productAccountReference: string; // account number / RSA PIN / policy number
  status: "ACTIVE" | "PENDING";
}
```

---

## 8. Sample `FormDataJson` payloads by product

**Savings (`PERSONAL_INFO` + `PRODUCT_SPECIFIC_INFO` merged for brevity):**
```json
{
  "firstName": "Adaeze",
  "lastName": "Okonkwo",
  "dateOfBirth": "1995-04-12",
  "gender": "FEMALE",
  "address": { "street": "12 Marina Rd", "city": "Lagos", "state": "Lagos" },
  "nextOfKin": { "fullName": "Chidi Okonkwo", "relationship": "Sibling", "phone": "+2348012345678" }
}
```

**Pension — existing customer, so `firstName`/`lastName` are pre-filled from the matched `Customer`, only the delta is new:**
```json
{
  "employerName": "Stanbic IBTC Bank",
  "contributionScheme": "MandatoryCPS",
  "pensionNextOfKin": { "fullName": "Chidi Okonkwo", "relationship": "Sibling" }
}
```

**Stockbroking (future, illustrative only):**
```json
{
  "firstName": "Adaeze",
  "lastName": "Okonkwo",
  "riskProfile": "Moderate"
}
```

---

## 9. What each of the 10 presentation sections should pull from this doc

- **Solution Architecture** → §1 and §6. The engine's identity is "identifier-driven, product-agnostic lookup," not a set of microservices — say that explicitly.
- **Security & Compliance** → §3.2 (`IdentifierValueHash`, never raw BVN/NIN), §5.2 (`ConsentLog`), and name the one gap out loud: resuming a draft by identifier alone (no OTP re-check) is a real production security gap this MVP doesn't close — say it before a judge finds it.
- **Technology Stack** → the frontend has no hardcoded per-product form logic; it reads `RequiredIdentifiers` and `AdditionalFieldsSchema` from `Products`.
- **Risks & Mitigation** → mocked biometrics/OTP, no real NIBSS/NIMC integration, single point of failure in the identity service — all stated as known, intentional MVP scope, not oversights.

---

*Two things to verify with real sources before the panel, not assume: whether PenCom's real BVN mandate for RSA registration (effective Feb 2025) matters for your pitch narrative even though this MVP mocks it, and whether "Blunest" (mentioned in the original team discussion) maps to Stockbroking or a separate investment product in Stanbic's actual app — worth a two-minute check so you don't misname it live.*
