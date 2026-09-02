"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent-v3";
const CONSENT_UPDATED_EVENT = "cookie-consent-updated";

function hasMarketingConsent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Loads AdSense only after the visitor has opted in to marketing technologies. */
export function AdSense() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateConsent = () => setEnabled(hasMarketingConsent());
    updateConsent();
    window.addEventListener(CONSENT_UPDATED_EVENT, updateConsent);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, updateConsent);
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="adsense"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2162793628214003"
      crossOrigin="anonymous"
    />
  );
}
