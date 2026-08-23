// ─────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────

export const NAME = "Sammit Poudyal";
export const FIRST_NAME = "Sammit";
export const ROLE = "Full-Stack Developer · Applied AI";
export const TITLE = "Computer Engineering Student";
export const LOCATION = "Kathmandu, Nepal";
export const AVAILABILITY ="Open to software engineering, full-stack & applied AI opportunities";
export const EMAIL = "poudyal.sammit@gmail.com";

// ─────────────────────────────────────────────
// CV / RESUME
// Option A (local): put PDF in public/ and set url to "/Your-Name-CV.pdf"
// Option B (Google Drive):
//   1. Upload PDF → Share → Anyone with the link (Viewer)
//   2. Copy FILE_ID from: https://drive.google.com/file/d/FILE_ID/view
//   3. url: "https://drive.google.com/uc?export=download&id=FILE_ID"
// Leave url empty to hide the navbar download button.
// ─────────────────────────────────────────────

export const CV = {
  url: "https://drive.google.com/uc?export=download&id=13r-2zeAWLLvWh4Ix_zfXw-y3mjHn2keh",
  previewUrl: "https://drive.google.com/file/d/13r-2zeAWLLvWh4Ix_zfXw-y3mjHn2keh/preview",
  fileName: "Sammit-Poudyal-CV.pdf",
  label: "CV",
};

// ─────────────────────────────────────────────
// TECHNICAL TOOLKIT
// Keep this evidence-based.
// Don't list technologies you cannot confidently discuss.
// ─────────────────────────────────────────────

export const CODE_DATA = [
  {
    name: "languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  },

  {
    name: "frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS"],
  },

  {
    name: "backend",
    items: ["Node.js", "Express", "FastAPI", "Django", "REST APIs"],
  },

  {
    name: "data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Firebase", "Prisma"],
  },

  {
    name: "ai / ml",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "LightGBM",
      "NLP",
      "Deep Learning",
      "Computer Vision",
    ],
  },

  {
    name: "engineering",
    items: ["Git", "GitHub", "Docker", "FastAPI", "Google Cloud", "Postman"],
  },
];

// ─────────────────────────────────────────────
// WHAT I BUILD
// This is better than a generic technology marquee.
// ─────────────────────────────────────────────

export const MARQUEE = [
  "Frontend Development",
  "Full-Stack Systems",
  "Applied AI",
  "Machine Learning",
  "Data-Driven Products",
  "Backend Engineering",
  "Intelligent Workflows",
  "Product Development",
  "End-to-End Systems",
];

// ─────────────────────────────────────────────
// MANIFESTO
// ─────────────────────────────────────────────

export const MANIFESTO_LINES = [
  {
    line: "understand the problem",
    highlight: "problem",
  },

  {
    line: "build the system",
    highlight: "system",
  },

  {
    line: "make it intelligent",
    highlight: "intelligent",
  },
];

export const MANIFESTO_BODY =
  "I build software at the intersection of engineering and intelligence  -  from responsive interfaces and backend systems to machine learning models and AI-powered workflows. I care about understanding the problem, making thoughtful technical decisions, and creating systems that can be measured, improved, and used in the real world. At the core, coding is coding : I genuinely enjoy building, whether that means frontends, APIs, data pipelines, models, or the systems that connect them.";

export const MANIFESTO_BODY_HIGHLIGHT = "coding is coding ";

// ─────────────────────────────────────────────
// ENGINEERING PRINCIPLES
// ─────────────────────────────────────────────

export const STRATEGY = [
  {
    title: "problem before technology",
    kicker: "Start with why",
    text: "The best solution does not begin with a framework or a model. I start by understanding the problem, the people using the system, and the constraints involved before deciding what technology belongs in the solution.",
    bg: "#0c4a6e",
    fg: "#f0f9ff",
    accent: "#7dd3fc",
  },
  {
    title: "build the whole system",
    kicker: "Think end to end",
    text: "I enjoy working across the full journey of a product - from interfaces and APIs to data, models, infrastructure, and intelligent features. Understanding how these pieces connect helps me make better technical decisions and build more coherent systems.",
    bg: "#e8e1d6",
    fg: "#292524",
    accent: "#b45309",
  },
  {
    title: "intelligence with purpose",
    kicker: "AI when it matters",
    text: "AI is most valuable when it meaningfully improves a product or workflow. I am interested in applying machine learning and intelligent systems where they solve a real problem - not simply adding AI because it is fashionable.",
    bg: "#134e4a",
    fg: "#ecfdf5",
    accent: "#5eead4",
  },
  {
    title: "measure what matters",
    kicker: "Evidence over assumptions",
    text: "A system is not finished because it runs. I believe in evaluating performance with meaningful evidence - whether that means model quality, application reliability, usability, or the outcome the product is meant to improve.",
    bg: "#1c1917",
    fg: "#f5f0e8",
    accent: "#a8a29e",
  },
  {
    title: "learn by building",
    kicker: "Curiosity into practice",
    text: "The technologies I understand best are the ones I have used to solve real problems. I learn by experimenting, building, breaking things, measuring the results, and improving the system.",
    bg: "#1e1b4b",
    fg: "#eef2ff",
    accent: "#818cf8",
  },
];

