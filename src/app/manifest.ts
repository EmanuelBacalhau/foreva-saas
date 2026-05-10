import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Foreva — Cartas de amor eternas",
    short_name: "Foreva",
    description:
      "Crie uma carta de amor eterna na internet. Fotos, senha e PIX único.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7fb",
    theme_color: "#ff3d8a",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
