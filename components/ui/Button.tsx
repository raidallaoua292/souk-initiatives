import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { href?: undefined };

type ButtonAsLink = SharedProps & {
  href: string;
  target?: string;
  rel?: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-accent text-white hover:bg-accent-dark",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-primary/10",
  inverse: "bg-white text-primary hover:bg-white/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-base px-5 py-2.5 gap-2",
  lg: "text-lg px-7 py-3.5 gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      {icon && iconPosition === "start" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && <span className="shrink-0">{icon}</span>}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, target, rel } = rest;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
