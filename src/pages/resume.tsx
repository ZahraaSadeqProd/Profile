import Head from "next/head";
import { resume as r, files, SITE } from "../resume";
import { links } from "../content";

// One document, three outputs: this page for search and for reading, the PDF printed from it, and the .docx that
// applicant tracking systems parse best. So the markup stays plain on purpose: one column, real headings, real lists,
// text in reading order, no tables or text boxes.

const TITLE = "Zahraa Sadeq · Résumé · AI/ML Engineer";
const DESCRIPTION =
  "Résumé of Zahraa Sadeq, AI/ML engineer: LLM APIs, AI agents and RAG at Sappers Group, builder of Nesvia and Swazona Media, and five years of embedded C/C++ at Raytheon. M.S. ECE, University of Arizona.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE}/resume`,
  name: TITLE,
  mainEntity: {
    "@type": "Person",
    name: r.name,
    jobTitle: "AI/ML Engineer",
    url: SITE,
    email: `mailto:${r.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Tucson", addressRegion: "AZ", addressCountry: "US" },
    worksFor: { "@type": "Organization", name: "Sappers Group" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Arizona" },
    knowsAbout: ["Machine learning", "Large language models", "AI agents", "Retrieval-augmented generation", "Computer vision", "Python", "C++", "AWS", "Kubernetes", "Embedded systems"],
    knowsLanguage: r.spoken,
    sameAs: [links.linkedin, links.github],
  },
};

// a real " | " in the text, so it survives in the PDF text layer and the .docx; the spacing around it is CSS
const Sep = () => <span className="sep"> | </span>;

export default function Resume() {
  return (
    <div className="resume-page">
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={`${SITE}/resume`} />
        <link rel="alternate" type="application/pdf" href={`${SITE}${files.pdf}`} title="Résumé (PDF)" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE}/resume`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="actions">
        <a href={files.pdf} download className="btn">Download PDF</a>
        <a href={files.docx} download className="btn ghost">Word (.docx)</a>
      </div>

      <article className="doc" id="resume">
        <header>
          <h1>{r.name}</h1>
          <p className="contact">
            <a href={`tel:${r.phone.replace(/\D/g, "")}`}>{r.phone}</a><Sep /><a href={`mailto:${r.email}`}>{r.email}</a><Sep /><a href={`https://${r.linkedin}`}>{r.linkedin}</a><Sep />{r.location}
          </p>
        </header>


        <section>
          <h2>Experience</h2>
          {r.jobs.map((j) => (
            <div className="entry" key={j.role + j.start}>
              <h3>{j.role}, {j.org}</h3>
              <p className="when">{j.place} | {j.dates}</p>
              <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          {r.projects.map((p) => (
            <div className="entry" key={p.name}>
              <h3>{p.name}{p.url && <>, <a href={`https://${p.url}`}>{p.url}</a></>}</h3>
              <p className="when">{p.role}{"dates" in p && p.dates ? ` | ${p.dates}` : ""}</p>
              <ul>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <ul className="skills">
            {r.skills.map((s) => <li key={s.label}><strong>{s.label}:</strong> {s.items.join(", ")}</li>)}
            <li><strong>Spoken languages:</strong> {r.spoken.join(", ")}</li>
          </ul>
        </section>

        <section>
          <h2>Education</h2>
          {r.education.map((e) => (
            <div className="entry" key={e.degree}>
              <h3>{e.degree}, {e.school}</h3>
              <p className="when">{e.dates} | {e.note}</p>
            </div>
          ))}
        </section>

      </article>

      <style jsx>{`
        .resume-page { padding: calc(96px + env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) 96px max(16px, env(safe-area-inset-left, 0px)); }
        .actions { max-width: 816px; margin: 0 auto 20px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; }
        .btn { display: inline-flex; align-items: center; padding: 10px 16px; border-radius: 999px; background: var(--green); color: var(--bone); font-weight: 600; font-size: 15px; text-decoration: none; border: 1.5px solid var(--green); }
        .btn:hover { background: var(--ink); border-color: var(--ink); }
        .btn.ghost { background: transparent; color: var(--green); }
        .btn.ghost:hover { background: var(--green); color: var(--bone); }

        /* the sheet: a US Letter page, 8.5in wide at 96px/in */
        .doc { max-width: 816px; margin: 0 auto; background: #fff; color: #111; padding: 56px 64px; border: 1px solid rgba(0, 0, 0, 0.12); box-shadow: 0 24px 48px -32px rgba(0, 0, 0, 0.35); font-size: 14.5px; line-height: 1.5; }
        .doc :global(a) { text-decoration: none; }
        .doc :global(a:hover) { text-decoration: underline; }
        header { text-align: center; }
        h1 { font-family: var(--body); font-size: 34px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.1; }
        .contact { margin-top: 6px; font-size: 14px; color: #111; overflow-wrap: anywhere; }
        .sep { white-space: pre; color: #999; margin: 0 2px; }
        section { margin-top: 20px; }
        h2 { font-family: var(--body); font-size: 12.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #111; line-height: 1.2; border-bottom: 1px solid #bbb; padding-bottom: 4px; margin-bottom: 10px; }
        .entry + .entry { margin-top: 12px; }
        h3 { font-family: var(--body); font-size: 15px; font-weight: 700; letter-spacing: 0; line-height: 1.35; }
        .when { font-size: 13px; color: #444; }
        ul { margin: 4px 0 0; padding-left: 18px; }
        li { margin-top: 2px; }
        .skills { list-style: none; padding: 0; }

        @media (max-width: 640px) {
          .doc { padding: 28px 20px; font-size: 14px; }
          h1 { font-size: 28px; }
        }

        @page { size: letter; margin: 0.45in 0.5in; }
        @media print {
          .resume-page { padding: 0; }
          .actions { display: none; }
          .doc { max-width: none; padding: 0; border: 0; box-shadow: none; background: #fff; font-size: 10pt; line-height: 1.32; }
          h1 { font-size: 20pt; }
          .contact { font-size: 10.5pt; margin-top: 2px; }
          .when { font-size: 9.5pt; }
          section { margin-top: 10px; }
          h2 { font-size: 10pt; letter-spacing: 0; margin-bottom: 6px; break-after: avoid; }
          h3 { font-size: 10.5pt; break-after: avoid; }
          .when { break-after: avoid; }
          li { break-inside: avoid; margin-top: 1px; }
          .entry:has(li:nth-child(4)) { break-inside: auto; }
          .entry { break-inside: avoid; }
          .entry + .entry { margin-top: 7px; }
        }
      `}</style>
    </div>
  );
}
