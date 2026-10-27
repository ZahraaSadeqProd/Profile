# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Hiring managers and recruiters** evaluating Zahraa Sadeq for an AI/ML engineering role. They skim on a laptop between candidates, want proof of shipped AI systems, and need the résumé, GitHub and LinkedIn one click away.
- **Prospective clients and collaborators** who might hire or partner with her on AI products. They want to see what she has built, how it works, and how to reach her.

## Product Purpose

zahraasadeq.dev is Zahraa Sadeq's personal site. It positions her as an AI/ML Engineer who ships AI products end to end, shows her two most recent products as case studies, and keeps her background (Raytheon, University of Arizona) and contact routes intact. Success: a visitor understands what she builds within the first viewport and reaches a case study, the résumé, or email.

## Positioning

An engineer with five years of mission-critical embedded C/C++ work at Raytheon (VxWorks/RTOS, SIL/HIL testing, Google Test) who now builds production AI systems: scoring engines over public science data, vision models reading product labels, and multi-agent orchestration. The rigor of defense-grade testing applied to AI products.

## Capabilities and Constraints

- Stack: Next.js 16 (pages router), React 19, Tailwind 3, deployed on Netlify with Netlify DNS for zahraasadeq.dev. Repo: `ZahraaSadeqProd/Profile`.
- Featured products (and only these two): **Nesvia** and **Swazona Media**. The earlier Angular To-Do project is dropped from the site.
- Live links and architecture details may be published for both products.

## Brand Commitments

- Green is the personal color (confirmed 2026-10-16); the old pink/rose identity is retired, not carried forward.
- The "Z" logo (`public/logo.svg`, currently a pink-to-amber gradient) gets redrawn in the new green palette as part of the redesign.
- Editorial, bold expressive typography and scroll-driven animation were requested.

## Evidence on Hand

- **Nesvia** — https://nesvia.app. Zahraa is founder and sole builder. Mobile-first app that reads every label in your home, scores each product against public science, and tells you what to swap first. Expo (React Native) app + FastAPI/Postgres backend. Real scoring engine; data from Open Food Facts, Open Beauty Facts, USDA FoodData Central, PubChem, EPA CompTox and openFDA recalls; a vision model reads products off a photo. Loop: onboarding → audit → Home/Personal Score → journey → scan → swap → score moves. Voice: "We don't guess. We cite." Source: `~/Repo/nesvia/PRODUCT.md`, `README.md`, `brand/`.
- **Swazona Media** — https://swazona.media. Zahraa is a co-builder (team build). Arabic-first AI marketing agency for MENA SMBs: an AI agent team (Strategist, Auditor, Content Planner, Copywriter, Designer with RTL compositor + FLUX, Motion Designer, Media Buyer under a dry-run-by-default budget envelope, Analyst, SEO/AEO, Account Manager chat) runs a month of marketing with client approval on every post. Orchestrator is a Postgres state machine, not an LLM; agents are stateless workers returning structured artifacts; every transition appends an event, so the audit trail is the transparency feature. Taskiq workers, SSE streaming. Source: `~/Repo/swazona-media/README.md`, `PRODUCT.md`.
- **Experience** — Software Engineer II, Raytheon, 2020–2025 (bullets in `src/pages/index.tsx` history).
- **Education** — M.S. ECE, University of Arizona, 2020–2022, GPA 3.8; B.S. ECE, University of Arizona, 2015–2020. Certifications: IBM Full-Stack Web Development (2026), Coursera/Edureka Mastering Angular (2026), Mosh Complete Node.js (2025); certificate links on Google Drive.
- **Contact** — zkarem12@gmail.com, github.com/ZahraaSadeqProd, linkedin.com/in/zahraa-sadeq-460199145, résumé on Google Drive.
- No testimonials, user counts, revenue or metrics exist; never fabricate them.

## Product Principles

1. Show the systems, not adjectives: every claim about her work points at a real mechanism or a live link.
2. Credit honestly: Nesvia is hers end to end; Swazona Media is a team build she co-built.
3. Contact is never more than one click away for either audience.
4. The site itself is evidence of craft: fast, accessible, considered motion.

## Accessibility & Inclusion

WCAG 2.2 AA. All motion respects `prefers-reduced-motion`.
