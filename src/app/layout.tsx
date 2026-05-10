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

export const metadata: Metadata = {
  title: "Amora ♡ Uma carta para sempre",
  description:
    "Uma carta de amor que dura para sempre. Fotos, senha, PIX único e a página fica eterna ✨",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Amora ♡ Uma carta para sempre",
    description: "Uma carta que não some. Fotos, senha, PIX único.",
    type: "website",
    locale: "pt_BR",
  },
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
