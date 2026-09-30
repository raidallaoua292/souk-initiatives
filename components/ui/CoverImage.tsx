"use client";

import { useState } from "react";
import Image from "next/image";
import { isSafeImageSource } from "@/lib/forms/validators";
import { DynamicIcon } from "./DynamicIcon";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  /** http(s) URL or local `data:image/...` preview. Falls back to the gradient if missing or broken. */
  src?: string;
  alt: string;
  /** Icon key (see lib/icon-map) shown on the gradient fallback. */
  iconName?: string;
  className?: string;
  iconClassName?: string;
}

/**
 * Cover image with a branded gradient fallback. User-supplied URLs can point
 * at any host, so the image is rendered `unoptimized` (no remotePatterns
 * allow-list needed) and failures degrade to the fallback instead of a broken icon.
 */
export function CoverImage({
  src,
  alt,
  iconName = "leaf",
  className,
  iconClassName = "h-10 w-10",
}: CoverImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Never hand an unvalidated string (e.g. `javascript:`) to the <img> element.
  const safeSrc = isSafeImageSource(src) ? src : undefined;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-dark",
        className,
      )}
    >
      {safeSrc && safeSrc !== failedSrc ? (
        <Image
          src={safeSrc}
          alt={alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          onError={() => setFailedSrc(safeSrc)}
        />
      ) : (
        <DynamicIcon name={iconName} className={cn("text-white/90", iconClassName)} />
      )}
    </div>
  );
}
