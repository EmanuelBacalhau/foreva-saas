import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasAccess } from "@/lib/access";
import Letter from "@/components/Letter";
import PasswordGate from "./PasswordGate";

export default async function MessagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.lovePage.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  if (!page.paid) {
    return (
      <main className="relative z-[1] min-h-dvh flex flex-col">
        <header className="sticky top-0 z-30 px-5 md:px-10 pt-4 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl">
            <div className="glass pill flex items-center justify-between px-3 md:px-4 py-2.5">
              <div className="flex items-center gap-2 px-3">
                <span className="text-pink-hot pulse-heart">♡</span>
                <span className="display-bubble text-2xl">Amora</span>
              </div>
              <span className="eyebrow-y2k">Aguardando ✿</span>
            </div>
          </div>
        </header>
        <section className="flex-1 flex items-center justify-center px-5 py-12">
          <div className="w-full max-w-md relative">
            <div className="absolute -inset-10 blob-lilac rounded-[40%] opacity-30 blur-3xl float-slow" aria-hidden />
            <div className="relative glass-pink rounded-[2.5rem] p-10 md:p-12 text-center -rotate-[0.6deg]">
              <div className="text-4xl text-pink-hot pulse-heart mx-auto">♡</div>
              <p className="eyebrow-y2k mt-4">Página ainda não liberada</p>
              <h1 className="display-bubble text-3xl md:text-4xl mt-3">
                Essa <span className="script text-pink-hot text-[1.2em]">cartinha</span>{" "}
                espera <span className="text-gradient">o PIX</span>.
              </h1>
              <p className="text-ink-soft leading-relaxed mt-5">
                Assim que o pagamento for confirmado, a página fica disponível
                neste mesmo endereço ✨
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (page.passwordHash) {
    const ok = await hasAccess(slug);
    if (!ok) {
      return <PasswordGate slug={slug} recipient={page.recipient} />;
    }
  }

  return (
    <Letter
      title={page.title}
      recipient={page.recipient}
      greeting={page.greeting}
      letterBody={page.letterBody}
      signature={page.signature}
      images={page.images.map((i) => ({ url: i.url, caption: i.caption }))}
    />
  );
}
