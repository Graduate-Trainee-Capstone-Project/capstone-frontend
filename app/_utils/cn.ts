/** Tiny classnames joiner — avoids pulling in `clsx`/`tailwind-merge` for a UI kit this small. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
