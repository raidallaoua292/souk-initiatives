"use client";

import { useSyncExternalStore } from "react";
import { formatDateTime, formatRelativeDateTime } from "@/lib/utils";

const MINUTE = 60_000;

/** Ticks once a minute so "منذ دقيقة" labels stay fresh. */
function subscribe(onChange: () => void): () => void {
  const timer = setInterval(onChange, MINUTE);
  return () => clearInterval(timer);
}

/** The current minute (stable within a minute, so React sees an unchanged snapshot between ticks). */
const getMinute = () => Math.floor(Date.now() / MINUTE);
/** No clock on the server: it renders the absolute date, which the browser then upgrades. */
const getServerMinute = () => null;

interface RelativeTimeProps {
  iso: string;
  className?: string;
}

/**
 * "منذ ٥ دقائق" in the browser; the absolute date on the server and during
 * hydration, so the markup always matches (the server clock never leaks in).
 */
export function RelativeTime({ iso, className }: RelativeTimeProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  return (
    <time dateTime={iso} title={formatDateTime(iso)} className={className}>
      {minute === null ? formatDateTime(iso) : formatRelativeDateTime(iso, minute * MINUTE)}
    </time>
  );
}
