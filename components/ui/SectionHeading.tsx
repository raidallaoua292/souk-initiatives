import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-bold text-accent">{eyebrow}</span>
      )}
      <h2 className="text-2xl font-extrabold text-dark sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 leading-relaxed text-dark/70">{description}</p>}
    </div>
  );
}
