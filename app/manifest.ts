import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ora — Catholic prayer",
    short_name: "Ora",
    description: "A calm place to keep your prayers and pray the Rosary.",
    id: "/",
    start_url: "/rosary",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8f4ea",
    theme_color: "#f8f4ea",
    categories: ["lifestyle", "education"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [{ name: "Pray the Rosary", url: "/rosary" }],
  };
}
