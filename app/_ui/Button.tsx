"use client";

import type {ButtonHTMLAttributes, ReactNode} from "react";
import {cn} from "@/app/_utils/cn";
import {Spinner} from "@/app/_ui/Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary-400 text-white hover:bg-primary-700 active:bg-primary-700",
  secondary: "bg-white text-primary-400 border border-primary-400 hover:bg-grey-50",
  ghost: "bg-transparent text-grey-700 hover:bg-grey-100",
  danger: "bg-error-400 text-white hover:bg-error-600",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" tone={variant === "primary" || variant === "danger" ? "light" : "current"} />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  );
}
