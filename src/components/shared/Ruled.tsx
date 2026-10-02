import { cn } from "@/lib/utils";

/** The ruled legal-pad texture behind dark grounds. Parent needs `relative isolate`. */
export function Ruled({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("ruled", className)} />;
}
