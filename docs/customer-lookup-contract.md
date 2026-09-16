# POST /customers/lookup

Frontend contract for the "already a customer?" shortcut. OTP is **not** sent to this API — the UI only requires any 6 digits before calling lookup.

## Request

`POST /customers/lookup`

```json
{
  "identifierType": "BVN",
  "identifierValue": "12345678901"
}
```

`identifierType` is one of `BVN` | `NIN` | `EMAIL` | `PHONE` — the product's first required identifier (often BVN, email for some products).

## Response

**200 — match**

```json
{
  "matched": true,
  "formData": {
    "firstName": "Adaeze",
    "lastName": "Okonkwo"
  }
}
```

**200 — no match**

```json
{
  "matched": false
}
```

Errors: `{ "message": "..." }` (same as the rest of the API).

When this route or shape changes, update `lookupCustomerAction` in `app/_lib/actions/index.ts` and `LookupCustomerRequest` / `LookupCustomerResponse` in `app/_types/index.ts`.
