import type { MetadataRoute } from "next";

const base = "https://www.joschaschmidt.com";

const routes = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/projekte", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/webentwicklung", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/shop", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/news", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/newsletter", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/ueber-mich", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/kontakt", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/buchung", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/barrierefreiheit", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/rechtlicher-hinweis", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/blog/osint-webanalyse", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-08-08" },
  { path: "/blog/essential-linux-commands-cybersecurity", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-08-09" },
  { path: "/blog/burp-suite-nuclei-websecurity", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-08-09" },
  { path: "/blog/hardware-geldmacherei-it-einsteiger", priority: 0.7, changeFrequency: "monthly" as const, lastModified: "2026-08-09" },
  { path: "/blog/vpn-empfehlungen-proton-mullvad", priority: 0.8, changeFrequency: "weekly" as const, lastModified: "2026-08-26" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${base}${path}`,
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  }));
}
