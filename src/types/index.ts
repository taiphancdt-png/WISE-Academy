export interface Expert {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  tags: string[];
  image: string | null;
  /** portrait with the background removed, used on the profile hero */
  cutout?: string;
  /** "vietnam" = Vietnamese experts, "international" = foreign experts (shown as a separate group) */
  group: "vietnam" | "international";
  // optional full profile (from the expert's CV), shown on their landing page
  highlights?: { value: string; label: string }[];
  expertise?: string[];
  career?: { period: string; org: string; role: string }[];
  experience?: { client: string; period: string; text: string; metric?: string }[];
  certifications?: { name: string; org: string; group?: string; core?: boolean }[];
  education?: { degree: string; school: string }[];
  regions?: { country: string; text: string }[];
  languages?: string;
  photos?: { src: string; caption: string }[];
  testimonials?: { name: string; role: string; quote: string }[];
}

export interface ProjectResult {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  client: string;
  industry: string;
  title: string;
  description: string;
  results: ProjectResult[];
  highlight: string;
  tags: string[];
  cover?: string | null;
  gallery?: string[];
  images?: string[];
  // full case study, shown when the project is expanded
  partner?: string;
  challenge?: string;
  solution?: string;
  steps?: { name: string; text: string }[];
  goals?: string[];
  info?: { label: string; value: string }[];
  outcome?: string;
}

export interface Course {
  id: string;
  title: string;
  belt: string;
  category: string;
  duration: string;
  target: string;
  summary: string;
  outcomes: string[];
  badge: string;
  accent_color: string;
  image?: string | null;
  /** Optional downloadable program brochure (PDF under /public) */
  brochure?: string;
  /** Topic sub-group within the practitioner programs (e.g. "Năng suất") */
  topic?: string;
}

export interface TocItem {
  level: number;
  title: string;
  anchor: string;
}

export interface Article {
  id: string;
  slug?: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image?: string | null;
  thumbnail?: string | null;
  images?: string[];
  toc?: TocItem[];
  author?: string;
  /** Extra topics the article also appears under (e.g. "Six Sigma"), besides its main category */
  topics?: string[];
  /** "social" for posts imported from Facebook / LinkedIn */
  source?: string;
}

export interface LeanTool {
  slug: string;
  title: string;
  category: string;
  summary: string;
  /** Card image under /public, optional */
  thumbnail?: string | null;
  /** Self-contained HTML exported from Claude Design, served from /public/tools/<slug>/index.html */
  file?: string | null;
  /** External link used instead of an embedded file */
  url?: string | null;
  /** The tool keeps its data in the browser (localStorage), so its frame needs same-origin access */
  saves?: boolean;
  /** Games: the page players open (the embedded file is the host screen) */
  playerUrl?: string | null;
  tags?: string[];
}
