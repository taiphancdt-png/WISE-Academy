export interface Expert {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  tags: string[];
  image: string | null;
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
  tags?: string[];
}
