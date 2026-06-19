import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG (needed for local bank logos in /public/banks/*.svg).
    // Paired with attachment disposition + strict CSP as the recommended
    // security mitigation for next/image SVG handling.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allowlist remote hosts used by seeded car/credit/brand images.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.carlogos.org" },
      { protocol: "https", hostname: "logo.clearbit.com" }, // brend logolari (seed-data)
      { protocol: "https", hostname: "loremflickr.com" }, // mashina rasmlari, `car` tegli (seed-data)
      { protocol: "https", hostname: "picsum.photos" }, // eski placeholder rasmlar (zaxira)
    ],
  },
};

export default nextConfig;
