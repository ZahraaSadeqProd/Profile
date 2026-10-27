export const links = {
  email: "zkarem12@gmail.com",
  github: "https://github.com/ZahraaSadeqProd",
  linkedin: "https://www.linkedin.com/in/zahraa-sadeq-460199145/",
  resume: "/resume",
};

export const intro =
  "AI/ML engineer. I build AI products end to end: vision models that read real labels, scoring engines that cite public science, and agent systems that run under audit.";

export const sappers = {
  role: "Sr. Software Engineer",
  org: "Sappers Group",
  place: "Remote · Santa Clara, CA",
  years: "Mar 2025 – now",
  summary:
    "LLM APIs, AI agents and RAG systems for enterprise productivity tools, and the AWS, Kubernetes and CI/CD infrastructure they run on.",
  bullets: [
    "Work on LLM APIs, AI agents, RAG systems, prompt engineering and Python automation workflows for enterprise productivity tools.",
    "Help with AWS cloud architecture, deployment, networking, security and infrastructure management.",
    "Containerise and deploy with Docker and Kubernetes: orchestration, scaling and cloud-native deployments.",
    "Build CI/CD pipelines with GitHub Actions, Jenkins and Terraform, automating deployments and release engineering as infrastructure-as-code.",
    "Work on reliability in distributed systems: telemetry, tracing and logging with Prometheus and Grafana, and debugging at scale.",
    "Help with modern C++17/20 on embedded Linux: multithreading, performance optimisation and networking.",
    "Use Python for infrastructure and automation: scripting, test frameworks, infrastructure tooling and AI integration.",
    "Consult remotely with clients: technical writing, solution architecture discussions, and turning technical problems into business value.",
  ],
  stack: ["Python", "LLM APIs", "RAG", "Agents", "AWS", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus", "C++17/20"],
};

export const raytheon = {
  role: "Software Engineer II",
  org: "Raytheon",
  years: "2020 – 2025",
  summary:
    "Where I built my foundation in embedded C/C++, real-time systems and software testing, writing and testing code for multi-processor PPC and DSP systems on VxWorks.",
  bullets: [
    "Led root-cause analysis of complex system failures in Software-in-the-Loop and Hardware-in-the-Loop testing of multi-processor embedded systems (PPC and DSP) on VxWorks/RTOS.",
    "Developed embedded C/C++ software components for both PPC (VxWorks) and DSP architectures.",
    "Designed and ran automated unit and module-level tests for mission-critical C/C++ with Google Test and GMock on Linux.",
    "Worked in Agile teams, reproduced test environments and ran software peer reviews.",
    "Wrote and reviewed test procedures, problem reports and analysis reports.",
  ],
  stack: ["C", "C++", "VxWorks", "RTOS", "PPC", "DSP", "Google Test", "GMock"],
};

export type Project = {
  slug: string;
  name: string;
  url: string;
  urlLabel: string;
  role: string;
  status: string;
  line: string;
  question: string;
  tags: string[];
  stack: string[];
  overview: string[];
  pipeline: { id: string; label: string; detail: string }[];
  decisions: { title: string; why: string; how: string }[];
};

export const projects: Project[] = [
  {
    slug: "nesvia",
    name: "Nesvia",
    url: "https://nesvia.app",
    urlLabel: "nesvia.app",
    role: "Founder, sole engineer",
    status: "MVP running end to end",
    line: "Reads every label in your home, scores each product against public science, and tells you what to swap first.",
    question: "Can an app read the whole label of everything you own, score it honestly, and hand you one clear swap at a time?",
    tags: ["Vision", "Scoring engine", "Data pipelines", "Mobile"],
    stack: ["Expo / React Native", "FastAPI", "Postgres", "Vision model", "PubChem", "EPA CompTox", "openFDA", "Open Food Facts", "Open Beauty Facts", "USDA FoodData Central"],
    overview: [
      "People who want a less toxic home have apps that say “this is bad” and stop there. Nesvia does the next part: it audits the whole home, orders the swaps, and shows the score moving as you make them.",
      "A product comes in as a shelf photo, a label photo, a barcode or a typed name. A vision model reads it, every ingredient is matched against public scientific and government sources, and the product gets a 0–100 score where higher means more concern. A product we cannot read stays unrated; it is never counted as clean.",
    ],
    pipeline: [
      { id: "in", label: "Photo, barcode or name", detail: "Shelf photo, label photo, barcode, or a typed product name." },
      { id: "vision", label: "Vision model", detail: "Reads the product and its full ingredient list off the photo." },
      { id: "match", label: "Ingredient matching", detail: "Each ingredient is resolved to a known substance." },
      { id: "sources", label: "Public sources", detail: "PubChem, EPA CompTox, openFDA recalls, Open Food Facts, Open Beauty Facts, USDA FoodData Central." },
      { id: "score", label: "Product score 0–100", detail: "Higher means more concern. Unreadable stays unrated." },
      { id: "plan", label: "Home Score and swap plan", detail: "Highest concern and easiest swap first; the score falls as swaps land." },
    ],
    decisions: [
      {
        title: "Cite, don't guess",
        why: "Trust is the product. A score nobody can trace is just another opinion.",
        how: "Scores come only from public sources (no EWG or Mamavation data in any pipeline), and every flag points back to where it came from.",
      },
      {
        title: "Unreadable is unrated",
        why: "Counting a product we could not read as clean would flatter the home and break trust.",
        how: "The pipeline carries an explicit unrated state all the way to the Home Score instead of defaulting to zero.",
      },
      {
        title: "One swap at a time",
        why: "People arrive overwhelmed. A list of forty problems makes them quit.",
        how: "The plan orders products by concern and ease, so there is always exactly one next action, and the score visibly drops after it.",
      },
    ],
  },
  {
    slug: "swazona-media",
    name: "Swazona Media",
    url: "https://swazona.media",
    urlLabel: "swazona.media",
    role: "Co-builder (team build)",
    status: "Live, first workspace running",
    line: "An Arabic-first AI marketing agency: a team of agents runs a business’s month of marketing, and nothing goes live without the owner’s approval.",
    question: "How do you let a team of AI agents run real marketing, with real ad money, and still prove to the owner exactly what happened?",
    tags: ["Multi-agent", "Orchestration", "Arabic-first", "Audit trail"],
    stack: ["FastAPI", "SQLAlchemy 2 (async)", "Postgres", "Taskiq workers", "SSE streaming", "Next.js 16", "FLUX", "FFmpeg", "Meta Graph API"],
    overview: [
      "Small businesses in Jordan and the Gulf want marketing done for them, and are afraid of paying for nothing. Swazona Media plans a month of content, produces posts and short videos in Arabic and English, publishes them, runs ads inside a budget, and reports real numbers.",
      "The work is done by an agent team: Strategist, Auditor, Content Planner, Copywriter, Designer, Motion Designer, Media Buyer, Analyst, SEO/AEO Specialist and an Account Manager the owner chats with.",
    ],
    pipeline: [
      { id: "audit", label: "Free AI audit", detail: "The Auditor reviews the business and estimates a month of credits." },
      { id: "fsm", label: "Postgres state machine", detail: "The orchestrator. Not an LLM: every step is an explicit, recorded transition." },
      { id: "agents", label: "Agent team", detail: "Stateless workers that return structured artifacts: plans, copy, designs, videos, ads." },
      { id: "approve", label: "Owner approval", detail: "Every post and ad waits for the owner to approve, edit or reject." },
      { id: "publish", label: "Publish and ads", detail: "Posts go out; the Media Buyer spends only inside a hard budget envelope." },
      { id: "log", label: "Audit log and reports", detail: "Every transition appends an event; reports show real platform numbers." },
    ],
    decisions: [
      {
        title: "The orchestrator is a state machine, not an LLM",
        why: "An LLM deciding what happens next is hard to predict and impossible to audit.",
        how: "Postgres holds the workflow state; agents are stateless workers called by explicit transitions.",
      },
      {
        title: "The audit trail is the feature",
        why: "Owners are afraid of being sold nothing. Showing every step answers that better than a promise.",
        how: "Every transition appends an event, so the history of each post and each ad dollar can be replayed.",
      },
      {
        title: "Money moves only inside an envelope",
        why: "Agents with ad budgets are a real financial risk.",
        how: "The Media Buyer runs dry-run by default and spends only inside per-workspace envelopes with warm-up caps; unknown outcomes are held, never silently charged.",
      },
    ],
  },
];

export const education = [
  { degree: "M.S. Electrical & Computer Engineering", school: "University of Arizona", years: "2020 – 2022", note: "GPA 3.8 / 4.0" },
  { degree: "B.S. Electrical & Computer Engineering", school: "University of Arizona", years: "2015 – 2020", note: "GPA 3.4 / 4.0" },
];
