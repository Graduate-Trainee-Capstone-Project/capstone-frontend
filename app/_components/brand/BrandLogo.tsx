import Image from "next/image";
import {cn} from "@/app/_utils/cn";

const SRC = {
  white: "/images/logos/stanbic-ibtc-white.png",
  blue: "/images/logos/stanbic-ibtc-blue.png",
  holdings: "/images/logos/stanbic-ibtc-holdings.png",
} as const;

type Variant = keyof typeof SRC;
type Size = "sm" | "md" | "lg";

const WORDMARK_SIZE: Record<Size, {width: number; height: number; className: string}> = {
  sm: {width: 140, height: 35, className: "h-7 w-auto"},
  md: {width: 180, height: 45, className: "h-9 w-auto"},
  lg: {width: 240, height: 60, className: "h-11 w-auto sm:h-12"},
};

const HOLDINGS_SIZE: Record<Size, {width: number; height: number; className: string}> = {
  sm: {width: 56, height: 106, className: "h-16 w-auto"},
  md: {width: 72, height: 136, className: "h-24 w-auto"},
  lg: {width: 96, height: 181, className: "h-32 w-auto"},
};

interface BrandLogoProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({variant = "blue", size = "md", className, priority}: BrandLogoProps) {
  const src = SRC[variant];
  const dims = variant === "holdings" ? HOLDINGS_SIZE[size] : WORDMARK_SIZE[size];

  return (
    <Image
      src={src}
      alt="Stanbic IBTC"
      width={dims.width}
      height={dims.height}
      className={cn("max-w-full object-contain object-left self-start", dims.className, className)}
      priority={priority}
    />
  );
}
