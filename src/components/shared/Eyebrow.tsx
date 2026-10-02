import { cn } from "@/lib/utils";

/** Small label above a section heading (spec 01): brass-deep on light grounds, brass on dark. */
export function Eyebrow({ className, ...props }: React.ComponentPropsWithoutRef<"span">) {
  return <span className={cn("inline-block type-eyebrow text-brass-deep on-dark:text-brass", className)} {...props} />;
}
