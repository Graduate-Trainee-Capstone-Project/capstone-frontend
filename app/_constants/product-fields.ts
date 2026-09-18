import type {AdditionalField, Product, ProductCode} from "@/app/_types";

const STOCKBROKING_BVN_FIELD: AdditionalField = {
  field: "bvn",
  label: "Bank Verification Number (BVN)",
  type: "text",
  required: true,
};

/**
 * Used when GET /products returns an empty additionalFieldsSchema
 * (Current, Stockbroking, Insurance on the live seed). Applicant-facing
 * extras only — generated account numbers are not form fields.
 */
export const FALLBACK_ADDITIONAL_FIELDS: Partial<Record<ProductCode, AdditionalField[]>> = {
  CURRENT: [
    {
      field: "chequeBookRequested",
      label: "Request a cheque book",
      type: "checkbox",
      required: false,
    },
  ],
  STOCKBROKING: [
    STOCKBROKING_BVN_FIELD,
    {
      field: "bankAccountOption",
      label: "Settlement bank account",
      type: "select",
      options: [
        "Use my Stanbic IBTC account",
        "I'll create a Stanbic IBTC account",
        "Use another bank",
      ],
      required: true,
    },
    {field: "bankName", label: "Bank name", type: "text", required: false},
    {field: "existingBankAccountNumber", label: "Account number", type: "text", required: false},
    {field: "riskProfile", label: "Risk profile", type: "text", required: false},
  ],
  INSURANCE: [
    {
      field: "policyType",
      label: "Policy type",
      type: "select",
      options: ["Life", "Motor", "Home", "Travel"],
      required: true,
    },
  ],
};

export function additionalFieldsFor(product: Product | undefined): AdditionalField[] {
  const fromApi = product?.additionalFieldsSchema;
  const base =
    Array.isArray(fromApi) && fromApi.length > 0
      ? fromApi
      : product
        ? (FALLBACK_ADDITIONAL_FIELDS[product.productCode] ?? [])
        : [];

  if (product?.productCode !== "STOCKBROKING") return base;
  if (base.some((field) => field.field === "bvn")) return base;
  return [STOCKBROKING_BVN_FIELD, ...base];
}
