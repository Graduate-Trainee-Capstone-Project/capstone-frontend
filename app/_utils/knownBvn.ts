const STORAGE_KEY = "onboarding-known-bvn";

/**
 * Browser-only BVN memory for this session. The live API never returns a
 * raw BVN (identifiers are hashed), so a later product (e.g. stockbroking)
 * can only pre-fill if this tab already collected the number on an earlier
 * step or product.
 */
export function rememberBvn(bvn: string) {
  if (typeof window === "undefined") return;
  const trimmed = bvn.trim();
  if (!/^\d{11}$/.test(trimmed)) return;
  sessionStorage.setItem(STORAGE_KEY, trimmed);
}

export function rememberedBvn(): string {
  if (typeof window === "undefined") return "";
  const value = sessionStorage.getItem(STORAGE_KEY) ?? "";
  return /^\d{11}$/.test(value) ? value : "";
}
