import type { SVGProps } from "react";

/**
 * Custom icons that lucide does not cover (spec 01): stroke 1.8, round caps, currentColor.
 * Decorative by default; the control that holds them carries the accessible name.
 */
function StrokeIcon({ strokeWidth = 1.8, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.3z" />
      <path d="M9 9.2c.3 2.4 2.3 4.5 4.8 5.1l1-1.1 2 .9-.4 1.6c-3.8.3-7.9-3.6-7.8-7.4l1.5-.5 1 1.9z" />
    </StrokeIcon>
  );
}

export function WazeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <StrokeIcon {...props}>
      <path d="M6.5 17.2A8 8 0 1 1 20 11.5c0 2.9-1.8 5.1-4.4 5.9" />
      <path d="M11.2 17.9h1.9" />
      <circle cx="8.6" cy="18.6" r="1.6" />
      <circle cx="15.2" cy="18.6" r="1.6" />
      <circle cx="10" cy="10" r=".6" fill="currentColor" />
      <circle cx="15" cy="10" r=".6" fill="currentColor" />
      <path d="M10 13.2c1.3 1.1 3.6 1.1 5 0" />
    </StrokeIcon>
  );
}
