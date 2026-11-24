/**
 * SITE CONTENT: the single source of truth.
 *
 * Every section of the home page, the case study pages, and the chatbot's
 * knowledge file read from this file. To update the site, edit only this file.
 *
 * Editing rules:
 * 1. Only verified facts. Never add a metric, skill, feature, or employer that isn't real.
 * 2. Anything missing uses todo("what is missing"). The site hides TODO values
 *    completely (no empty buttons or placeholder text). To list what's left, run:
 *        npm run todos
 * 3. House style: no em dashes in any copy.
 * 4. Keep this file free of imports. Build scripts (npm run todos, and the chatbot's
 *    knowledge.json generator) load it directly with Node.
 * 5. Wording Claude wrote that is NOT taken directly from Sakshi's notes (usually a
 *    "why" sentence) is wrapped in draft(...). Drafts are highlighted in `npm run dev`
 *    and hidden on the live site (and kept out of the chatbot) until approved.
 *    To approve: delete the draft( ) wrapper and keep the text, edited if needed.
 *    To reject: delete the line. `npm run todos` lists every draft still waiting.
 */

/* -------------------------------------------------------------------------- */
/*  TODO helper                                                                */
/* -------------------------------------------------------------------------- */

export type Todo = { readonly todo: string };

/** Marks missing content. The UI hides it everywhere until it is filled in. */
export const todo = (what: string): Todo => ({ todo: what });

export function isTodo(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { todo?: unknown }).todo === "string"
  );
}

/** A value we have, or a TODO describing what is missing. */
export type OrTodo<T> = T | Todo;

/* -------------------------------------------------------------------------- */
/*  Draft helper (see editing rule 5)                                          */
/* -------------------------------------------------------------------------- */

export type Draft<T> = { readonly draft: T };

/** Marks wording Claude wrote that Sakshi hasn't approved yet. Hidden on the live site. */
export const draft = <T>(value: T): Draft<T> => ({ draft: value });

export function isDraft<T>(value: T | Draft<T>): value is Draft<T> {
  return typeof value === "object" && value !== null && !Array.isArray(value) && "draft" in value;
}

/** Approved wording, or a draft waiting for review. */
export type OrDraft<T> = T | Draft<T>;

/* -------------------------------------------------------------------------- */
/*  Tracks (All | SWE | ML/AI | Data)                                          */
/* -------------------------------------------------------------------------- */

export const TRACK_IDS = ["all", "swe", "ml", "data"] as const;
export type Track = (typeof TRACK_IDS)[number];
/** A specific track, used to tag projects. "all" is not a tag. */
export type FocusTrack = Exclude<Track, "all">;

export interface TrackInfo {
  id: Track;
  /** Label on the track switcher. */
  label: string;
  /** URL hash without "#". Empty for All, so the plain URL means All. */
  hash: string;
  /** Hero tagline for this track. */
  tagline: string;
  /** Resume the Resume button downloads on this track. */
  resume: { href: string; downloadName: string };
}

export const tracks: Record<Track, TrackInfo> = {
  all: {
    id: "all",
    label: "All",
    hash: "",
    tagline: "Versatile engineer across full-stack, ML pipelines, and agentic AI",
    resume: { href: "/resumes/resume-general.pdf", downloadName: "Sakshi_Gupta_Resume.pdf" },
  },
  swe: {
    id: "swe",
    label: "SWE",
    hash: "swe",
    tagline: "Full-stack and distributed systems builder",
    resume: { href: "/resumes/resume-swe.pdf", downloadName: "Sakshi_Gupta_Resume_SWE.pdf" },
  },
  ml: {
    id: "ml",
    label: "ML/AI",
    hash: "ml",
    tagline: "RAG, agents, and LLM evaluation",
    resume: { href: "/resumes/resume-ml.pdf", downloadName: "Sakshi_Gupta_Resume_ML.pdf" },
  },
  data: {
    id: "data",
    label: "Data",
    hash: "data",
    tagline: "Data pipelines, validation, and dashboards",
    resume: { href: "/resumes/resume-data.pdf", downloadName: "Sakshi_Gupta_Resume_Data.pdf" },
  },
};

/* -------------------------------------------------------------------------- */
/*  Profile, site, and links                                                   */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Sakshi Gupta",
  firstName: "Sakshi",
  headline: "MS Computer Science student at Northeastern University, Seattle",
  openTo: "Open to SWE, ML/AI, and Data roles",
  location: "Seattle",
  email: "sakshigupta1093@gmail.com",
  /** Hero photo. Set to null to hide it; the hero is designed to work either way. */
  headshot: {
    src: "/images/headshot.jpg",
    alt: "Portrait of Sakshi Gupta smiling outdoors",
  } as { src: string; alt: string } | null,
  /** "At a glance" card in the hero. */
  highlights: [
    { icon: "education", text: "MS Computer Science, Northeastern University (GPA 3.8/4.0)" },
    { icon: "award", text: "Judges' Choice Award, Defense Tech Jam Seattle 2026" },
    { icon: "work", text: "Previously AI Intern at Amdocs and Data Analytics Associate at Northeastern" },
    { icon: "publication", text: "3 publications, including IEEE ICSCNA 2023" },
  ] as { icon: "education" | "award" | "work" | "publication"; text: string }[],
  /** About section: 3 short lines. */
  about: [
    "I'm an MS Computer Science student at Northeastern University in Seattle, working as a versatile generalist across full-stack development, ML pipelines, and agentic AI tooling.",
    "Recently I built a multi-agent RAG system over SEC filings, was part of the team that won Judges' Choice at Defense Tech Jam Seattle with a 3D tactical game, and served as Project Manager and QA Lead on a source-labeled knowledge graph with an industry partner.",
    "Before that, I built ML pipelines as an AI Intern at Amdocs and automated data workflows and dashboards as a Data Analytics Associate at Northeastern.",
  ],
  links: {
    github: "https://github.com/SakshiGupta1093",
    linkedin: "https://www.linkedin.com/in/sakshi-gupta-neu/",
    email: "mailto:sakshigupta1093@gmail.com",
  },
} as const;

