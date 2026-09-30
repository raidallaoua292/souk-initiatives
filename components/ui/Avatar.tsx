"use client";

import { useState } from "react";
import Image from "next/image";
import { isSafeImageSource } from "@/lib/forms/validators";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-24 w-24 text-3xl",
} as const;

interface AvatarProps {
  name: string;
  /** Tailwind background class used behind the initial, e.g. `bg-primary`. */
  colorClass?: string;
  src?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/** Profile image with an initials fallback (used when there is no image or it fails to load). */
export function Avatar({ name, colorClass = "bg-primary", src, size = "md", className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const initial = name.trim().charAt(0);
  const safeSrc = isSafeImageSource(src) ? src : undefined;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white",
        sizeClasses[size],
        colorClass,
        className,
      )}
      aria-hidden="true"
    >
      {safeSrc && safeSrc !== failedSrc ? (
        <Image
          src={safeSrc}
          alt=""
          fill
          unoptimized
          sizes="96px"
          className="object-cover"
          onError={() => setFailedSrc(safeSrc)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
