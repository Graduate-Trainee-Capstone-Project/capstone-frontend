/**
 * Minimal debounce helper — used for Screen 3's autosave-on-blur so a burst
 * of field edits collapses into a single PUT /save call.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
}