export const site = {
  title: "Sakshi Gupta | Software, ML/AI, and Data",
  description:
    "Portfolio of Sakshi Gupta, MS Computer Science student at Northeastern University in Seattle. Full-stack systems, RAG and agentic AI, and data pipelines.",
  /** Production URL (Vercel, deployed from main). Used for canonical links, Open Graph, and the sitemap. */
  url: "https://sakshigupta.vercel.app",
  builtWith: "Built with Next.js, Tailwind, and Groq",
};

/* -------------------------------------------------------------------------- */
/*  Tools (every tool in the Tech Stack section)                               */
/* -------------------------------------------------------------------------- */

/**
 * Registry of every tool, keyed by a stable id. Projects reference these ids,
 * so a typo is a compile error, not a silently broken highlight.
 */
export const tools = {
  // Languages
  java: "Java",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  "c-cpp": "C/C++",
  sql: "SQL",
  r: "R",
  // Frontend
  react: "React",
  nextjs: "Next.js",
  tailwind: "Tailwind CSS",
  threejs: "Three.js",
  // Backend
  "node-express": "Node/Express",
  fastapi: "FastAPI",
  asyncio: "asyncio",
  "rest-apis": "REST APIs",
  oauth: "OAuth",
  // Databases
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  duckdb: "DuckDB",
  neo4j: "Neo4j/Cypher",
  hadoop: "Hadoop",
  // Machine learning
  pytorch: "PyTorch",
  tensorflow: "TensorFlow/Keras",
  "scikit-learn": "scikit-learn",
  xgboost: "XGBoost",
  pandas: "Pandas",
  numpy: "NumPy",
  // LLMs and agents
  transformers: "Hugging Face Transformers",
  langchain: "LangChain",
  crewai: "CrewAI",
  rag: "RAG",
  "llm-judge": "LLM-as-judge evaluation",
  // Retrieval
  faiss: "FAISS",
  embeddings: "Embeddings",
  "cross-encoder": "Cross-encoder re-ranking",
  // NLP and vision
  spacy: "spaCy",
  nltk: "NLTK",
  gensim: "Gensim",
  "sentence-transformers": "Sentence-Transformers",
  opencv: "OpenCV",
  // Dashboards
  "power-bi": "Power BI",
  streamlit: "Streamlit",
  // Data collection and quality
  beautifulsoup: "BeautifulSoup",
  "regex-validation": "Regex validation",
  // Tools and CI
  git: "Git",
  "github-actions": "GitHub Actions",
  pytest: "pytest",
  aws: "AWS",
  "claude-code": "Claude Code",
} as const;

export type ToolId = keyof typeof tools;

/* -------------------------------------------------------------------------- */
/*  Tech Stack section                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Categories for the "All" view. Each track group below maps into one of these,
 * and the All view removes duplicates (for example, FastAPI appears in both
 * SWE Backend and ML Serving but shows once under "Backend and APIs").
 */
export const ALL_STACK_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend and APIs",
  "Databases",
  "Machine learning",
  "LLMs and agents",
  "Retrieval",
  "NLP and vision",
  "Dashboards",
  "Data collection and quality",
  "Tools and CI",
] as const;

export type AllStackCategory = (typeof ALL_STACK_CATEGORIES)[number];

export interface StackGroup {
  name: string;
  /** Where this group's tools go in the All view. */
  allCategory: AllStackCategory;
  tools: ToolId[];
}

export const techStack: Record<FocusTrack, StackGroup[]> = {
  swe: [
    { name: "Languages", allCategory: "Languages", tools: ["java", "typescript", "javascript", "python", "c-cpp"] },
    { name: "Frontend", allCategory: "Frontend", tools: ["react", "nextjs", "tailwind", "threejs"] },
    { name: "Backend", allCategory: "Backend and APIs", tools: ["node-express", "fastapi", "asyncio", "rest-apis", "oauth"] },
    { name: "Databases", allCategory: "Databases", tools: ["postgresql", "mysql"] },
    { name: "Tools", allCategory: "Tools and CI", tools: ["git", "github-actions", "pytest", "aws", "claude-code"] },
  ],
  ml: [
    { name: "Core ML", allCategory: "Machine learning", tools: ["pytorch", "tensorflow", "scikit-learn", "xgboost"] },
    { name: "LLMs and agents", allCategory: "LLMs and agents", tools: ["transformers", "langchain", "crewai", "rag", "llm-judge"] },
    { name: "Retrieval", allCategory: "Retrieval", tools: ["faiss", "embeddings", "cross-encoder"] },
    { name: "NLP and vision", allCategory: "NLP and vision", tools: ["spacy", "nltk", "gensim", "sentence-transformers", "opencv"] },
    { name: "Serving", allCategory: "Backend and APIs", tools: ["fastapi"] },
  ],
  data: [
    { name: "Languages", allCategory: "Languages", tools: ["python", "sql", "r"] },
    { name: "Databases", allCategory: "Databases", tools: ["duckdb", "postgresql", "mysql", "neo4j", "hadoop"] },
    { name: "Analysis and ML", allCategory: "Machine learning", tools: ["scikit-learn", "xgboost", "pandas", "numpy"] },
    { name: "Dashboards", allCategory: "Dashboards", tools: ["power-bi", "streamlit"] },
    { name: "Data collection and quality", allCategory: "Data collection and quality", tools: ["beautifulsoup", "regex-validation", "pytest", "github-actions"] },
  ],
};

