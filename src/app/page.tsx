import Link from "next/link";
import { ArrowRight, Heart, Lock, Sparkles } from "lucide-react";

export default function Home() {
  const priceCents = Number(process.env.PRICE_CENTS ?? "1990");
  const price = (priceCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <main className="relative z-[1] flex flex-col">
      {/* NAV */}
      <header className="sticky top-0 z-30 px-4 md:px-10 pt-3 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <div className="glass pill flex items-center justify-between gap-2 px-2 md:px-4 py-2 md:py-2.5">
            <Link href="/" className="flex items-center gap-2 px-2 md:px-3 group min-w-0">
              <span className="text-pink-hot text-xl pulse-heart">♡</span>
              <span className="display-bubble text-xl md:text-2xl tracking-tight">
                Foreva
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-soft">
              <a href="#como" className="hover:text-pink-hot transition-colors">Como funciona</a>
              <a href="#exemplo" className="hover:text-pink-hot transition-colors">Um cheirinho</a>
              <a href="#perguntas" className="hover:text-pink-hot transition-colors">Perguntas</a>
            </nav>
            <Link
              href="/criar"
              className="btn-bubble shine pill text-xs md:text-sm !px-4 md:!px-6 !py-2 md:!py-3 whitespace-nowrap"
            >
              Criar carta
              <ArrowRight className="size-3.5 md:size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-5 md:px-10 pt-10 md:pt-20 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl grid grid-cols-12 gap-6 items-center">
          {/* big hero text */}
          <div className="col-span-12 md:col-span-7 relative">
            <div className="inline-flex items-center gap-2 glass pill px-4 py-1.5 fade-in-up delay-1">
              <Sparkles className="size-3.5 text-pink-hot twinkle" />
              <span className="eyebrow-y2k">Edição I · 2026</span>
            </div>

            <h1 className="display-bubble text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.95] mt-5 fade-in-up delay-2">
              Uma{" "}
              <span className="text-gradient">cartinha</span>{" "}
              <br className="hidden md:block" />
              que <span className="script text-pink-hot text-[1.18em]">dura</span>{" "}
              <span className="display-bubble">para</span>{" "}
              <span className="text-gradient">sempre</span>.
              <span className="text-pink-flame ml-2">♡</span>
            </h1>

            <p className="text-base md:text-xl text-ink-soft max-w-xl mt-6 md:mt-7 leading-relaxed fade-in-up delay-3">
              Uma página linda só para ela (ou para ele). Texto, fotos, senha — e
              um <span className="font-semibold text-pink-hot">PIX único</span>.
              A página fica no ar para <em>sempre</em>. Sem mensalidade, sem feed,
              sem nada que estraga.
            </p>

            <div className="mt-8 md:mt-9 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 fade-in-up delay-4">
              <Link href="/criar" className="btn-bubble shine pill text-sm md:text-base w-full sm:w-auto">
                <Heart className="size-4 fill-current" />
                Criar minha carta — {price}
                <ArrowRight className="size-4" />
              </Link>
              <a href="#exemplo" className="btn-glass pill text-sm w-full sm:w-auto">
                <span>Ver um exemplo</span>
                <span className="text-pink-hot">♡</span>
              </a>
            </div>

            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs md:text-sm text-ink-soft fade-in-up delay-5">
              {[
                { i: "✿", t: "Fotos com legenda" },
                { i: "♡", t: "Senha de acesso" },
                { i: "✦", t: "Página eterna" },
                { i: "✨", t: "PIX único" },
              ].map((x) => (
                <span key={x.t} className="inline-flex items-center gap-1.5">
                  <span className="text-pink-hot">{x.i}</span>
                  {x.t}
                </span>
              ))}
            </div>
          </div>

          {/* hero visual — stacked cards */}
          <div className="col-span-12 md:col-span-5 relative h-[380px] sm:h-[440px] md:h-[560px] fade-in-up delay-3">
            {/* big blob behind */}
            <div className="absolute -top-10 -left-10 -right-10 -bottom-10 blob-pink rounded-[50%] opacity-50 blur-3xl spin-slow" aria-hidden />
            <div className="absolute top-20 left-0 right-0 bottom-0 blob-lilac rounded-[50%] opacity-40 blur-2xl float-slow" aria-hidden />

            {/* polaroid card 1 */}
            <div className="absolute top-6 left-2 md:left-8 w-[58%] sticker p-3 -rotate-[6deg] float-slow shine">
              <div className="aspect-[4/5] rounded-2xl blob-peach grid place-items-center">
                <span className="display-bubble text-7xl text-pink-flame">E</span>
              </div>
              <p className="script text-2xl text-pink-hot mt-2 text-center">Paravocê ♡</p>
            </div>

            {/* glass card with handwritten note */}
            <div className="absolute bottom-4 right-0 md:right-4 w-[62%] glass-pink rounded-3xl p-5 rotate-[4deg] float-mid">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow-y2k">No. 001</span>
                <span className="text-pink-hot pulse-heart">♥</span>
              </div>
              <p className="script text-2xl text-ink leading-tight">
                Tem coisas que <br />
                <span className="text-pink-flame">eu só</span> consigo dizer<br />
                em uma <em>carta</em>…
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-xs text-ink-mute">Com amor, A.</span>
                <span className="text-xl text-lilac">✿</span>
              </div>
            </div>

            {/* mini stickers */}
            <div className="absolute top-2 right-2 md:right-6 sticker px-2 md:px-3 py-1 md:py-1.5 -rotate-[12deg] float-fast">
              <span className="text-[10px] md:text-xs font-semibold text-pink-hot">eternal ♡</span>
            </div>
            <div className="absolute bottom-24 md:bottom-32 left-0 sticker px-2 md:px-3 py-1 md:py-1.5 rotate-[8deg] float-mid">
              <span className="text-[10px] md:text-xs font-semibold text-lilac-deep">forever 4u</span>
            </div>
          </div>
        </div>

        {/* MARQUEE — decorativo, mantém lowercase estilizado */}
        <div className="relative mx-auto max-w-7xl mt-16 md:mt-24 overflow-hidden py-6 md:py-8">
          <div className="marquee text-[clamp(2rem,5vw,4rem)] whitespace-nowrap leading-[1.2]">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex items-center gap-10 shrink-0">
                {[
                  ["foreva", "text-pink-hot"],
                  ["♡", "text-lilac-deep"],
                  ["forever", "text-sky-deep"],
                  ["✿", "text-peach"],
                  ["para sempre", "text-pink-flame"],
                  ["✦", "text-lilac"],
                  ["uma carta", "text-pink-hot"],
                  ["♥", "text-pink-flame"],
                  ["only u", "text-lilac-deep"],
                  ["✨", "text-pink-hot"],
                ].map(([t, c], i) => (
                  <span
                    key={`${k}-${i}`}
                    className={`display-bubble ${c}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="px-5 md:px-10 py-16 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-20">
            <p className="eyebrow-y2k fade-in-up delay-1">Passo a passo ✿</p>
            <h2 className="display-bubble text-4xl md:text-7xl mt-3 fade-in-up delay-2">
              <span className="text-gradient">Três</span> passinhos{" "}
              <span className="script text-pink-hot text-[1.1em]">só</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                n: "01",
                title: "Escreva",
                lede: "Para quem, o que sente, uma saudação. Anexe fotinhas, escolha sua assinatura.",
                emoji: "✿",
                blob: "blob-pink",
              },
              {
                n: "02",
                title: "PIX",
                lede: `${price} de uma vez só. Sem mensalidade, sem renovação, sem letra miúda.`,
                emoji: "♡",
                blob: "blob-lilac",
              },
              {
                n: "03",
                title: "Compartilhe",
                lede: "Receba o link mágico. Coloque uma senha se quiser. Só quem você quer entra.",
                emoji: "✦",
                blob: "blob-peach",
              },
            ].map((s, i) => (
              <article
                key={s.n}
                className={`glass rounded-3xl p-7 relative overflow-hidden scale-in delay-${i + 1}`}
              >
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${s.blob} rounded-full opacity-60 blur-2xl`} aria-hidden />
                <div className="relative">
                  <div className="flex items-baseline justify-between mb-5">
                    <span className="display-bubble text-4xl text-gradient">{s.n}</span>
                    <span className="text-3xl text-pink-hot pulse-heart">{s.emoji}</span>
                  </div>
                  <h3 className="display-bubble text-3xl mb-3">{s.title}</h3>
                  <p className="text-ink-soft leading-relaxed">{s.lede}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXEMPLO */}
      <section id="exemplo" className="px-5 md:px-10 py-16 md:py-28">
        <div className="mx-auto max-w-6xl grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow-y2k">Um cheirinho ✿</p>
            <h2 className="display-bubble text-4xl md:text-6xl mt-3">
              Um <span className="text-gradient">cantinho</span><br />
              que é <span className="script text-pink-hot text-[1.15em]">só seu</span>.
            </h2>
            <p className="text-ink-soft text-base md:text-lg leading-relaxed mt-6">
              Uma página linda, só sua. Você manda o link para quem ama, com
              senha se quiser. A pessoa abre, lê, chora, salva nos favoritos —
              e a página continua lá. Sempre.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                ["Até 20 fotos com legenda", "✿"],
                ["Senha opcional para deixar privado", "♡"],
                ["URL bonitinha para compartilhar", "✦"],
                ["Sem assinatura, sem renovação", "✨"],
              ].map(([t, e]) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid place-items-center size-7 rounded-full glass-pink text-pink-hot text-base">
                    {e}
                  </span>
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-7 relative">
            <div className="absolute -top-10 -left-10 -right-10 -bottom-10 blob-lilac rounded-[40%] opacity-30 blur-3xl float-slow" aria-hidden />
            <div className="relative glass-pink rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 -rotate-[1.5deg] shine">
              <div className="flex items-center justify-between mb-4 gap-2">
                <span className="eyebrow-y2k truncate">No. 042 · m/fulana</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-pink-hot whitespace-nowrap">
                  <Lock className="size-3" /> Protegido
                </span>
              </div>
              <p className="script text-3xl md:text-5xl text-pink-flame leading-tight">
                Fulana,
              </p>
              <p className="text-ink leading-[1.7] md:leading-[1.85] mt-4 md:mt-5 text-base md:text-lg">
                Tem coisas que eu só consigo te dizer assim, com tempo, sem
                pressa, em letrinha que <span className="text-pink-hot script text-2xl">demora</span>{" "}
                para ser escrita. Você sabe — a gente conversa muito, mas
                algumas frases pedem um lugar próprio.
              </p>
              <p className="text-ink leading-[1.7] md:leading-[1.85] mt-3 text-base md:text-lg">
                Esse aqui é o seu. <span className="text-pink-hot pulse-heart">♥</span>
              </p>
              <div className="mt-6 flex items-end justify-between">
                <span className="eyebrow-y2k">Com amor — E.</span>
                <span className="script text-3xl text-lilac-deep -rotate-3">2026</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 sticker px-4 py-2 rotate-[8deg]">
              <span className="text-sm font-semibold text-pink-hot">♡ true love</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE / MANIFESTO */}
      <section className="px-5 md:px-10 py-16 md:py-32 text-center">
        <div className="mx-auto max-w-3xl glass rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 blob-pink opacity-20 blur-3xl" aria-hidden />
          <span
            aria-hidden
            className="block mx-auto text-4xl md:text-6xl text-pink-hot pulse-heart leading-none"
          >
            ♡
          </span>
          <p className="script text-3xl md:text-6xl mt-5 md:mt-6 leading-tight">
            Algumas palavras{" "}
            <span className="text-gradient">precisam</span>{" "}
            de um <span className="text-pink-hot">lugar</span>{" "}
            para durar.
          </p>
          <p className="eyebrow-y2k mt-6 md:mt-8">Manifesto ✿ Foreva</p>
        </div>
      </section>

      {/* PERGUNTAS */}
      <section id="perguntas" className="px-5 md:px-10 py-16 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-12">
            <p className="eyebrow-y2k">Perguntas honestas ♡</p>
            <h2 className="display-bubble text-4xl md:text-6xl mt-3">
              <span className="text-gradient">Perguntinhas</span> rápidas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: "É mensal?",
                a: "Não! Um único PIX e a página fica. Sem renovação, sem cobrança recorrente nem nada.",
              },
              {
                q: "Quem pode ver?",
                a: "Quem tiver o link. Se você botar senha, só quem souber a senha consegue abrir.",
              },
              {
                q: "Posso editar depois?",
                a: "Ainda não — a carta é congelada na criação para ter cara de carta de verdade ♡",
              },
              {
                q: "Funciona no celular?",
                a: "Sim! A página é leve, abre rapidinho e foi pensada para ser lida na cama, à noite.",
              },
            ].map((f) => (
              <div key={f.q} className="glass rounded-3xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-pink-hot text-xl shrink-0 pulse-heart">♡</span>
                  <div>
                    <h3 className="display-bubble text-xl mb-2">{f.q}</h3>
                    <p className="text-ink-soft leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 md:px-10 py-24 md:py-32">
        <div className="mx-auto max-w-5xl glass-pink rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shine">
          <div className="absolute -top-20 -left-20 size-80 blob-pink rounded-full opacity-50 blur-3xl float-slow" aria-hidden />
          <div className="absolute -bottom-20 -right-20 size-80 blob-lilac rounded-full opacity-50 blur-3xl float-mid" aria-hidden />
          <p className="eyebrow-y2k">Último ato ✦</p>
          <h2 className="display-bubble text-5xl md:text-7xl mt-4 leading-[0.95]">
            Pronta para escrever<br />
            <span className="script text-pink-hot text-[1.3em]">aquela</span>{" "}
            carta?
          </h2>
          <p className="text-ink-soft text-lg mt-5 max-w-md mx-auto">
            Só {price} de uma vez. Nunca mais. ♡
          </p>
          <div className="mt-9 flex justify-center">
            <Link href="/criar" className="btn-bubble shine pill text-base">
              <Sparkles className="size-4" />
              Criar minha carta agora
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 md:px-10 py-10">
        <div className="mx-auto max-w-6xl glass-soft pill px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-pink-hot pulse-heart">♡</span>
            <span className="display-bubble text-xl">Foreva</span>
            <span className="text-ink-mute text-sm">Cartas que duram para sempre</span>
          </div>
          <p className="text-xs text-ink-mute">© {new Date().getFullYear()} ✿ Feito com amor</p>
        </div>
      </footer>
    </main>
  );
}
