import Head from "next/head";
import Link from "next/link";
import { useRef } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { useGSAP } from "@gsap/react";
import { Arrow } from "../../components/Logo";
import Contact from "../../components/Contact";
import { projects, type Project } from "../../content";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = { project: Project; next: Pick<Project, "slug" | "name" | "line"> };

export default function CaseStudy({ project: p, next }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".cs-name", { type: "chars", mask: "chars" });
        gsap.from(split.chars, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.03 });
        gsap.from(".cs-lead > *", { y: 20, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.3 });

        // the pipeline draws itself as it scrolls past
        const rail = root.current?.querySelector<SVGPathElement>(".rail-ink");
        if (rail) {
          gsap.fromTo(rail, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".pipeline", start: "top 70%", end: "bottom 60%", scrub: true } });
        }
        gsap.utils.toArray<HTMLElement>(".step").forEach((step) => {
          ScrollTrigger.create({ trigger: step, start: "top 62%", onEnter: () => step.classList.add("on"), onLeaveBack: () => step.classList.remove("on") });
          gsap.from(step.querySelector(".step-body"), { x: 24, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: step, start: "top 90%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".rise").forEach((el) => {
          gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.current?.querySelectorAll(".step").forEach((s) => s.classList.add("on"));
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [p.slug] }
  );

  return (
    <div ref={root} className="cs">
      <Head>
        <title>{`${p.name} · Zahraa Sadeq`}</title>
        <meta name="description" content={p.line} />
        <meta property="og:title" content={`${p.name} · Zahraa Sadeq`} />
        <meta property="og:description" content={p.line} />
      </Head>

      <header className="cs-head wrap">
        <Link href="/#projects" className="back"><span className="back-arrow"><Arrow /></span> All projects</Link>
        <h1 className="cs-name">{p.name}</h1>
        <div className="cs-lead">
          <p className="cs-line">{p.line}</p>
          <dl className="meta">
            <div><dt>Role</dt><dd>{p.role}</dd></div>
            <div><dt>Status</dt><dd>{p.status}</dd></div>
            <div><dt>Focus</dt><dd className="mono">{p.tags.join(" / ")}</dd></div>
            <div><dt>Live</dt><dd><a href={p.url} target="_blank" rel="noopener noreferrer" className="arrow-link">{p.urlLabel} <Arrow /></a></dd></div>
          </dl>
        </div>
      </header>

      <section className="question">
        <div className="wrap q-in rise">
          <p className="q">{p.question}</p>
          <p className="hand" aria-hidden="true">the question it answers</p>
        </div>
      </section>

      <section className="overview wrap">
        {p.overview.map((para) => <p key={para} className="rise">{para}</p>)}
      </section>

      <section className="pipeline wrap" aria-labelledby="how">
        <h2 id="how" className="rise">How it works</h2>
        <ol className="steps">
          <svg className="rail" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 0 V100" className="rail-bg" />
            <path d="M2 0 V100" className="rail-ink" pathLength={1} />
          </svg>
          {p.pipeline.map((s, i) => (
            <li key={s.id} className={`step${i === p.pipeline.length - 1 ? " last" : ""}`}>
              <span className="dot" aria-hidden="true" />
              <div className="step-body">
                <h3>{s.label}</h3>
                <p>{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="decisions wrap" aria-labelledby="dec">
        <h2 id="dec" className="rise">Decisions that shaped it</h2>
        <div className="dec-list">
          {p.decisions.map((d) => (
            <article key={d.title} className="dec rise">
              <h3>{d.title}</h3>
              <div className="dec-cols">
                <div><p className="lbl">Why</p><p>{d.why}</p></div>
                <div><p className="lbl">How</p><p>{d.how}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stack wrap rise" aria-labelledby="stack-h">
        <h2 id="stack-h">Built with</h2>
        <ul>{p.stack.map((s) => <li key={s} className="mono">{s}</li>)}</ul>
      </section>

      <Link href={`/work/${next.slug}`} className="next">
        <span className="wrap next-in">
          <span className="next-name">{next.name} <Arrow /></span>
          <span className="hand" aria-hidden="true">next project</span>
          <span className="next-line">{next.line}</span>
        </span>
      </Link>

      <Contact />

      <style jsx>{`
        .cs-head { padding-top: calc(140px + env(safe-area-inset-top, 0px)); padding-bottom: 72px; display: grid; gap: 28px; }
        .cs :global(.back) { font-size: 15px; text-decoration: none; color: var(--pencil); justify-self: start; }
        .cs :global(.back:hover) { color: var(--green); }
        .cs :global(.back) { display: inline-flex; align-items: center; gap: 6px; }
        .back-arrow { display: inline-block; width: 12px; height: 12px; transform: rotate(-135deg); }
        .cs-name { font-size: clamp(72px, 15vw, 240px); font-variation-settings: "wdth" 76, "opsz" 96; letter-spacing: -0.05em; line-height: 0.8; color: var(--green); }
        .cs-lead { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 48px; align-items: start; border-top: 2px solid var(--green); padding-top: 26px; }
        .cs-line { font-size: clamp(20px, 2vw, 28px); line-height: 1.35; max-width: 34ch; font-family: var(--display); font-weight: 500; letter-spacing: -0.015em; }
        .meta { margin: 0; display: grid; gap: 10px; }
        .meta div { display: grid; grid-template-columns: 80px 1fr; gap: 16px; align-items: baseline; border-bottom: 1px solid var(--line); padding-bottom: 10px; }
        .meta dt { font-size: 13px; color: var(--pencil); }
        .meta dd { margin: 0; }

        .question { background: var(--green); color: var(--bone); padding: 96px 0; }
        .q-in { display: grid; gap: 14px; }
        .question .hand { color: var(--lime); font-size: 28px; transform: rotate(-2deg); transform-origin: left; }
        .q { font: 700 clamp(30px, 4.2vw, 64px)/1.02 var(--display); font-variation-settings: "wdth" 84, "opsz" 72; letter-spacing: -0.035em; max-width: 22ch; text-wrap: balance; }

        .overview { padding-top: 96px; display: grid; gap: 20px; }
        .overview p { max-width: 64ch; font-size: 19px; }

        .pipeline, .decisions, .stack { padding-top: 120px; display: grid; gap: 40px; }
        .pipeline h2, .decisions h2, .stack h2 { font-size: clamp(42px, 5.5vw, 80px); font-variation-settings: "wdth" 80, "opsz" 96; color: var(--green); }
        .steps { position: relative; list-style: none; margin: 0; padding: 0 0 0 64px; display: grid; gap: 54px; }
        .rail { position: absolute; left: 20px; top: 10px; bottom: 10px; width: 4px; height: calc(100% - 20px); overflow: visible; }
        .rail-bg { stroke: var(--line); stroke-width: 2; fill: none; vector-effect: non-scaling-stroke; }
        .rail-ink { stroke: var(--green); stroke-width: 3; fill: none; stroke-dasharray: 1; stroke-dashoffset: 0; vector-effect: non-scaling-stroke; }
        .step { position: relative; }
        .dot { position: absolute; left: -54px; top: 6px; width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--green); background: var(--bone); transition: background 0.5s var(--ease-out), transform 0.5s var(--ease-out); }
        .step:global(.on) .dot { background: var(--green); transform: scale(1.08); }
        .step.last:global(.on) .dot { background: var(--lime); border-color: var(--green); }
        .step-body { display: grid; gap: 6px; max-width: 60ch; }
        .step h3 { font-size: clamp(26px, 2.6vw, 38px); font-variation-settings: "wdth" 85, "opsz" 48; color: var(--green); }
        .step p { color: var(--ink); }

        .dec-list { display: grid; border-top: 2px solid var(--green); }
        .dec { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 32px; padding: 34px 0; border-bottom: 1px solid var(--line); }
        .dec h3 { font-size: clamp(26px, 2.6vw, 36px); font-variation-settings: "wdth" 85, "opsz" 48; color: var(--green); }
        .dec-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .lbl { font: 500 22px var(--hand); color: var(--green-2); margin-bottom: 4px; }

        .stack ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
        .stack li { border: 1.5px solid var(--green); color: var(--green); border-radius: 999px; padding: 8px 14px; font-size: 14px; }

        .cs :global(.next) { display: block; margin-top: 140px; background: var(--bone-2); text-decoration: none; padding: 80px 0; transition: background 0.3s; }
        .cs :global(.next:hover) { background: #d8cfba; }
        .next-in { display: grid; gap: 10px; }
        .next-in .hand { font-size: 26px; }
        .next-name { display: inline-flex; align-items: center; gap: 0.25em; font: 800 clamp(48px, 8vw, 128px)/0.9 var(--display); font-variation-settings: "wdth" 78, "opsz" 96; letter-spacing: -0.045em; color: var(--green); }
        .next-name :global(svg) { width: 0.5em; height: 0.5em; transition: transform 0.4s var(--ease-out); }
        .cs :global(.next:hover) .next-name :global(svg) { transform: translate(6px, -6px); }
        .next-line { max-width: 60ch; color: var(--pencil); }

        @media (max-width: 860px) {
          .cs-lead, .dec, .dec-cols { grid-template-columns: 1fr; gap: 20px; }
          .steps { padding-left: 52px; gap: 40px; }
          .rail { left: 12px; }
          .dot { left: -50px; }
        }
      `}</style>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const i = projects.findIndex((p) => p.slug === params?.slug);
  const n = projects[(i + 1) % projects.length];
  return { props: { project: projects[i], next: { slug: n.slug, name: n.name, line: n.line } } };
};
