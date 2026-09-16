import type {DraftDocument} from "@/app/_types";
import type {DocumentSlotConfig} from "@/app/_constants";

/** Schema field names the product-info UI uses → DraftFormData names the BE persists. */
const SCHEMA_TO_BACKEND: Record<string, string> = {
  branchPreference: "preferredBranch",
  chequeBookRequested: "checkBookRequested",
};

/** Map schema-driven product fields onto names the backend save DTO understands. */
export function toBackendProductFormData(
  values: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    out[SCHEMA_TO_BACKEND[key] ?? key] = value;
  }
  return out;
}

/** Read a schema field from cache, falling back to the BE-mapped name after resume. */
export function readSchemaField(cached: Record<string, unknown>, field: string): unknown {
  const backendKey = SCHEMA_TO_BACKEND[field];
  if (cached[field] !== undefined) return cached[field];
  if (backendKey && cached[backendKey] !== undefined) return cached[backendKey];
  return undefined;
}

export function documentsFromCache(
  cached: Record<string, unknown>,
  slots: DocumentSlotConfig[],
): Record<string, string> {
  const docs = Array.isArray(cached.documents) ? (cached.documents as DraftDocument[]) : [];
  const initial: Record<string, string> = {};
  for (const slot of slots) {
    const match = docs.find((doc) => doc.type === slot.label);
    if (match?.url) {
      initial[slot.key] = match.url;
    } else if (typeof cached[slot.key] === "string") {
      initial[slot.key] = cached[slot.key] as string;
    } else {
      initial[slot.key] = "";
    }
  }
  return initial;
}

export function toDocumentsPayload(
  names: Record<string, string>,
  slots: DocumentSlotConfig[],
): {documents: DraftDocument[]} {
  return {
    documents: slots
      .filter((slot) => names[slot.key]?.trim())
      .map((slot) => ({type: slot.label, url: names[slot.key]})),
  };
}

export function withDefaultNationality(formData: Record<string, unknown>): Record<string, unknown> {
  return {...formData, nationality: "Nigerian"};
}
