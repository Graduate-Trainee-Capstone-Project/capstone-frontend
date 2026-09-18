import type {AdditionalField, Product, ProductCode} from "@/app/_types";

/**
 * Used when GET /products returns an empty additionalFieldsSchema
 * (Current and Insurance on the live seed). Applicant-facing extras only —
 * generated account numbers are not form fields.
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
  if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
  if (!product) return [];
  return FALLBACK_ADDITIONAL_FIELDS[product.productCode] ?? [];
}
