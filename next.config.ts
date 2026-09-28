import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Cloudflare Pages (Free Tier) static export ─────────────────────────────
  output: "export",            // emits a fully static site into ./out
  trailingSlash: true,         // /product/?slug=x style URLs resolve cleanly on CF Pages
  images: {
    // CF Pages static hosting cannot run the Next.js image optimizer.
    unoptimized: true,
  },
  // No rewrites/redirects/headers here — those are configured via
  // public/_headers & public/_redirects (or Cloudflare dashboard rules).
};

export default nextConfig;
