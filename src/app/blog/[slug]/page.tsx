import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import fs from "node:fs/promises";
import path from "node:path";

const posts = ["welches-betriebssystem-empfehle-ich", "vpn-empfehlungen-proton-mullvad", "osint-webanalyse", "essential-linux-commands-cybersecurity", "burp-suite-nuclei-websecurity", "hardware-geldmacherei-it-einsteiger"];
type Frontmatter = { title: string; date: string; category: string };

function parseFrontmatter(source: string): { frontmatter: Frontmatter; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Invalid blog frontmatter");
  const values = Object.fromEntries(match[1].split("\n").map((line) => {
    const separator = line.indexOf(":");
    if (separator < 0) return [line.trim(), ""];
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^\"|\"$/g, "")];
  }));
  return { frontmatter: { title: values.title ?? "", date: values.date ?? "", category: values.category ?? "" }, body: match[2].trim() };
}

async function getPost(slug: string) {
  if (!posts.includes(slug)) return null;
  const source = await fs.readFile(path.join(process.cwd(), "src/content/blog", `${slug}.mdx`), "utf8");
  return parseFrontmatter(source);
}

export function generateStaticParams() { return posts.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const description = `${post.frontmatter.title} | Technischer Beitrag von Joscha Aaron Schmidt zu ${post.frontmatter.category}.`;
  return {
    title: post.frontmatter.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: post.frontmatter.title, description, publishedTime: post.frontmatter.date, authors: ["Joscha Aaron Schmidt"], url: `https://www.joschaschmidt.com/blog/${slug}` },
    twitter: { card: "summary_large_image", title: post.frontmatter.title, description },
  };
}

function safeHref(value: string): string | null {
  try { const url = new URL(value, "https://www.joschaschmidt.com"); return url.protocol === "https:" || url.protocol === "http:" ? url.href : null; } catch { return null; }
}

function renderInline(text: string): ReactNode[] {
  const pattern = /(\[[^\]]+\]\([^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  return text.split(pattern).map((part, index) => {
    if (!part) return null;
    if (part.startsWith("[") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
      if (match) { const href = safeHref(match[2]); if (href) return <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline underline-offset-4">{match[1]}</a>; }
      return part;
    }
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent)]">{part.slice(1, -1)}</code>;
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function renderMarkdown(body: string) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [], list: string[] = [], orderedList: string[] = [], quote: string[] = [], code: string[] = [];
  let inCode = false;
  const flushParagraph = () => { if (!paragraph.length) return; blocks.push(<p key={`p-${blocks.length}`} className="mt-5 leading-8 text-[var(--muted)]">{renderInline(paragraph.join(" ").trim())}</p>); paragraph = []; };
  const flushLists = () => {
    if (list.length) { blocks.push(<ul key={`ul-${blocks.length}`} className="mt-5 list-disc space-y-2 pl-6 leading-7 text-[var(--muted)]">{list.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>); list = []; }
    if (orderedList.length) { blocks.push(<ol key={`ol-${blocks.length}`} className="mt-5 list-decimal space-y-2 pl-6 leading-7 text-[var(--muted)]">{orderedList.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ol>); orderedList = []; }
  };
  const flushQuote = () => { if (!quote.length) return; blocks.push(<blockquote key={`quote-${blocks.length}`} className="mt-6 border-l-2 border-[var(--accent)] pl-5 italic leading-8 text-[var(--muted)]">{quote.map((line, i) => <p key={i}>{renderInline(line)}</p>)}</blockquote>); quote = []; };
  const flushCode = () => { if (!code.length) return; blocks.push(<pre key={`code-${blocks.length}`} className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-black/30 p-5 font-mono text-sm leading-6 text-[var(--text)]"><code>{code.join("\n")}</code></pre>); code = []; };
  const flushAll = () => { flushParagraph(); flushLists(); flushQuote(); };

  for (const line of lines) {
    if (line.trim().startsWith("```")) { if (inCode) flushCode(); else flushAll(); inCode = !inCode; continue; }
    if (inCode) { code.push(line); continue; }
    const trimmed = line.trim();
    if (!trimmed) { flushAll(); continue; }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const Tag = level === 3 ? "h3" : "h2";
      blocks.push(<Tag key={`h-${blocks.length}`} className={level === 3 ? "mt-8 text-xl font-semibold" : "mt-10 text-2xl font-semibold tracking-tight"}>{renderInline(heading[2])}</Tag>);
      continue;
    }
    if (/^---+$/.test(trimmed)) { flushAll(); blocks.push(<hr key={`hr-${blocks.length}`} className="my-10 border-[var(--border)]" />); continue; }
    if (trimmed.startsWith("> ")) { flushParagraph(); flushLists(); quote.push(trimmed.slice(2)); continue; }
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) { flushParagraph(); flushQuote(); orderedList = []; list.push(unordered[1]); continue; }
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) { flushParagraph(); flushQuote(); list = []; orderedList.push(ordered[1]); continue; }
    flushLists(); flushQuote(); paragraph.push(trimmed);
  }
  if (inCode) flushCode(); flushAll(); return blocks;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { frontmatter, body } = post;
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", "@id": `https://www.joschaschmidt.com/blog/${slug}#article`, headline: frontmatter.title,
    datePublished: frontmatter.date, dateModified: frontmatter.date,
    author: { "@type": "Person", "@id": "https://www.joschaschmidt.com/#person", name: "Joscha Aaron Schmidt", url: "https://www.joschaschmidt.com" },
    publisher: { "@type": "Person", "@id": "https://www.joschaschmidt.com/#person", name: "Joscha Aaron Schmidt", url: "https://www.joschaschmidt.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.joschaschmidt.com/blog/${slug}` }, inLanguage: "de-DE", articleSection: frontmatter.category,
  };
  return <main className="container py-20 sm:py-28"><article className="mx-auto max-w-3xl"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} /><div className="font-mono text-xs text-[var(--muted)]"><span>{frontmatter.date}</span> · <span className="text-[var(--accent)]">{frontmatter.category}</span></div><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{frontmatter.title}</h1><div className="mt-10">{renderMarkdown(body)}</div></article></main>;
}
