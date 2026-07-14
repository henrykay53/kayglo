import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  author: string;
  category: string;
  readingTime: number; // minutes
};

export type Post = PostMeta & { html: string };

function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function fileToMeta(filename: string): PostMeta {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: (data.date ? new Date(data.date) : new Date(0)).toISOString(),
    author: data.author ?? "Kayglo",
    category: data.category ?? "Insights",
    readingTime: readingTime(content),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(fileToMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: (data.date ? new Date(data.date) : new Date(0)).toISOString(),
    author: data.author ?? "Kayglo",
    category: data.category ?? "Insights",
    readingTime: readingTime(content),
    html,
  };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
