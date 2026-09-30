import { createElement, type HTMLAttributes } from "react";
import { getIcon } from "@/lib/icon-map";

interface DynamicIconProps extends HTMLAttributes<SVGElement> {
  name: string;
}

/**
 * Renders the Lucide icon matching `name` (see lib/icon-map.ts).
 * Implemented with `createElement` instead of a local `<Icon />` JSX tag so
 * lint tooling doesn't mistake the icon lookup for a component being
 * (re)declared on every render — the resolved icon is always the same
 * stable reference from the icon map.
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  return createElement(getIcon(name), { "aria-hidden": true, ...props });
}