/**
 * What to show when a tool is clicked but no project on the page used it.
 * Order of preference: matching projects, then matching experience entries,
 * then a note from this list, then the neutral fallback.
 */
export const toolNotes: Partial<Record<ToolId, string>> = {
  aws: "AWS Academy Cloud Foundations certified",
};

export const toolFallbackNote = "Used outside the projects listed here.";

/* -------------------------------------------------------------------------- */
/*  Featured case studies                                                      */
/* -------------------------------------------------------------------------- */

export type CaseStudySlug = "edgarquery" | "ghostline" | "aowa-knowledge-graph" | "fraud-detection";

export interface ArchitectureStage {
  title: string;
  items: string[];
}

/** Data for the case study's SVG diagram. */
export interface Architecture {
  /** Plain-text description of the diagram for screen readers. */
  summary: string;
  /** Main flow, drawn left to right (top to bottom on mobile). */
  stages: ArchitectureStage[];
  /** A supporting layer drawn under the flow, such as testing or CI. */
  support?: ArchitectureStage;
  /** Short caption under the diagram. */
  note?: string;
}

export interface Result {
  value: string;
  label: string;
  /** Whose result this is, when the project was a team effort. */
  scope?: "team" | "mine";
}

export interface Decision {
  title: string;
  /** What was done. */
  detail: string;
  /** Optional reasoning, shown right after the detail. Wrapped in draft() when Claude wrote it. */
  why?: OrDraft<string>;
}

export interface CaseStudy {
  slug: CaseStudySlug;
  title: string;
  /** Tracks this case study is most relevant to. Drives the featured order per track. */
  tracks: FocusTrack[];
  /** One or two sentences for the card. */
  summary: string;
  /** Short team label for the card, such as "Solo project". */
  teamLabel: OrTodo<string>;
  /** Short highlight pills for the card. */
  badges: string[];
  /** Paragraphs. A draft() paragraph is hidden on the live site until approved. */
  problem: OrDraft<string>[];
  role: OrTodo<{ summary: string; groups: { heading: string; items: string[] }[] }>;
  architecture: Architecture;
  /** A whole decision can be a draft(), or just its `why`. */
  decisions: OrDraft<Decision>[];
  /** Only real numbers. An empty list hides the Results section. */
  results: Result[];
  next: OrTodo<string[]>;
  /** Stack chips, exactly as listed in the source content. */
  stack: string[];
  /** Tools from the Tech Stack section that this project used (for click-to-highlight). */
  toolIds: ToolId[];
  /**
   * null means "not applicable" (for example, a project that only runs locally has no live demo).
   * repoReady: false keeps the GitHub link off the site (and out of the chatbot) until
   * the repo shows the full project. Omit it or set it to true to show the link.
   */
  links: { github: OrTodo<string> | null; repoReady?: boolean; demo: OrTodo<string> | null };
  /**
   * Optional. An empty list hides the screenshot area, and the architecture
   * diagram is the main visual. To add one:
   *   1. Drop the image in assets/screenshots/ (it is copied to public/ on dev and build).
   *   2. Add { src: "/screenshots/your-file.png", alt: "What the screenshot shows" } here.
   */
  screenshots: Screenshot[];
}

export interface Screenshot {
  /** Path under public/, for example "/screenshots/edgarquery-answer.png". */
  src: string;
  /** Describes what the image shows, for screen readers. */
  alt: string;
  caption?: string;
}

