import { NextResponse, type NextRequest } from "next/server";

function createContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com",
    "font-src 'self'",
    "connect-src 'self' https://api.coingecko.com https://*.googlesyndication.com https://*.doubleclick.net",
    "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", createContentSecurityPolicy(nonce));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
