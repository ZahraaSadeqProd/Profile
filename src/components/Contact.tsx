import Link from "next/link";
import { useState } from "react";
import Logo, { Arrow } from "./Logo";
import { links } from "../content";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  return (
    <footer id="contact" className="contact">
      <div className="wrap in">
        <h2>Want to work together?</h2>
        <p className="hand" aria-hidden="true">open to AI/ML roles</p>
        <div className="mail">
          <a href={`mailto:${links.email}`} className="addr">{links.email}</a>
          <button type="button" onClick={copy} className="copy" aria-live="polite">{copied ? "Copied" : "Copy email"}</button>
        </div>
        <ul className="out">
          <li><Link href={links.resume} className="arrow-link">Résumé <Arrow /></Link></li>
          <li><a href={links.github} target="_blank" rel="noopener noreferrer" className="arrow-link">GitHub <Arrow /></a></li>
          <li><a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="arrow-link">LinkedIn <Arrow /></a></li>
        </ul>
        <div className="sign">
          <Logo size={40} tone="bone" />
          <p>Zahraa Sadeq · AI/ML Engineer · © 2026</p>
        </div>
        <p className="credit">
          Study figure based on{" "}
          <a href="https://sketchfab.com/3d-models/hijabi-girl-0cc2b82c41a34910b362cca61ffb23e6" target="_blank" rel="noopener noreferrer">&ldquo;hijabi girl&rdquo;</a>{" "}
          by <a href="https://sketchfab.com/fatinnajwa" target="_blank" rel="noopener noreferrer">fatinnajwa</a>, licensed under{" "}
          <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>; posed for this site.
        </p>
      </div>
      <style jsx>{`
        .contact { background: var(--green); color: var(--bone); padding: 120px 0 calc(48px + env(safe-area-inset-bottom, 0px)); position: relative; z-index: 2; }
        .in { display: grid; gap: 28px; }
        .hand { color: var(--lime); font-size: 26px; transform: rotate(-2deg); transform-origin: left; }
        h2 { font-size: clamp(48px, 8vw, 128px); font-variation-settings: "wdth" 78, "opsz" 96; letter-spacing: -0.03em; max-width: 14ch; }
        .mail { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
        .addr { font: 600 clamp(22px, 3vw, 38px)/1.1 var(--display); letter-spacing: -0.02em; user-select: all; }
        .copy { font: 600 14px var(--body); background: var(--bone); color: var(--green); border: 0; border-radius: 999px; padding: 10px 18px; cursor: pointer; transition: background 0.2s; }
        .copy:hover { background: var(--lime); }
        .copy:focus-visible { outline-color: var(--lime); }
        .out { list-style: none; display: flex; flex-wrap: wrap; gap: 28px; margin: 8px 0 0; padding: 0; }
        .sign { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px; margin-top: 72px; padding-top: 24px; border-top: 1px solid rgba(239, 233, 220, 0.25); }
        .sign p { opacity: 0.8; font-size: 14px; }
        .credit { opacity: 0.6; font-size: 12px; max-width: 70ch; margin: -12px auto 0; text-align: center; }
        .credit a { text-decoration: underline; text-underline-offset: 2px; }
        .contact :global(:focus-visible) { outline-color: var(--lime); }
        .contact :global(::selection) { background: var(--lime); color: var(--ink); }
      `}</style>
    </footer>
  );
}
