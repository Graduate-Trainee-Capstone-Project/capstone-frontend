const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Live stockbroking finalize returns StockBrokingAccountId (a GUID). */
export function displayAccountReference(raw: string): string {
  const trimmed = raw.trim();
  if (!UUID_PATTERN.test(trimmed)) return trimmed;
  return `CSC-${trimmed.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export const ALREADY_COMPLETED_MESSAGE =
  "This application was already completed (including on another channel). You can start a different product, or close this page.";

export function isAlreadyCompletedMessage(message: string): boolean {
  return /already submitted|not in progress|already completed/i.test(message);
}
