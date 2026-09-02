import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Next 16.3.2 fails to parse this project's otherwise valid `tsc --showConfig`
  // output when its experimental CLI checker is enabled. The TypeScript API path
  // performs the same build type checks without that faulty subprocess parsing.
  experimental: {
    useTypeScriptCli: false,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "linuxaaron.dpdns.org" }],
        destination: "https://www.joschaschmidt.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "joschaschmidt.com" }],
        destination: "https://www.joschaschmidt.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
