import type { NextConfig } from "next";

/** Origin and websocket origin of the Supabase project, so staging and production each allow their own. */
function supabaseOrigins(): string[] {
  try {
    const { origin, host } = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return [origin, `wss://${host}`];
  } catch {
    return [];
  }
}

/**
 * Report-only for now: violations show in the browser console and nothing is blocked. Next.js inlines
 * a different RSC payload script on every page, so `'unsafe-inline'` stays in script-src until the app
 * moves to per-request nonces (which forces dynamic rendering and needs a service-worker rework).
 * The other directives are strict. Watch the console, then switch the header name to enforce.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src ${["'self'", ...supabaseOrigins(), "https://vitals.vercel-insights.com"].join(" ")}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action ${["'self'", ...supabaseOrigins().slice(0, 1), "https://accounts.google.com"].join(" ")}`,
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Landing art filenames never change, so let optimized copies live for 31 days.
    minimumCacheTTL: 2678400,
    // 60 is the hero engraving; 75 is the default for everything else.
    qualities: [60, 75],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Two years, no preload: submitting to the preload list is hard to undo.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
