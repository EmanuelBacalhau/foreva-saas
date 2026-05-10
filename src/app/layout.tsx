import type { Metadata } from "next";
import { DynaPuff, Caveat, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const dynapuff = DynaPuff({
  variable: "--font-dynapuff",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Foreva — Cartas de amor eternas | Página personalizada com PIX único",
    template: "%s · Foreva",
  },
  description:
    "Crie uma carta de amor eterna na internet. Anexe fotos, proteja com senha e pague um PIX único de R$ 19,90. Perfeito para Dia dos Namorados, aniversário e pedidos de namoro.",
  applicationName: "Foreva",
  authors: [{ name: "Foreva" }],
  creator: "Foreva",
  publisher: "Foreva",
  category: "Lifestyle",
  keywords: [
    "carta de amor",
    "carta de amor online",
    "página de amor",
    "dia dos namorados",
    "presente dia dos namorados",
    "presente romântico",
    "pedido de namoro",
    "declaração de amor",
    "site para namorada",
    "site para namorado",
    "carta eterna",
    "love letter",
    "PIX",
  ],
  alternates: {
    canonical: "/",
    languages: { "pt-BR": "/" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Foreva",
    title: "Foreva — Cartas de amor eternas",
    description:
      "Uma carta de amor que dura para sempre. Fotos, senha, PIX único. Presente perfeito para Dia dos Namorados.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Foreva — Cartas de amor eternas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foreva — Cartas de amor eternas",
    description:
      "Uma carta de amor que dura para sempre. Fotos, senha, PIX único.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={cn(dynapuff.variable, caveat.variable, inter.variable, "antialiased")}
    >
      <body className="min-h-dvh flex flex-col text-ink relative">
        <FloatingDecor />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast:
                "glass-pink !rounded-3xl !border !shadow-xl !text-ink",
              title: "font-semibold tracking-tight",
              description: "text-ink-soft",
            },
          }}
        />
      </body>
    </html>
  );
}

function FloatingDecor() {
  // floating sparkles & hearts — purely decorative
  const items = [
    { top: "8%",  left: "6%",  emoji: "✦", size: "text-2xl",  c: "text-lilac-deep",  d: "float-slow" },
    { top: "16%", left: "92%", emoji: "✿", size: "text-3xl",  c: "text-pink-hot",    d: "float-mid"  },
    { top: "44%", left: "3%",  emoji: "♡", size: "text-xl",   c: "text-pink-flame",  d: "float-fast" },
    { top: "62%", left: "96%", emoji: "✦", size: "text-2xl",  c: "text-sky-deep",    d: "float-slow" },
    { top: "78%", left: "8%",  emoji: "✿", size: "text-2xl",  c: "text-lilac",       d: "float-mid"  },
    { top: "30%", left: "85%", emoji: "★", size: "text-lg",   c: "text-pink-hot",    d: "twinkle"    },
    { top: "55%", left: "78%", emoji: "♡", size: "text-2xl",  c: "text-pink-soft",   d: "float-slow" },
    { top: "88%", left: "70%", emoji: "✦", size: "text-xl",   c: "text-lilac-deep",  d: "twinkle"    },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("absolute select-none", it.size, it.c, it.d)}
          style={{ top: it.top, left: it.left }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
