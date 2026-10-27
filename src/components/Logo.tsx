import { useId } from "react";
import { VIEWBOX, LEFT_AT, LEFT, RIGHT } from "../logo";

// The original Z, recoloured: a deep-to-light green gradient on bone, or solid bone on the green footer.
export default function Logo({ size = 36, tone = "green" }: { size?: number; tone?: "green" | "bone" }) {
  const id = useId().replace(/:/g, "");
  const fill = tone === "green" ? `url(#${id})` : "var(--bone)";
  const edge = tone === "green" ? "rgba(13, 110, 67, 0.3)" : "rgba(184, 224, 122, 0.45)";
  return (
    <svg width={size} height={size} viewBox={VIEWBOX} aria-hidden="true">
      {tone === "green" && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a4a2e" />
            <stop offset="0.4" stopColor="#0d6e43" />
            <stop offset="0.7" stopColor="#1f9a5e" />
            <stop offset="1" stopColor="#7cc97a" />
          </linearGradient>
        </defs>
      )}
      <g fill={fill} stroke={edge} strokeWidth="24" paintOrder="stroke">
        <path d={LEFT} transform={LEFT_AT} />
        <path d={RIGHT} />
      </g>
    </svg>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
      <path d="m2.5 4.5 5.5 4.25 5.5-4.25" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0Zm1.9 6v7h2.2V6H3.4Zm1.1-3.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM7 6v7h2.2V9.4c0-1 .5-1.6 1.3-1.6.8 0 1.2.6 1.2 1.6V13h2.2V9c0-2-1.1-3.1-2.7-3.1-1 0-1.7.5-2 1V6H7Z" />
    </svg>
  );
}
