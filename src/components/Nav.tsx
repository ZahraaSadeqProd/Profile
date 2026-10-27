import Link from "next/link";
import Logo, { Arrow, MailIcon, GitHubIcon, LinkedInIcon } from "./Logo";
import { links } from "../content";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="brand" aria-label="Zahraa Sadeq, home">
          <Logo size={34} />
          <span>Zahraa Sadeq</span>
        </Link>
        <nav aria-label="Primary">
          <Link href="/#work">Work</Link>
          <Link href="/#experience" className="hide-xs">Experience</Link>
          <Link href="/#contact" className="hide-xs">Contact</Link>
          <span className="sep" aria-hidden="true" />
          <a href={`mailto:${links.email}`} className="icon" aria-label={`Email ${links.email}`} title={links.email}><MailIcon /></a>
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="icon" aria-label="GitHub" title="GitHub"><GitHubIcon /></a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="icon" aria-label="LinkedIn" title="LinkedIn"><LinkedInIcon /></a>
          <Link href={links.resume} className="resume">
            Résumé <Arrow />
          </Link>
        </nav>
      </div>
      <style jsx>{`
        .nav { position: fixed; inset: 0 0 auto 0; z-index: 50; padding-top: env(safe-area-inset-top, 0px); pointer-events: none; }
        .nav-in { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px max(20px, env(safe-area-inset-right, 0px)) 14px max(20px, env(safe-area-inset-left, 0px)); }
        .nav-in :global(a) { pointer-events: auto; }
        .nav-in :global(.brand) { flex-shrink: 0; display: flex; align-items: center; gap: 10px; font: 700 17px/1 var(--display); letter-spacing: -0.02em; text-decoration: none; background: var(--bone); padding: 4px 12px 4px 4px; border-radius: 10px; }
        nav { display: flex; align-items: center; gap: 4px; background: var(--bone); border-radius: 10px; padding: 4px; }
        nav :global(a) { font-size: 14px; font-weight: 500; text-decoration: none; padding: 8px 12px; border-radius: 7px; transition: background 0.2s; }
        nav :global(a:hover) { background: var(--bone-2); }
        nav :global(.resume) { display: inline-flex; align-items: center; gap: 6px; background: var(--green); color: var(--bone); }
        nav :global(.resume:hover) { background: var(--ink); }
        nav :global(.resume svg) { width: 12px; height: 12px; }
        nav :global(.icon) { display: grid; place-items: center; width: 34px; height: 34px; padding: 0; color: var(--green); }
        nav :global(.icon svg) { width: 16px; height: 16px; }
        .sep { width: 1px; height: 20px; background: var(--line); margin: 0 4px; }
        @media (max-width: 640px) {
          .nav { background: var(--bone); box-shadow: 0 1px 0 var(--line); }
          .nav-in { padding-top: 10px; padding-bottom: 10px; gap: 8px; }
          .sep { display: none; }
          nav :global(.icon) { width: 30px; }
          .nav-in :global(.brand span) { display: none; }
          .nav-in :global(.brand) { padding: 4px; }
          nav :global(a:not(.resume)) { padding: 8px 8px; font-size: 13px; }
        }
        @media (max-width: 480px) {
          nav :global(a.hide-xs) { display: none; }
          nav { gap: 0; }
        }
      `}</style>
    </header>
  );
}
