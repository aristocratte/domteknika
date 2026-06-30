import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Typed navigation helpers bound to the routing config.
 * Use these `<Link>` / `useRouter` / `usePathname` / `redirect` instead of the
 * ones from `next/navigation` so locale prefixes are handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
