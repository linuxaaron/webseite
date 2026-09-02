import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Joscha Schmidt",
    short_name: "Joscha Schmidt",
    description: "Webentwicklung und Cybersecurity von Joscha Schmidt.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    icons: [
      {
        src: "/sunflower-logo.png?v=4",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
