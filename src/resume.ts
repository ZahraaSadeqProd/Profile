// The résumé, as data. /resume renders it; tools/resume/build.mjs prints that page to the PDF and the ATS .docx.
// Facts come from the May 2026 résumé (Zahraa_Sadeq_Resume_Latest.pdf) and the project pages; wording is tidied, not added to.
// US spelling throughout: applicant tracking systems match keywords literally.

export const SITE = "https://zahraasadeq.dev";

export const resume = {
  name: "Zahraa Sadeq",
  headline: "AI/ML Engineer · Senior Software Engineer",
  location: "Tucson, AZ",
  email: "zkarem12@gmail.com",
  site: "zahraasadeq.dev",
  linkedin: "linkedin.com/in/zahraa-sadeq-460199145",
  github: "github.com/ZahraaSadeqProd",
  skills: [
    { label: "AI & ML", items: ["LLM APIs", "AI agents", "RAG", "Prompt engineering", "Multi-agent orchestration", "Computer vision", "OpenCV"] },
    { label: "Languages", items: ["Python", "C++ (17/20)", "C", "TypeScript", "JavaScript", "SQL", "Bash", "Lua", "Java"] },
    { label: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins", "CI/CD", "Prometheus", "Grafana"] },
    { label: "Backend & Web", items: ["FastAPI", "PostgreSQL", "MySQL", "Node.js", "Next.js", "React Native", "Electron"] },
    { label: "Embedded & Systems", items: ["Linux", "VxWorks", "RTOS", "FreeRTOS", "DSP", "PPC", "FPGA", "Verilog", "Distributed systems"] },
    { label: "Testing & Tools", items: ["GoogleTest", "GMock", "SIL / HIL testing", "GDB", "Wireshark", "Git", "Agile / Scrum"] },
  ],
  jobs: [
    {
      role: "Senior Software Engineer (Remote)",
      org: "Sappers Group",
      place: "Santa Clara, CA",
      start: "2025-03",
      dates: "March 2025 – Present",
      bullets: [
        "Build LLM API integrations, AI agents, RAG systems, prompt engineering and Python automation workflows for enterprise productivity tools.",
        "Support AWS cloud architecture, deployment, networking, security and infrastructure management.",
        "Containerize and deploy services with Docker and Kubernetes, including orchestration, scaling and cloud-native deployments.",
        "Build CI/CD pipelines with GitHub Actions, Jenkins and Terraform, automating deployments and release engineering as infrastructure-as-code.",
        "Improve reliability of distributed systems with telemetry, tracing and logging in Prometheus and Grafana, and debug issues at scale.",
        "Contribute modern C++17/20 for embedded Linux: multithreading, performance optimization and networking.",
        "Use Python for infrastructure and automation: scripting, test frameworks, infrastructure tooling and AI integration.",
        "Consult remotely with clients: technical writing, solution architecture discussions, and translating technical problems into business value.",
      ],
    },
    {
      role: "Software Engineer",
      org: "Raytheon",
      place: "Tucson, AZ",
      start: "2020-08",
      end: "2025-03",
      dates: "August 2020 – March 2025",
      bullets: [
        "Developed high-performance C/C++ software for real-time distributed systems on Linux and Windows in multi-processor embedded environments (PPC and DSP, VxWorks).",
        "Debugged complex system-level failures across distributed subsystems in Software-in-the-Loop (SIL) and Hardware-in-the-Loop (HIL) test environments.",
        "Led root-cause analysis of mission-critical software and hardware integration issues, improving system reliability and reducing recurring defects.",
        "Designed and maintained Python automation tooling adopted across integration and verification teams, significantly reducing manual test execution time.",
        "Served as Build Manager: validated integrated software builds, coordinated releases and supported multi-team integration.",
        "Wrote automated unit and module tests for mission-critical C/C++ with GoogleTest and GMock.",
        "Conducted peer code reviews and authored technical documentation on debugging procedures, system behavior and failure analysis.",
      ],
    },
    {
      role: "Software Engineer Intern",
      org: "Raytheon",
      place: "Tucson, AZ",
      start: "2020-06",
      end: "2020-08",
      dates: "June 2020 – August 2020",
      bullets: [
        "Wrote Lua scripts for Wireshark to analyze and filter traffic between distributed system components.",
        "Debugged software and hardware integration issues through packet analysis and protocol inspection.",
        "Wrote operating guides for the mission computer lab test environment.",
      ],
    },
    {
      role: "Integration & Verification Engineer Intern",
      org: "Raytheon",
      place: "Tucson, AZ",
      start: "2019-06",
      end: "2019-07",
      dates: "June 2019 – July 2019",
      bullets: [
        "Supported debugging and validation of integrated software and hardware systems.",
        "Updated legacy test procedures and documentation with systems engineering leadership.",
      ],
    },
  ],
  projects: [
    {
      name: "Nesvia",
      url: "nesvia.app",
      role: "Founder and sole engineer",
      bullets: [
        "Mobile app that reads product labels with a vision model, matches every ingredient against public scientific sources (PubChem, EPA CompTox, openFDA, USDA) and scores each product 0–100.",
        "Built end to end: Expo / React Native app, FastAPI and PostgreSQL backend, ingredient-matching and scoring pipeline with an explicit unrated state for unreadable products.",
      ],
    },
    {
      name: "Swazona Media",
      url: "swazona.media",
      role: "Co-builder",
      bullets: [
        "Arabic-first AI marketing agency where a team of agents (strategist, copywriter, designer, media buyer, analyst and more) plans, produces and publishes a month of content.",
        "Orchestration is a PostgreSQL state machine, not an LLM: every step is a recorded transition, every post waits for owner approval, and ad spend stays inside hard budget envelopes. FastAPI, Taskiq, Next.js, Meta Graph API.",
      ],
    },
    {
      name: "FractalEyes",
      role: "Senior design project, University of Arizona",
      dates: "2019 – 2020",
      bullets: [
        "Medical imaging application in Python and OpenCV for image segmentation and feature extraction (luminosity, granularity, color frequency), with an Electron desktop GUI. Awarded Best Implementation of Agile Methodology.",
      ],
    },
  ],
  education: [
    { degree: "M.S., Electrical & Computer Engineering", school: "University of Arizona", dates: "2020 – 2022", note: "GPA 3.8" },
    { degree: "B.S., Electrical & Computer Engineering", school: "University of Arizona", dates: "2015 – 2020", note: "GPA 3.4" },
  ],
  spoken: ["English", "Arabic"],
};

export const files = {
  pdf: "/Zahraa-Sadeq-Resume.pdf",
  docx: "/Zahraa-Sadeq-Resume.docx",
};
