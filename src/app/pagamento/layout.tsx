import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento",
  description: "Pagamento via PIX da sua carta Foreva.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PagamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
