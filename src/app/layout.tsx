import type { Metadata } from "next";
import { Karla, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { BitcoinTicker } from "@/components/bitcoin-ticker";
import { CursorLiquid } from "@/components/cursor-liquid";
import { CuteFooterCat } from "@/components/cute-footer-cat";

const karla = Karla({ subsets: ["latin"], display: "swap", variable: "--font-karla", weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", variable: "--font-plex-mono", weight: ["400", "500", "600"] });

const siteUrl = "https://www.joschaschmidt.com";
const siteName = "Joscha Schmidt | Webentwicklung & Cybersecurity";
const siteDescription = "Joscha Schmidt, auch Joscha Aaron Schmidt, entwickelt professionelle Websites und Webanwendungen und arbeitet mit Linux, OSINT, Web Security und Cybersecurity.";
const favicon = "/icon.svg?v=3";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: "%s | Joscha Schmidt" },
  description: siteDescription,
  applicationName: "Joscha Schmidt",
  authors: [{ name: "Joscha Schmidt", url: siteUrl }],
  creator: "Joscha Schmidt",
  publisher: "Joscha Schmidt",
  keywords: ["Joscha Schmidt", "Joscha Aaron Schmidt", "Webentwicklung", "Website erstellen", "Webdesign", "Full Stack Development", "Cybersecurity", "Web Security", "IT Security", "OSINT", "Linux", "Cloud Computing", "Security Audit", "IT Beratung", "Linux Aaron"],
  icons: { icon: [{ url: favicon, type: "image/svg+xml", sizes: "any" }], shortcut: [{ url: favicon, type: "image/svg+xml" }], apple: [{ url: favicon, type: "image/svg+xml", sizes: "180x180" }] },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: siteName, description: siteDescription, type: "website", url: siteUrl, siteName, locale: "de_DE" },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
};

const personSchema = { "@context": "https://schema.org", "@type": "Person", "@id": `${siteUrl}/#person`, name: "Joscha Aaron Schmidt", alternateName: ["Joscha Schmidt", "Linux Aaron"], url: siteUrl, email: "mailto:joschaschmidt@mail.de", sameAs: ["https://github.com/linuxaaron", "https://www.instagram.com/linux_aaron/", "https://www.tiktok.com/@linux_aaron/"], jobTitle: "Full Stack Developer", knowsAbout: ["Webentwicklung", "Full Stack Development", "Cybersecurity", "Web Security", "OSINT", "Linux", "Cloud Computing", "IT"], mainEntityOfPage: siteUrl };
const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Joscha Schmidt", alternateName: ["Joscha Aaron Schmidt", "Linux Aaron"], url: siteUrl, description: siteDescription, inLanguage: "de-DE", publisher: { "@id": `${siteUrl}/#person` }, about: { "@id": `${siteUrl}/#person` } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <head>
        <meta name="google-site-verification" content="SjcxIb0LYpV5eAe7mZOXWJgi7nXtGW8fSQIGP2A9erY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try { if (localStorage.getItem("theme") === "dark") document.documentElement.classList.add("dark"); } catch {}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className={`${karla.variable} ${plexMono.variable}`}>
        <a href="#main-content" className="skip-link">Zum Hauptinhalt springen</a>
        <CursorLiquid />
        <SiteHeader />
        <BitcoinTicker />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <CuteFooterCat />
        <CookieConsent />
      </body>
    </html>
  );
}
