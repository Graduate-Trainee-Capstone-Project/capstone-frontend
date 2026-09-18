export function displayAccountReference(raw: string): string {
  return raw.trim();
}

export const ALREADY_COMPLETED_MESSAGE =
  "This application was already completed (including on another channel). You can start a different product, or close this page.";

export function isAlreadyCompletedMessage(message: string): boolean {
  return /already submitted|not in progress|already completed/i.test(message);
}
