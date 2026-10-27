import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { useGSAP } from "@gsap/react";
import { CHAPTERS, story, range } from "../components/scene/story";
import { Arrow } from "../components/Logo";
import Contact from "../components/Contact";
import { intro, links, projects, sappers, raytheon, education } from "../content";

const Workbench = dynamic(() => import("../components/scene/Workbench"), { ssr: false });

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const [nesvia, swazona] = projects;
const vh = (id: string) => CHAPTERS.find((c) => c.id === id)!.vh;

function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const webgl = useWebGL();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      story.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroEnd = range("hero")[1];

      ScrollTrigger.create({
        trigger: ".story",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          story.target = self.progress;
          if (story.reduced) story.p = self.progress;
          // the scene opens out of its hero frame into the full viewport
          const t = Math.min(1, self.progress / heroEnd);
          const e = 1 - Math.pow(1 - t, 3);
          stage.current?.style.setProperty("--open", String(e));
          story.open = e;
          root.current?.style.setProperty("--open", String(e));
        },
        onToggle: (self) => {
          story.active = self.isActive || self.progress < 1;
        },
      });
      ScrollTrigger.create({
        trigger: ".after",
        start: "top 10%",
        onEnter: () => { story.active = false; },
        onLeaveBack: () => { story.active = true; },
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-name", { type: "chars", mask: "chars" });
        gsap.from(split.chars, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.035, delay: 0.15 });

        gsap.utils.toArray<HTMLElement>(".panel").forEach((panel) => {
          const head = panel.querySelector("h2");
          if (head) {
            const s = SplitText.create(head, { type: "lines", mask: "lines" });
            gsap.from(s.lines, { yPercent: 105, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: panel, start: "top 80%" } });
          }
          // hand over cleanly: each panel leaves before the next chapter's panel arrives
          if (window.matchMedia("(min-width: 861px)").matches) {
            gsap.to(panel, { autoAlpha: 0, y: -24, ease: "none", scrollTrigger: { trigger: panel.parentElement, start: "bottom 105%", end: "bottom 80%", scrub: true } });
          }
          gsap.from(panel.querySelectorAll(".reveal"), { y: 16, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: panel, start: "top 75%" } });
        });

        gsap.utils.toArray<HTMLElement>(".after .rise").forEach((el) => {
          gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        });
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <Head>
        <title>Zahraa Sadeq · AI/ML Engineer</title>
        <meta name="description" content="Zahraa Sadeq is an AI/ML engineer who builds AI products end to end: Nesvia and Swazona Media. Sr. Software Engineer at Sappers Group, formerly embedded C/C++ at Raytheon." />
        <meta property="og:title" content="Zahraa Sadeq · AI/ML Engineer" />
        <meta property="og:description" content={intro} />
      </Head>

      <div ref={stage} className="stage" aria-hidden="true">
        <div className="stage-frame">{webgl ? <Workbench /> : <div className="stage-fallback" />}</div>
      </div>

      <div className="story">
        <section className="ch ch-hero" style={{ height: `${vh("hero")}vh` }}>
          <div className="hero-top wrap">
            <h1 className="hero-name">Zahraa Sadeq</h1>
          </div>
          <p className="scroll-cue">Scroll to step inside the work</p>
        </section>

        <section className="ch" style={{ height: `${vh("shoulder")}vh` }} aria-hidden="true" />

        <section className="ch" style={{ height: `${vh("sappers")}vh` }}>
          <article className="panel">
            <h2>{sappers.org}</h2>
            <p className="reveal">{sappers.summary}</p>
            <dl className="facts reveal">
              <div><dt>Role</dt><dd>{sappers.role}, {sappers.org}</dd></div>
              <div><dt>Years</dt><dd className="mono">{sappers.years}</dd></div>
              <div><dt>Stack</dt><dd className="mono">{sappers.stack.join(" / ")}</dd></div>
            </dl>
            <Link href="#experience" className="arrow-link reveal">What I do there <Arrow /></Link>
          </article>
        </section>

        <section className="ch" style={{ height: `${vh("raytheon")}vh` }}>
          <article className="panel">
            <h2>{raytheon.org}</h2>
            <p className="reveal">{raytheon.summary}</p>
            <dl className="facts reveal">
              <div><dt>Role</dt><dd>{raytheon.role}, {raytheon.org}</dd></div>
              <div><dt>Years</dt><dd className="mono">{raytheon.years}</dd></div>
              <div><dt>Stack</dt><dd className="mono">{raytheon.stack.join(" / ")}</dd></div>
            </dl>
            <Link href="#experience" className="arrow-link reveal">What I did there <Arrow /></Link>
          </article>
        </section>

        <section className="ch" style={{ height: `${vh("nesvia")}vh` }}>
          <ProjectPanel p={nesvia} hand="founder, sole engineer" />
        </section>

        <section className="ch" style={{ height: `${vh("swazona")}vh` }}>
          <ProjectPanel p={swazona} hand="co-built with a small team" />
        </section>

        <section className="ch" style={{ height: `${vh("finale")}vh` }} aria-hidden="true" />
      </div>

      <div className="after">
        <section id="experience" className="exp wrap" aria-labelledby="exp-h">
          <h2 id="exp-h" className="rise">Experience</h2>
          <div className="exp-jobs">
            {[sappers, raytheon].map((j) => (
              <div key={j.org} className="exp-job rise">
                <div className="exp-title">
                  <h3>{j.org}</h3>
                  <p>{j.role} <span className="dot" aria-hidden="true">·</span> <span className="mono">{j.years}</span></p>
                </div>
                <ul>
                  {j.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="work-index wrap" aria-labelledby="work-h">
          <h2 id="work-h" className="rise">Selected work</h2>
          <ol className="work-list">
            {projects.map((p) => (
              <li key={p.slug} className="rise">
                <Link href={`/work/${p.slug}`} className="work-row">
                  <span className="work-name">{p.name}</span>
                  <span className="work-line">{p.line}</span>
                  <span className="work-meta mono">{p.role} · {p.tags.join(" / ")}</span>
                  <span className="work-go" aria-hidden="true"><Arrow /></span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section id="education" className="edu wrap" aria-labelledby="edu-h">
          <h2 id="edu-h" className="rise">Education</h2>
          <ul className="edu-list">
            {education.map((e) => (
              <li key={e.degree} className="rise">
                <strong>{e.degree}</strong>
                <span>{e.school}</span>
                <span className="mono">{e.years} · {e.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <Contact />
      </div>

      <style jsx>{`
        .stage { position: fixed; inset: 0; z-index: 0; --open: 0; }
        .stage-frame {
          position: absolute;
          inset: 0;
          /* the frame opens with a clip, so the canvas never resizes while scrolling */
          clip-path: inset(calc((1 - var(--open)) * 50svh) calc((1 - var(--open)) * 20px) calc((1 - var(--open)) * 20px) round calc((1 - var(--open)) * 14px));
          background: #efe9dc;
        }
        .stage-fallback { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent 0 23px, var(--line) 23px 24px), var(--bone-2); }
        .story { position: relative; z-index: 1; }
        .ch { position: relative; pointer-events: none; }
        .ch :global(a), .ch :global(button) { pointer-events: auto; }

        .ch-hero { display: flex; flex-direction: column; }
        .hero-top { opacity: calc(1 - var(--open, 0) * 1.6); position: sticky; top: 0; padding-top: calc(70px + env(safe-area-inset-top, 0px)); height: 50svh; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 22px; }
        .hero-name { font-size: clamp(56px, 18.5vw, 300px); font-variation-settings: "wdth" 78, "opsz" 96; letter-spacing: -0.045em; line-height: 0.8; color: var(--green); white-space: nowrap; }
        .scroll-cue { opacity: calc(1 - var(--open, 0) * 3); position: absolute; top: calc(100svh - 66px); left: max(40px, calc(env(safe-area-inset-left, 0px) + 40px)); color: var(--bone); background: var(--green); padding: 7px 12px; border-radius: 999px; font-size: 14px; font-weight: 500; }

        .after { position: relative; z-index: 2; background: var(--bone); padding-top: 120px; }
        .work-index { display: grid; gap: 28px; }
        .work-index h2, .exp h2, .edu h2 { font-size: clamp(48px, 7vw, 104px); font-variation-settings: "wdth" 80, "opsz" 96; color: var(--green); }
        .work-list { list-style: none; margin: 0; padding: 0; border-top: 2px solid var(--green); }
        .work-list li { border-bottom: 1px solid var(--line); }
        .work-index :global(.work-row) { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr) 48px; grid-template-areas: "name line go" "name meta go"; gap: 6px 32px; padding: 34px 0; text-decoration: none; align-items: center; }
        .work-index :global(.work-name) { grid-area: name; font: 800 clamp(40px, 5.4vw, 84px)/0.9 var(--display); font-variation-settings: "wdth" 80, "opsz" 96; letter-spacing: -0.04em; color: var(--green); transition: transform 0.5s var(--ease-out); }
        .work-index :global(.work-line) { grid-area: line; font-size: 18px; max-width: 52ch; }
        .work-index :global(.work-meta) { grid-area: meta; color: var(--pencil); }
        .work-index :global(.work-go) { grid-area: go; width: 48px; height: 48px; border: 1.5px solid var(--green); border-radius: 50%; display: grid; place-items: center; color: var(--green); transition: background 0.3s, color 0.3s; }
        .work-index :global(.work-go svg) { width: 18px; height: 18px; }
        .work-index :global(.work-row:hover .work-name) { transform: translateX(10px); }
        .work-index :global(.work-row:hover .work-go) { background: var(--green); color: var(--bone); }

        .exp { padding-bottom: 140px; display: grid; gap: 40px; }
        .exp-jobs { display: grid; gap: 56px; border-top: 2px solid var(--green); padding-top: 32px; }
        .exp-title { display: grid; gap: 6px; margin-bottom: 20px; }
        .exp-title p { font-weight: 600; color: var(--ink); }
        .exp-title .mono { font-size: 14px; font-weight: 500; color: var(--pencil); }
        .exp-title .dot { color: var(--green-2); margin: 0 4px; }
        .exp h3 { font-size: 32px; font-variation-settings: "wdth" 85, "opsz" 48; color: var(--green); }
        .exp-job ul { margin: 0; padding-left: 20px; display: grid; gap: 12px; max-width: 76ch; }
        .exp-job li::marker { color: var(--green-2); }
        .edu { padding-top: 140px; padding-bottom: 140px; display: grid; gap: 40px; }
        .edu-list { list-style: none; margin: 0; padding: 32px 0 0; border-top: 2px solid var(--green); display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 40px 64px; }
        .edu-list li { display: grid; gap: 4px; align-content: start; }
        .edu-list strong { font: 800 28px/1.05 var(--display); font-variation-settings: "wdth" 85, "opsz" 48; letter-spacing: -0.03em; color: var(--green); margin-bottom: 6px; }
        .edu-list span { color: var(--pencil); }

        @media (max-width: 860px) {
          .ch { display: flex; flex-direction: column; }
          .work-index :global(.work-row) { grid-template-columns: minmax(0, 1fr) 44px; grid-template-areas: "name go" "line line" "meta meta"; }
        }
        @media (max-width: 520px) {
          .hero-name { font-size: 18vw; white-space: normal; }
          .hero-top { height: 50svh; }

        }
      `}</style>
    </div>
  );
}

function ProjectPanel({ p, hand }: { p: (typeof projects)[number]; hand: string }) {
  return (
    <article className="panel">
      <h2>{p.name}</h2>
      <p className="hand reveal" aria-hidden="true">{hand}</p>
      <p className="reveal">{p.line}</p>
      <p className="reveal panel-note">{p.decisions[0].title}. {p.decisions[0].how}</p>
      <dl className="facts reveal">
        <div><dt>Role</dt><dd>{p.role}</dd></div>
        <div><dt>Stack</dt><dd className="mono">{p.stack.slice(0, 4).join(" / ")}</dd></div>
      </dl>
      <div className="cta-row reveal">
        <Link href={`/work/${p.slug}`} className="arrow-link">Read the case study <Arrow /></Link>
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="arrow-link">{p.urlLabel} <Arrow /></a>
      </div>
    </article>
  );
}