// ─────────────────────────────────────────────
// FEATURED WORK
//
// Your portfolio should prioritize depth.
// Prometheus should be the flagship project.
// ─────────────────────────────────────────────

export const PROJECTS = [
  {
    name: "Prometheus",
    title: "Daily Wildfire Risk Forecast for Nepal",
    summary:
      "Calibrated 1 km next-day and 7-day fire-probability maps for Nepal's pre-monsoon season, shipped as GeoTIFF forecasts with a FastAPI + React map UI.",
    year: "2025–2026",
    tag: "Python · LightGBM · FastAPI · React",
    bg: "bg-zinc-900",
    color: "#22d3ee",
    thumbnail: "/images/Prometheus.png",
    github: "https://github.com/Ssaammmmiitt/Prometheus",
    featured: true,
  },
  {
    name: "NepAI",
    title: "NEPSE Stock Analysis Dashboard",
    summary:
      "Responsive NEPSE dashboard with market overviews, portfolio tracking, technical indicators, and AI prediction overlays on interactive charts.",
    year: "2026",
    tag: "React · TypeScript · Zustand · Tailwind CSS",
    bg: "bg-neutral-800",
    color: "#7c9cff",
    thumbnail: "/images/NepAI.png",
    github: "https://github.com/Ssaammmmiitt/NepAI",
    featured: true,
  },
  {
    name: "NoteMerge",
    title: "AI-Powered Note Merging & Summarization",
    summary:
      "Merges and summarizes fragmented notes using transformers and BERTopic semantic clustering in a FastAPI + React full-stack app.",
    year: "2025",
    tag: "Python · FastAPI · React · PyTorch · BERTopic · SBERT",
    bg: "bg-zinc-800",
    color: "#ff6b8a",
    thumbnail: "/images/Note-Merge.png",
    github: "https://github.com/Note-Merge/Note-Merge",
    featured: true,
  },
  {
    name: "Covify 3D",
    title: "Interactive 3D Spotify Visualizer",
    summary:
      "Three.js album-art sphere and drop layouts with Spotify PKCE auth, queue control, and cross-platform Tauri desktop builds.",
    year: "2026",
    tag: "Three.js · Tauri · Alpine.js · Spotify API",
    bg: "bg-zinc-900",
    color: "#1ed760",
    thumbnail: "/images/Covify.png",
    github: "https://github.com/Ssaammmmiitt/Covify",
  },
  {
    name: "TamangNetra",
    title: "Layout-Preserving Document Translation",
    summary:
      "Trilingual English–Nepali–Tamang translator with hybrid PDF pipelines that preserve tables, graphics, and math across PDF, DOCX, and spreadsheets.",
    year: "2026",
    tag: "Python · FastAPI · PyMuPDF · ReportLab · Google TMT Hackathon",
    bg: "bg-neutral-800",
    color: "#4285f4",
    thumbnail: "/images/TamangNetra.png",
    github: "https://github.com/Ssaammmmiitt/TamangNetra",
  },
  {
    name: "Contrace",
    title: "Blog Platform with NLP Keyword Extraction",
    summary:
      "Full-stack content platform with TF-IDF and YAKE keyword extraction to power search, tagging, and recommendations.",
    year: "2024",
    tag: "React · Django · Python · NLP",
    bg: "bg-zinc-900",
    color: "#5eead4",
    thumbnail: "/images/Contrace.png",
    github: "https://github.com/Kasmik004/Contrace",
  },
  {
    name: "WorkSpot",
    title: "Workspace & Job Exploration Platform",
    summary:
      "Unified interface to browse workspaces and job opportunities with responsive React UI and Node.js APIs.",
    year: "2023",
    tag: "React · Node.js · APIs",
    bg: "bg-neutral-800",
    color: "#f3ece4",
    thumbnail: "/images/WorkSpot.png",
    github: "https://github.com/Ssaammmmiitt/WorkSpot",
  },
];

