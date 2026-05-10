import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carta",
  description: "Uma carta de amor eterna no Foreva.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function LetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
