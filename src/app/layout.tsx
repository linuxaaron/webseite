import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Karla, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { BitcoinTicker } from "@/components/bitcoin-ticker";
import { CursorLiquid } from "@/components/cursor-liquid";
import { AdSense } from "@/components/adsense";

const karla = Karla({ subsets: ["latin"], display: "swap", variable: "--font-karla", weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], display: "swap", variable: "--font-plex-mono", weight: ["400", "500", "600"] });

const siteUrl = "https://www.joschaschmidt.com";
const siteName = "Joscha Schmidt | Cybersecurity, Webentwicklung & IT Security";
const siteDescription = "Cybersecurity, Web Security und Webentwicklung von Joscha Schmidt: technische Sicherheitsanalysen, Security Audits, OSINT, Linux und professionelle Webanwendungen.";
const favicon = "/icon.svg?v=3";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: "%s | Joscha Schmidt" },
  description: siteDescription,
  category: "technology",
  applicationName: "Joscha Schmidt",
  authors: [{ name: "Joscha Schmidt", url: siteUrl }],
  creator: "Joscha Schmidt",
  publisher: "Joscha Schmidt",
  icons: { icon: [{ url: favicon, type: "image/svg+xml", sizes: "any" }], shortcut: [{ url: favicon, type: "image/svg+xml" }], apple: [{ url: favicon, type: "image/svg+xml", sizes: "180x180" }] },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: siteName, description: siteDescription, type: "website", url: siteUrl, siteName: "Joscha Schmidt", locale: "de_DE" },
  twitter: { card: "summary_large_image", title: siteName, description: siteDescription },
};

const personSchema = { "@context": "https://schema.org", "@type": "Person", "@id": `${siteUrl}/#person`, name: "Joscha Aaron Schmidt", alternateName: ["Joscha Schmidt", "Linux Aaron"], url: siteUrl, email: "mailto:joschaschmidt@mail.de", sameAs: ["https://github.com/linuxaaron", "https://www.instagram.com/linux_aaron/", "https://www.tiktok.com/@linux_aaron/"], jobTitle: "Full Stack Developer", knowsAbout: ["Cybersecurity", "Cyber Security", "IT Security", "Web Security", "Security Audits", "Webentwicklung", "Full Stack Development", "OSINT", "Linux Security", "Linux", "Cloud Computing", "IT"], mainEntityOfPage: siteUrl };
const websiteSchema = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Joscha Schmidt", alternateName: ["Joscha Aaron Schmidt", "Linux Aaron"], url: siteUrl, description: siteDescription, inLanguage: "de-DE", publisher: { "@id": `${siteUrl}/#person` }, about: ["Cybersecurity", "Web Security", "IT Security", "Webentwicklung", "OSINT", "Linux"] };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="de">
      <head>
        <meta name="google-site-verification" content="SjcxIb0LYpV5eAe7mZOXWJgi7nXtGW8fSQIGP2A9erY" />
        <Script
          id="theme-preference"
          nonce={nonce}
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `try { if (localStorage.getItem("theme-v2") === "dark") document.documentElement.classList.add("dark"); } catch {}` }}
        />
        <Script
          id="person-schema"
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="website-schema"
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${karla.variable} ${plexMono.variable}`}>
        <a href="#main-content" className="skip-link">Zum Hauptinhalt springen</a>
        <CursorLiquid />
        <SiteHeader />
        <BitcoinTicker />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <CookieConsent />
        <AdSense />
      </body>
    </html>
  );
}
