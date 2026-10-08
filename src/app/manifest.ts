import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "INFO-L@N",
    short_name: "INFO-L@N",
    description: "Computer equipment sales, installation, and maintenance in Casablanca.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#006BB6",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
