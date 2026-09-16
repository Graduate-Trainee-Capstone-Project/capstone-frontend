import "server-only";
import {getIconData, type IconifyIcon} from "@iconify/utils";
import lucideIcons from "@iconify-json/lucide/icons.json";

/**
 * Resolves a Lucide icon name to its raw icon data at render time (server or
 * client, both read from the same bundled JSON — no network fetch, no
 * `addCollection()` registration). `@iconify/react`'s default API-fetch mode
 * renders empty on the server and populated on the client, which is a
 * guaranteed hydration mismatch; passing resolved icon data straight into
 * `<Icon icon={...}>` sidesteps that entirely.
 */
export function resolveIcon(name: string): IconifyIcon {
  const data = getIconData(lucideIcons, name);
  if (!data) {
    throw new Error(`[resolveIcon] Unknown lucide icon: "${name}"`);
  }
  return data;
}
