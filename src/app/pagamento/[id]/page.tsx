import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PaymentClient from "./PaymentClient";

export default async function PagamentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const page = await prisma.lovePage.findUnique({
    where: { id },
    select: { id: true, recipient: true, slug: true, paid: true },
  });
  if (!page) notFound();

  const priceCents = Number(process.env.PRICE_CENTS ?? "1990");

  return (
    <main className="relative z-[1] flex flex-col">
      <header className="sticky top-0 z-30 px-5 md:px-10 pt-4 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <div className="glass pill flex items-center justify-between px-3 md:px-4 py-2.5">
            <Link href="/" className="flex items-center gap-2 px-3 group">
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform text-ink-soft" />
              <span className="display-bubble text-2xl">Amora</span>
            </Link>
            <span className="eyebrow-y2k hidden md:block">Capítulo II ♡ Pagamento</span>
          </div>
        </div>
      </header>

      <section className="px-5 md:px-10 py-12 md:py-20">
        <div className="mx-auto max-w-5xl grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5 fade-in-up delay-1">
            <p className="eyebrow-y2k">Um PIX, uma vez ✿</p>
            <h1 className="display-bubble text-5xl md:text-6xl mt-3">
              Quase{" "}
              <span className="script text-pink-hot text-[1.18em]">lá</span>
              <span className="text-gradient">!</span>
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mt-5">
              Sua carta para{" "}
              <span className="script text-pink-flame text-2xl">
                {page.recipient}
              </span>{" "}
              está pronta — falta só o pagamento ✨ Assim que confirmar, a página
              fica disponível.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                ["PIX único — sem mensalidade", "✿"],
                ["Página permanente para sempre", "♡"],
                ["QR ou copia-e-cola", "✦"],
                ["Confirmação em segundos", "✨"],
              ].map(([t, e]) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid place-items-center size-8 rounded-full glass-pink text-pink-hot text-base shrink-0">
                    {e}
                  </span>
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-7">
            <PaymentClient
              pageId={page.id}
              slug={page.slug}
              alreadyPaid={page.paid}
              priceCents={priceCents}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
