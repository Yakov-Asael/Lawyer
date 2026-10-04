import { site } from "@content";
import { cn } from "@/lib/utils";

/** Name + "עורך דין ונוטריון · חדרה". Links to the top of the page, or home ("/") from other pages. */
export function Brand({ href = "#", className }: { href?: string; className?: string }) {
  const { office } = site;
  return (
    <a href={href} className={cn("flex flex-col leading-[1.1] text-on-dark no-underline", className)}>
      <span className="font-serif text-[19px] font-bold tablet:text-[21px]">{office.shortName}</span>
      <span className="mt-1 text-[12.5px] tracking-[0.04em] text-on-dark-soft">
        {office.title} · {office.city}
      </span>
    </a>
  );
}
