import {cn} from "@/app/_utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Defaults to currentColor so it inherits a button/text color; pass "light" on dark backgrounds. */
  tone?: "current" | "light";
}

const SIZE_MAP: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "size-4 border-2",
  md: "size-5 border-2",
  lg: "size-8 border-[3px]",
};

export function Spinner({size = "md", className, tone = "current"}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full animate-spin border-solid border-t-transparent",
        SIZE_MAP[size],
        tone === "current" ? "border-current" : "border-white",
        className,
      )}
    />
  );
}
