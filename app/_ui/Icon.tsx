import {Icon as IconifyIcon} from "@iconify/react";
import {resolveIcon} from "@/app/_lib/icons";

interface IconProps {
  /** Accepts either "lucide:name" or a bare "name" — only the Lucide set is bundled. */
  icon: string;
  className?: string;
}

/**
 * Thin wrapper around `@iconify/react`'s `Icon` that resolves icon data from
 * the locally bundled Lucide set (see `_lib/icons.ts`) instead of `@iconify/react`'s
 * default API-fetch mode, which renders differently on the server vs. the
 * client and causes hydration mismatches.
 */
export function Icon({icon, className}: IconProps) {
  const name = icon.includes(":") ? icon.split(":")[1] : icon;
  return <IconifyIcon icon={resolveIcon(name)} className={className} />;
}