// ─────────────────────────────────────────────
// LEADERSHIP / EXTRACURRICULAR
// ─────────────────────────────────────────────

export const LEADERSHIP = [
  {
    year: "2026",
    role: "Track winner",
    event: "Infinity Hackathon",
    detail: "Smart and Secure Future",
    highlight: true,
  },
  {
    year: "2025",
    role: "Logistics Lead",
    event: "Hackathon · KU IT Meet",
  },
  {
    year: "2025",
    role: "Event Manager",
    event: "Valorant IT Meet Competition",
  },
  {
    year: "2024",
    role: "Logistics Member",
    event: "Hackathon · KU IT Meet",
  },
  {
    year: "2023",
    role: "Volunteer",
    event: "KU IT Meet",
  },
];

// ─────────────────────────────────────────────
// ABOUT
// More concise and professional than a long life story.
// ─────────────────────────────────────────────

export const BIO_TEXTS = [
  "I'm an undergraduate Computer Engineering student based in Kathmandu, still figuring things out  -  and honestly, that's part of what I enjoy. I move across stacks, domains, and tools, exploring what fits and learning what each one is actually good for.",
  "Right now, I'm driven by curiosity: seeing how far a technology can go, what problems it solves well, and where it breaks. That has taken me from web and full-stack development into data, machine learning, and applied AI  -  not because I'm locked into one lane, but because I'm interested in understanding how different pieces of technology can work together.",
  "At the core, coding is coding. I enjoy building, and I'm happy working wherever code is the craft  -  interfaces, systems, models, or the glue between them. If something needs to be built thoughtfully, I'm interested.",
];

// ─────────────────────────────────────────────
// CULTURE / INTERESTS
// ─────────────────────────────────────────────

export const CULTURE_DATA = [
  {
    name: "focus",
    items: ["Applied AI", "Full-Stack Systems", "Deep Learning", "Product Thinking"],
  },
  {
    name: "domains",
    items: ["Computer Vision", "NLP", "Model Training", "Forecasting", "Data Products"],
  },
  {
    name: "environment",
    items: ["VS Code", "Cursor", "Antigravity", "Android Studio"],
  },
  {
    name: "craft",
    items: ["Motion", "Performance", "Design Systems", "DX"],
  },
  {
    name: "tools",
    items: ["Figma", "Canva","GSAP", "Three.js", "Postman", "Spline"],
  },
];

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────

export const STATS = [
  { value: "8+", label: "Projects built" },
  { value: "3+", label: "Years building" },
  { value: "20+", label: "Technologies" },
  { value: "AI/Frontend", label: "Core focus" },
];

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

export const BUDGETS = [
  "None",
  "Under $500",
  "$500 – $1000",
  "$1000 – $5000",
  "$5000+"
];

export const CONTACT_TOPICS = [
  "Job opportunity",
  "Internship",
  "Collaboration",
  "Research",
  "Project idea",
  "Just saying hello",
];

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export const NAV_LINKS = [
  {
    label: "Home",
    href: "#hero",
  },

  {
    label: "Work",
    href: "#works",
  },

  {
    label: "About",
    href: "#about",
  },

  {
    label: "Contact",
    href: "#contact",
  },
];

// ─────────────────────────────────────────────
// SOCIALS
//
// Replace these with your actual profile URLs.
// Do not leave generic social media homepages.
// ─────────────────────────────────────────────

export const SOCIALS = [
  {
    label: "github",
    href: "https://github.com/Ssaammmmiitt/",
  },

  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/sammit-poudyal/",
  },
];

// ─────────────────────────────────────────────
// CONTACT SOURCE
// ─────────────────────────────────────────────

export const SOURCES = [
  "LinkedIn",
  "GitHub",
  "Google Search",
  "Referral",
  "Portfolio",
  "Other",
];

// ─────────────────────────────────────────────
// TIME
// Keep only locations useful to your audience.
// ─────────────────────────────────────────────

export const CLOCKS = [
  {
    city: "Kathmandu",
    tz: "Asia/Kathmandu",
  },
];
