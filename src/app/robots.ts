import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas da plataforma ficam fora do Google.
      disallow: ["/app", "/admin", "/api", "/auth"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
