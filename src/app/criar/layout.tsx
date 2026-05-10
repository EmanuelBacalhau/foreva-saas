import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar carta",
  description:
    "Escreva sua carta de amor, anexe fotos e proteja com senha. Pagamento via PIX único.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/criar" },
};

export default function CriarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
