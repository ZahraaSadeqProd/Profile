import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { Bricolage_Grotesque, Geist, Geist_Mono, Caveat } from "next/font/google";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Nav from "../components/Nav";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display" });
const body = Geist({ subsets: ["latin"], variable: "--font-body" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function App({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const onDone = () => {
      lenis?.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    router.events.on("routeChangeComplete", onDone);
    return () => router.events.off("routeChangeComplete", onDone);
  }, [router]);

  return (
    <div className={`app ${display.variable} ${body.variable} ${mono.variable} ${hand.variable}`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main" key={router.asPath.split("#")[0]} className="page">
        <Component {...pageProps} />
      </main>
      <style jsx global>{`
        .skip-link { position: fixed; left: 12px; top: -60px; z-index: 100; background: var(--ink); color: var(--bone); padding: 10px 14px; border-radius: 4px; }
        .skip-link:focus { top: 12px; }
        .page { animation: page-in 0.7s var(--ease-out) both; }
        @keyframes page-in { from { opacity: 0.001; } }
      `}</style>
    </div>
  );
}
