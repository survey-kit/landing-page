import type { MetadataRoute } from "next"

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e293b",
    orientation: "portrait-primary",
    categories: ["developer tools", "productivity"],
    icons: [
      {
        src: "/logo.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/logo.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
    ],
  }
}
