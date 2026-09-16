/**
 * Minimal debounce helper — used for Screen 3's autosave-on-blur so a burst
 * of field edits collapses into a single PUT /save call.
 *
 * Exposes `.cancel()` so a step-transition save (Continue / Save-and-
 * continue-later) can drop a still-pending autosave before firing its own —
 * every save's response gets merged into the shared per-draft query cache
 * (see useSaveDraft), which ApplyProductClient reactively copies into
 * currentStep; an in-flight autosave from the PREVIOUS step resolving after
 * the transition save would silently revert `currentStep` back.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs: number,
): ((...args: Args) => void) & {cancel: () => void} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
  debounced.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = undefined;
  };
  return debounced;
}