/** Listed in the order used on the "All" track. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "edgarquery",
    title: "EDGARQuery",
    tracks: ["ml"],
    summary:
      "Multi-agent, multimodal RAG over SEC 10-K and 10-Q filings that answers questions with a citation to the source filing and section.",
    teamLabel: "Solo project",
    badges: ["Multi-agent RAG", "Works end to end, runs locally"],
    problem: [
      "SEC 10-K and 10-Q filings are long, and the answer to a question can sit in narrative text, a table, or a chart.",
      "EDGARQuery pulls 10-K and 10-Q filings from the SEC EDGAR API, indexes their narrative text, tables, and charts, and answers each question with a citation to the source filing and section.",
      "That way, every answer can be checked against the filing it came from.",
    ],
    role: {
      summary:
        "Solo project. I designed and built the whole system, and it works end to end, running locally.",
      groups: [
        {
          heading: "What I built",
          items: [
            "Ingestion of 10-K and 10-Q filings from the SEC EDGAR API, indexing narrative text, tables, and charts",
            "Retrieval with bge-small embeddings in a FAISS index, cross-encoder re-ranking, and CLIP/ColPali for tables and charts",
            "A LangChain/CrewAI setup that routes each question to a narrative, financials, or risk factors agent",
            "Generation with Qwen2.5-1.5B, plus a self-reflection step that re-checks weak answers",
            "A custom evaluation harness (precision/recall and LLM-as-judge faithfulness) wired into CI with pytest and GitHub Actions",
          ],
        },
      ],
    },
    architecture: {
      summary:
        "Filings come from the SEC EDGAR API and are indexed as narrative text, tables, and charts using bge-small embeddings in FAISS, with CLIP/ColPali for tables and charts. Each question is routed by LangChain/CrewAI to a narrative, financials, or risk factors agent. Retrieved passages are re-ranked by a cross-encoder, Qwen2.5-1.5B generates the answer, and a self-reflection step re-checks weak answers before returning an answer that cites the filing and section. An evaluation harness runs in CI.",
      stages: [
        { title: "Ingest", items: ["SEC EDGAR API", "10-K and 10-Q filings", "Text, tables, charts"] },
        { title: "Index", items: ["bge-small embeddings", "FAISS index", "CLIP/ColPali for tables and charts"] },
        { title: "Route", items: ["LangChain/CrewAI", "Narrative agent", "Financials agent", "Risk factors agent"] },
        { title: "Retrieve", items: ["FAISS search", "Cross-encoder re-ranking"] },
        { title: "Answer", items: ["Qwen2.5-1.5B", "Self-reflection re-check", "Cites filing and section"] },
      ],
      support: {
        title: "Evaluation in CI",
        items: ["Precision and recall", "LLM-as-judge faithfulness", "pytest + GitHub Actions"],
      },
      note: "Runs locally, end to end.",
    },
    decisions: [
      // All five come from the Phase 1 decisions log in the repo's PROGRESS.md
      // (ingestion, parsing, chunking, embeddings, FAISS). Decisions for the later
      // phases get added here once that code is pushed.
      {
        title: "Split sections on text, not HTML",
        detail:
          "Filers use very different markup for headings, but the \"Item N.\" wording is mandated, so sections are found with regex over the extracted text. Because every filing repeats its headings in a table of contents, the longest span between headings wins.",
      },
      {
        title: "Keep financial figures intact",
        detail:
          "Text extraction strands $, %, and the parentheses around negative numbers on their own lines. Rather than dropping those symbols, the cleaner reattaches them to their numbers so figures aren't corrupted.",
      },
      {
        title: "Chunks are exact slices of the filing",
        detail:
          "Each chunk is a verbatim substring of its section, stored with character offsets, so a retrieved hit can always be cited back to the exact source text.",
      },
      {
        title: "Exact FAISS search on normalized vectors",
        detail:
          "bge-small vectors are L2-normalized at encode time, so inner product equals cosine similarity in a plain IndexFlatIP. An exact index (not an approximate one) means retrieval metrics measure the embeddings, not an approximation's recall loss.",
      },
      {
        title: "Guard against silent mismatches",
        detail:
          "The index and its metadata live in one object that refuses to load if their lengths disagree, and the metadata records which embedding model built the index. Queries use that same model, with a dimension check on every search, so a mismatch fails loudly instead of returning plausible nonsense.",
      },
    ],
    results: [], // No metric numbers yet, so the Results section is hidden.
    next: [
      "Run the eval harness on a labeled question set and publish precision, recall, and faithfulness numbers.",
      "Try a larger generation model and compare it against Qwen2.5-1.5B.",
    ],
    stack: [
      "Python",
      "SEC EDGAR API",
      "FAISS",
      "bge-small",
      "Cross-encoder",
      "Qwen2.5-1.5B",
      "LangChain",
      "CrewAI",
      "CLIP/ColPali",
      "pytest",
      "GitHub Actions",
    ],
    toolIds: ["python", "faiss", "embeddings", "cross-encoder", "langchain", "crewai", "rag", "llm-judge", "pytest", "github-actions"],
    links: {
      github: "https://github.com/SakshiGupta1093/EDGARQuery",
      // Only Phase 1 is pushed so far. Flip to true once the full project is on GitHub.
      repoReady: false,
      demo: null,
    },
    screenshots: [],
  },
  {
    slug: "ghostline",
    title: "GHOSTLINE",
    tracks: ["swe"],
    summary:
      "A turn-based 3D tactical game exploring human-AI trust calibration. Won the Judges' Choice Award at Defense Tech Jam Seattle.",
    teamLabel: "Team of 4",
    badges: ["Judges' Choice Award", "Fully offline, no backend"],
    problem: [
      "When should a player trust an AI teammate, and when should they question it?",
      "GHOSTLINE is a turn-based 3D tactical game that explores human-AI trust calibration. Our team of 4 won the Judges' Choice Award at Defense Tech Jam Seattle in September 2026.",
      "The game runs fully offline in the browser with no backend: about 18k lines of vanilla JavaScript covering game logic, a Three.js 3D scene, audio, speech, and gamepad input.",
    ],
    role: {
      summary:
        "Team of 4. I owned the game logic, the Three.js 3D scene, and testing, and I reviewed my teammates' pull requests.",
      groups: [
        {
          heading: "What I owned",
          items: ["Game logic", "The Three.js 3D scene", "Testing"],
        },
        {
          heading: "Team work",
          items: ["Reviewed teammates' pull requests"],
        },
      ],
    },
    architecture: {
      summary:
        "A browser-only game with no backend. The Gamepad, Web Speech, and Web Audio APIs connect to the turn-based game logic, written as vanilla JavaScript ES modules, which drives a Three.js 3D scene animated with GSAP. It is bundled with Vite and tested with state-space verification, headless end-to-end tests in Chromium, and gamepad input simulation.",
      stages: [
        { title: "Browser APIs", items: ["Gamepad API", "Web Speech API", "Web Audio API"] },
        { title: "Game logic", items: ["Turn-based rules and state", "Vanilla JS ES modules"] },
        { title: "3D scene", items: ["Three.js", "GSAP animation"] },
      ],
      support: {
        title: "Testing",
        items: ["State-space verification (~6.5M assertions)", "Headless E2E tests in Chromium", "Gamepad input simulation"],
      },
      note: "Bundled with Vite. Runs fully offline with no backend.",
    },
    decisions: [
      {
        title: "No backend",
        detail: "The whole game runs in the browser and works fully offline.",
        why: "There is no server to deploy or keep running.",
      },
      {
        title: "Vanilla JavaScript with ES modules",
        detail: "About 18k lines of vanilla JavaScript organized as ES modules and bundled with Vite.",
      },
      {
        title: "Exhaustive state-space verification",
        detail: "The tests verify the game's state space exhaustively, about 6.5M assertions in total.",
        why: "That covers far more situations than spot-checking a few hand-picked scenarios.",
      },
      {
        title: "End-to-end tests with simulated gamepad input",
        detail: "Headless end-to-end tests run in Chromium with simulated gamepad input.",
        why: "That way the real controller input path is tested, not just the game logic behind it.",
      },
      {
        title: "Built on browser APIs",
        detail: "Sound, speech, and controller support use the Web Audio, Web Speech, and Gamepad APIs built into the browser.",
      },
    ],
    results: [
      { value: "Judges' Choice", label: "Award at Defense Tech Jam Seattle 2026", scope: "team" },
      { value: "~6.5M", label: "assertions in state-space verification", scope: "team" },
      { value: "~18k", label: "lines of code, fully offline", scope: "team" },
    ],
    next: [
      "Run playtests to measure whether players' trust in the AI teammate actually calibrates over a session.",
    ],
    stack: ["Three.js", "GSAP", "Vite", "Vanilla JS (ES modules)", "Web Audio API", "Web Speech API", "Gamepad API"],
    toolIds: ["threejs", "javascript"],
    links: {
      github: "https://github.com/SakshiGupta1093/ghostline",
      demo: "https://ghostline-eta.vercel.app/",
    },
    screenshots: [],
  },
  {
    slug: "aowa-knowledge-graph",
    title: "AOWA Knowledge Graph",
    tracks: ["data"],
    summary:
      "A source-labeled knowledge graph of anesthesia resources across Ghana hospitals, built with industry partner Efeeo to map what is known, assumed, and missing before any AI tool is built.",
    teamLabel: "Team of 4, with industry partner Efeeo",
    badges: ["Project Manager and QA Lead", "Industry partner"],
    problem: [
      "AI tools and medical references assume Western hospital resources. In Ghana, much hospital knowledge lives in clinicians' memory and paper records.",
      "This project maps what is known, what is assumed, and what is missing, before any AI tool is built on top of it.",
    ],
    role: {
      summary:
        "Team of 4 graduate students working with industry partner Efeeo (efeeo4good). I was Project Manager and QA Lead, and I also wrote validation code and tests.",
      groups: [
        {
          heading: "Engineering",
          items: [
            "Designed 4 Python safety validation rules covering 5 blind spots the partner's validator missed",
            "Extended scanning from 2 columns to every field across 4 data files while handling false positives",
            "Made sure validation errors never print flagged values, keeping partner data out of CI logs",
          ],
        },
        {
          heading: "Testing",
          items: ["Wrote 67 test cases", "Expanded CI from 30 to 96 automated tests"],
        },
        {
          heading: "Project management and QA",
          items: [
            "Split 15 validator gaps across 3 engineers by domain",
            "Led code review of the team's core PR",
            "Owned the safety boundary and responsible-AI compliance",
          ],
        },
      ],
    },
    architecture: {
      summary:
        "Facts live in CSV files as the source of record, each with a provenance label and review status. Python safety validation rules check every field across the CSV files, and the knowledge graph is then built from them in Neo4j and queried with Cypher, covering 3 hospital levels and 6 categories, with unknowns recorded as gaps. pytest suites run in GitHub Actions.",
      stages: [
        { title: "Source of record", items: ["CSV files", "Provenance label per fact", "Review status per fact"] },
        { title: "Validation", items: ["Python safety rules", "Regex checks on every field", "No flagged values in logs"] },
        { title: "Knowledge graph", items: ["Neo4j + Cypher", "3 hospital levels x 6 categories", "Unknowns recorded as gaps"] },
      ],
      support: {
        title: "CI (GitHub Actions)",
        items: ["96 automated pytest tests", "Scenario tests"],
      },
      note: "No treatment or dosing advice. No partner data is shown on this site.",
    },
    decisions: [
      {
        title: "CSV as the source of record",
        detail: "Facts live in plain CSV files, the project's source of record.",
        why: "The Neo4j graph is built from them.",
      },
      {
        title: "Provenance on every fact",
        detail: "Every fact carries a provenance label and a review status.",
        why: "That makes it clear where each fact came from and whether it has been checked.",
      },
      {
        title: "Record unknowns as gaps",
        detail: "Unknowns are recorded as explicit gaps on the 18-cell coverage map (3 hospital levels x 6 categories).",
        why: "Missing knowledge is never guessed, so the map shows what is not known.",
      },
      {
        title: "A safety boundary",
        detail: "The graph contains no treatment or dosing advice.",
      },
      {
        title: "Keep partner data out of logs",
        detail: "Validation errors never print the flagged values, which keeps partner data out of CI logs.",
      },
    ],
    results: [
      { value: "22 of 24", label: "facts traceable to a source, up from about 1 of 24", scope: "team" },
      { value: "18 of 18", label: "coverage map cells filled or recorded as gaps, up from 8", scope: "team" },
      { value: "14 of 14", label: "scenario tests passing", scope: "team" },
      { value: "30 to 96", label: "automated tests in CI", scope: "mine" },
      { value: "67", label: "test cases written", scope: "mine" },
      { value: "5", label: "validator blind spots covered by 4 new safety rules", scope: "mine" },
    ],
    // Keep planned features (chatbot over the graph, synthetic data) out of this list.
    next: ["Expand coverage with clinician-collected data from more hospitals using the field templates."],
    stack: ["Python", "CSV (source of record)", "Neo4j", "Cypher", "pytest", "Regex validation", "GitHub Actions"],
    toolIds: ["python", "neo4j", "pytest", "regex-validation", "github-actions"],
    links: {
      github: todo("AOWA repo URL, only if Efeeo allows sharing"),
      demo: null,
    },
    screenshots: [], // If added later: no partner data in any image.
  },
  {
    slug: "fraud-detection",
    title: "Transaction Fraud Anomaly Detection",
    tracks: ["data"],
    summary:
      "Fraud detection on 6.3M PaySim transactions, with SQL feature engineering in DuckDB, Isolation Forest vs XGBoost, and a Streamlit dashboard.",
    teamLabel: "Solo project",
    badges: ["6.3M transactions", "0.55 PR-AUC"],
    problem: [
      "Fraud is a small fraction of a very large stream of transactions, so a useful model has to catch fraud without burying reviewers in false alarms.",
      "This project works with 6.3M PaySim transactions. Models are trained on earlier transactions and tested on later ones.",
    ],
    role: {
      summary:
        "Solo project. I did everything myself: data processing, feature engineering, modeling, and the Streamlit dashboard.",
      groups: [
        {
          heading: "What I built",
          items: [
            "Data processing for 6.3M PaySim transactions in DuckDB",
            "Feature engineering: time-series features with SQL window functions",
            "Modeling: Isolation Forest compared against XGBoost on a time-based train/test split",
            "The Streamlit dashboard",
          ],
        },
      ],
    },
    architecture: {
      summary:
        "6.3M PaySim transactions are loaded into DuckDB. Time-series features are built with SQL window functions. Isolation Forest and XGBoost are compared using a time-based train/test split, and a Streamlit dashboard shows the model outputs.",
      stages: [
        { title: "Data", items: ["6.3M PaySim transactions", "DuckDB"] },
        { title: "Features", items: ["SQL window functions", "Time-series features"] },
        { title: "Models", items: ["Time-based train/test split", "Isolation Forest", "XGBoost"] },
        { title: "Dashboard", items: ["Streamlit"] },
      ],
    },
    decisions: [
      {
        title: "DuckDB for 6.3M rows",
        detail: "All 6.3M PaySim transactions are loaded into DuckDB.",
        why: "DuckDB runs analytical SQL over the full dataset in-process, with no database server to manage.",
      },
      {
        title: "Features in SQL",
        detail: "Time-series features are computed with SQL window functions.",
      },
      {
        title: "Time-based split",
        detail: "Models are trained on earlier transactions and tested on later ones.",
        why: "That keeps future information out of training.",
      },
      {
        title: "Isolation Forest vs XGBoost",
        detail: "An Isolation Forest was compared against XGBoost.",
        why: "The comparison puts unsupervised anomaly detection up against supervised classification.",
      },
      {
        title: "Metrics that fit rare events",
        detail: "Because fraud is rare, models are judged on PR-AUC and precision at a given recall rather than accuracy.",
      },
    ],
    results: [
      { value: "0.55", label: "PR-AUC (XGBoost)" },
      { value: "78%", label: "precision at 65% recall (XGBoost)" },
      { value: "6.3M", label: "transactions analyzed" },
    ],
    next: [
      "Tune the decision threshold around the cost of missed fraud versus false alarms.",
      "Test the model on newer data.",
    ],
    stack: ["Python", "DuckDB", "SQL window functions", "Isolation Forest", "XGBoost", "Streamlit"],
    toolIds: ["python", "duckdb", "sql", "xgboost", "streamlit"],
    links: {
      github: todo("Fraud Detection repo URL"),
      demo: null, // No Streamlit demo link in links.txt.
    },
    screenshots: [],
  },
];

/* -------------------------------------------------------------------------- */
/*  More projects grid                                                         */
/* -------------------------------------------------------------------------- */

