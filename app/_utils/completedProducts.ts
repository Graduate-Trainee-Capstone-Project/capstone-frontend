import type {ProductCode} from "@/app/_types";

/**
 * Same-tab demo guard for "already have this product".
 * Live POST /applications/start does not reject a second Savings (etc.) on
 * the same BVN — finalize 200s with a fake reference instead. Other devices
 * and a cleared session still walk the full wizard. A real block needs a BE
 * start check.
 */
const STORAGE_KEY = "onboarding-completed-products";

type CompletedMap = Record<string, ProductCode[]>;

function normalizeIdentifier(identifier: string): string {
  return identifier.trim().toUpperCase();
}

function readMap(): CompletedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CompletedMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: CompletedMap) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function hasCompletedProduct(identifier: string, productCode: ProductCode): boolean {
  const key = normalizeIdentifier(identifier);
  if (!key) return false;
  return readMap()[key]?.includes(productCode) ?? false;
}

export function recordCompletedProduct(identifier: string, productCode: ProductCode) {
  const key = normalizeIdentifier(identifier);
  if (!key) return;
  const map = readMap();
  const existing = map[key] ?? [];
  if (existing.includes(productCode)) return;
  map[key] = [...existing, productCode];
  writeMap(map);
}