export interface Project {
  slug: string;
  title: string;
  tracks: FocusTrack[];
  summary: string;
  /** Team context, only when known (for example "Two-person team"). */
  context?: string;
  /** A real outcome or number, only when given. */
  highlight?: string;
  stack: string[];
  toolIds: ToolId[];
  /** repoReady: false hides the link until the repo is ready to share. */
  links: { github: OrTodo<string>; repoReady?: boolean };
}

export const projects: Project[] = [
  {
    slug: "echocoach",
    title: "EchoCoach",
    tracks: ["swe", "ml"],
    summary:
      "An AI mock-interview coach with a persistent weakness graph that routes follow-up questions to weak areas. Includes Gemini vision grading of whiteboard sketches and a voice mode.",
    context: "Team hackathon project",
    stack: [
      "Python",
      "FastAPI",
      "Cognee (graph-vector memory)",
      "PostgreSQL",
      "Gemini",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Monaco Editor",
      "Web Speech API",
    ],
    toolIds: ["python", "fastapi", "postgresql", "nextjs", "typescript", "tailwind"],
    links: { github: "https://github.com/vatsalp2008/EchoCoach" },
  },
  {
    slug: "multi-llm-eval",
    title: "Multi-LLM Comparison and Eval Platform",
    tracks: ["swe", "ml"],
    summary:
      "Sends the same prompt to GPT-4, Claude, and Gemini concurrently through OpenRouter and scores the answers with an LLM judge on accuracy, groundedness, and reasoning. If one provider fails, the run continues.",
    stack: ["FastAPI", "asyncio", "OpenRouter", "GPT-4", "Claude", "Gemini", "LLM-as-judge", "React", "TypeScript"],
    toolIds: ["fastapi", "asyncio", "llm-judge", "react", "typescript"],
    links: { github: "https://github.com/SakshiGupta1093/Multi-LLM-Eval" },
  },
  {
    slug: "third-place-finder",
    title: "Third Place Finder",
    tracks: ["swe"],
    summary:
      "Recommends nearby public spaces using geolocation, with LLM chat onboarding through Groq and results shown on Leaflet maps.",
    context: "Two-person team",
    highlight: "Used by many classmates",
    stack: ["React", "TypeScript", "Node/Express", "MySQL", "Groq", "Leaflet"],
    toolIds: ["react", "typescript", "node-express", "mysql"],
    links: { github: "https://github.com/shravanibnikam/Third-Place-Finder-Web" },
  },
  {
    slug: "rideshare-dispatch-simulator",
    title: "Rideshare Dispatch Simulator",
    tracks: ["swe"],
    summary:
      "An event-driven Java simulation of ride dispatch using the Strategy and Observer patterns, ReentrantLock concurrency, and Java Streams.",
    highlight: "100% completion across 3 load scenarios, up to 250 concurrent rides",
    stack: ["Java", "Strategy pattern", "Observer pattern", "ReentrantLock", "Java Streams"],
    toolIds: ["java"],
    links: { github: todo("Rideshare Simulator repo URL") },
  },
  {
    slug: "email-workflow-automation",
    title: "Email Workflow Automation",
    tracks: ["ml"],
    summary: "Agents classify, summarize, and route Gmail messages into ClickUp tasks using tool calling.",
    stack: ["Python", "Gmail API", "OAuth", "Gemini API", "LangChain", "CrewAI"],
    toolIds: ["python", "oauth", "langchain", "crewai"],
    links: { github: "https://github.com/SakshiGupta1093/Email-Workflow-Automation-using-Agentic-AI" },
  },
  {
    slug: "document-similarity",
    title: "Document Similarity Comparison",
    tracks: ["ml"],
    summary: "Compares TF-IDF, Doc2Vec, and BERT embeddings for document similarity using cosine similarity.",
    context: "Joint work",
    highlight: "BERT performed best, at 0.821",
    stack: ["spaCy", "NLTK", "Gensim", "Sentence-Transformers", "TF-IDF", "Doc2Vec", "BERT"],
    toolIds: ["spacy", "nltk", "gensim", "sentence-transformers", "embeddings"],
    links: { github: todo("Document Similarity repo URL") },
  },
  {
    slug: "brain-tumor-detection",
    title: "Brain Tumor Detection",
    tracks: ["ml"],
    summary: "A simplified LeNet CNN that classifies MRI scans into 4 classes, trained with data augmentation.",
    highlight: "3,264 MRI images across 4 classes",
    stack: ["TensorFlow/Keras", "OpenCV", "CNN (LeNet)"],
    toolIds: ["tensorflow", "opencv"],
    links: { github: todo("Brain Tumor Detection repo URL") },
  },
  {
    slug: "resume-screening",
    title: "Resume Screening Using ML",
    tracks: ["ml", "data"],
    summary:
      "Multi-label resume classification with TF-IDF and OneVsRest, comparing KNN, Decision Tree, and Random Forest with 5-fold stratified cross-validation.",
    stack: ["scikit-learn", "TF-IDF", "OneVsRest", "KNN", "Decision Tree", "Random Forest"],
    toolIds: ["scikit-learn"],
    links: { github: "https://github.com/SakshiGupta1093/Resume-Screening-Using-Machine-Learning-Techniques" },
  },
  {
    slug: "drug-corpora-scraping",
    title: "Drug Corpora Web Scraping",
    tracks: ["data"],
    summary:
      "Keyword-driven BeautifulSoup scrapers that collect medical text from NHS and WebMD, with regex cleanup, benchmarked against Sketch Engine.",
    stack: ["BeautifulSoup", "Regex", "Sketch Engine"],
    toolIds: ["beautifulsoup"],
    links: { github: todo("Drug Corpora repo URL") },
  },
  {
    slug: "investor-risk-tolerance",
    title: "Investor Risk Tolerance Prediction",
    tracks: ["data"],
    summary:
      "Random Forest regression on the Federal Reserve's Survey of Consumer Finances (SCF) dataset, tuned with GridSearchCV.",
    highlight: "0.76 validation R²",
    stack: ["Python", "scikit-learn", "Random Forest", "GridSearchCV", "SCF dataset"],
    toolIds: ["python", "scikit-learn"],
    links: { github: todo("Investor Risk repo URL") },
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience (same on every track)                                           */
/* -------------------------------------------------------------------------- */

export interface Experience {
  role: string;
  org: string;
  /** Shown as a label so a project isn't mistaken for a job. */
  label?: string;
  period: string;
  bullets: string[];
  toolIds: ToolId[];
  /** Links the entry to its case study page, when there is one. */
  caseStudy?: CaseStudySlug;
}

/** Most recent first. */
export const experience: Experience[] = [
  {
    role: "Project Manager and QA Lead",
    org: "AOWA Knowledge Graph",
    label: "Industry-sponsored project (Northeastern x Efeeo)",
    period: "Fall 2026",
    bullets: [
      "Split 15 validator gaps across 3 engineers by domain and led code review of the team's core PR.",
      "Owned the safety boundary and responsible-AI compliance for a source-labeled knowledge graph of hospital anesthesia resources.",
      "Designed 4 Python safety validation rules and expanded CI from 30 to 96 automated tests.",
    ],
    toolIds: ["python", "neo4j", "pytest", "regex-validation", "github-actions"],
    caseStudy: "aowa-knowledge-graph",
  },
  {
    role: "Data Analytics Associate",
    org: "Northeastern University",
    period: "Jan 2026 to Jul 2026",
    bullets: [
      "Replaced manual operational bottlenecks with automated workflows (SQL, Airtable, Power Automate, Power BI), eliminating 90%+ of manual processing for 100+ students and coordinators.",
      "Queried, cleaned, and validated 774+ records with Python (Pandas, NumPy) and SQL.",
      "Built dashboards tracking student placements, event attendance, and program participation.",
      "Explained insights to the Dean and senior leadership, who used them to launch new student programs.",
    ],
    toolIds: ["sql", "power-bi", "python", "pandas", "numpy"],
  },
  {
    role: "AI Intern",
    org: "Amdocs",
    period: "Jul 2024 to Dec 2024",
    bullets: [
      "Built and deployed Python ML pipelines for text classification and entity extraction on unstructured enterprise data, improving processing speed by 2x.",
      "Built Power BI dashboards tracking AI adoption metrics and presented weekly readouts to engineering leads.",
    ],
    toolIds: ["python", "power-bi", "sql"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Publications                                                               */
/* -------------------------------------------------------------------------- */

export interface Publication {
  title: string;
  venue: string;
  year: number;
  authorRole: "First author" | "Co-author";
  highlight?: string;
  doi?: string;
  href: OrTodo<string>;
}

export const publications: Publication[] = [
  {
    title: "Parkinson's Disease Prediction: Integrating ML Techniques and Drug NER",
    venue: "Vidhyayana ICSSCC-2025",
    year: 2025,
    authorRole: "First author",
    highlight: "XGBoost reached 92.30% accuracy",
    href: "http://www.vidhyayanaejournal.org/index.php/journal/article/view/e5j3jh60",
  },
  {
    title: "Creating Drugs Related Corpora for Efficient Drug NER",
    venue: "Vidhyayana ICTSM-2024",
    year: 2024,
    authorRole: "Co-author",
    href: "https://link.springer.com/chapter/10.1007/978-981-96-1452-3_23",
  },
  {
    title: "Crop Prediction Analysis Using Machine Learning Techniques",
    venue: "IEEE ICSCNA 2023",
    year: 2023,
    authorRole: "Co-author",
    doi: "10.1109/ICSCNA58489.2023.10370674",
    href: "https://doi.org/10.1109/ICSCNA58489.2023.10370674",
  },
];

/* -------------------------------------------------------------------------- */
/*  Education                                                                  */
/* -------------------------------------------------------------------------- */

export interface Education {
  school: string;
  degree: string;
  location: string;
  period: string;
  grade: string;
}

export const education: Education[] = [
  {
    school: "Northeastern University",
    degree: "MS, Computer Science",
    location: "Seattle",
    period: "2025 to 2027",
    grade: "GPA 3.8/4.0",
  },
  {
    school: "MIT World Peace University",
    degree: "BTech, Computer Science (AI and Data Science)",
    location: "Pune",
    period: "2021 to 2025",
    grade: "CGPA 8.98/10",
  },
];

/* -------------------------------------------------------------------------- */
/*  Awards and involvement                                                     */
/* -------------------------------------------------------------------------- */

export interface Recognition {
  title: string;
  detail: string;
  kind: "award" | "involvement";
  caseStudy?: CaseStudySlug;
}

export const recognition: Recognition[] = [
  {
    title: "Judges' Choice Award",
    detail: "Defense Tech Jam Seattle 2026, for GHOSTLINE",
    kind: "award",
    caseStudy: "ghostline",
  },
  {
    title: "Global Learner Support Ambassador",
    detail: "Northeastern University, Seattle",
    kind: "involvement",
  },
  {
    title: "Volunteer",
    detail: "DubHacks 26",
    kind: "involvement",
  },
];

/* -------------------------------------------------------------------------- */
/*  "Ask my portfolio" chatbot                                                 */
/* -------------------------------------------------------------------------- */

export const chatbot = {
  title: "Ask my portfolio",
  greeting: "Hi! I can answer questions about Sakshi's projects, experience, and skills.",
  starters: [
    "What has she built with RAG?",
    "What's her strongest SWE project?",
    "Does she have data pipeline experience?",
  ],
  /** Shown when the bot doesn't know the answer. */
  fallbackContact: profile.email,
};
