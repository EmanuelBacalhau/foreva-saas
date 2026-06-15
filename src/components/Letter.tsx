import sanitizeHtml from "sanitize-html";

type LetterImage = { url: string; caption: string | null };

const ALLOWED_TAGS = ["p", "strong", "em", "u", "mark", "br"];

export default function Letter({
  title,
  recipient,
  greeting,
  letterBody,
  signature,
  images,
}: {
  title: string;
  recipient: string;
  greeting: string | null;
  letterBody: string;
  signature: string | null;
  images: LetterImage[];
}) {
  const safeBody = sanitizeHtml(letterBody, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
  });

  return (
    <article className="relative z-[1] flex w-full min-w-0 max-w-full flex-col overflow-x-clip">
      <header className="sticky top-0 z-30 px-5 md:px-10 pt-4 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-6xl">
          <div className="glass pill flex items-center justify-between px-3 md:px-4 py-2.5">
            <div className="flex items-center gap-2 px-3">
              <span className="text-pink-hot pulse-heart">♡</span>
              <span className="display-bubble text-2xl">Foreva</span>
            </div>
            <span className="eyebrow-y2k hidden md:block">Edição I ✿ Uma carta</span>
          </div>
        </div>
      </header>

      {/* HERO — capa da carta */}
      <section className="px-5 md:px-10 pt-12 sm:pt-16 md:pt-24 pb-16 sm:pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-6xl text-center relative">
          <div className="absolute inset-0 -top-20 -bottom-20 blob-pink rounded-[40%] opacity-30 blur-3xl float-slow" aria-hidden />
          <div className="absolute inset-0 blob-lilac rounded-[40%] opacity-25 blur-3xl float-mid" aria-hidden />

          <p className="eyebrow-y2k fade-in-up delay-1 relative">Para</p>
          <h1 className="display-bubble text-[clamp(3rem,14vw,13rem)] mt-3 fade-in-up delay-2 relative text-balance break-words [overflow-wrap:anywhere] hyphens-auto">
            <span className="text-gradient">{recipient}</span>
            <span className="text-pink-flame">,</span>
          </h1>
          {title && (
            <p className="script text-2xl sm:text-3xl md:text-5xl text-pink-flame mt-4 max-w-2xl mx-auto fade-in-up delay-3 relative text-balance [overflow-wrap:anywhere]">
              {title}
            </p>
          )}
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10 fade-in-up delay-4 relative">
            <span className="text-2xl text-lilac twinkle">✦</span>
            <span className="text-3xl text-pink-hot pulse-heart">♡</span>
            <span className="text-2xl text-pink-flame twinkle">✿</span>
          </div>
          <p className="script text-2xl text-ink-soft mt-10 sm:mt-12 fade-in-up delay-5 relative">
            Role para ler ↓
          </p>
        </div>
      </section>

      {/* CARTA */}
      <section className="px-5 md:px-10 py-14 sm:py-20 md:py-28">
        <div className="mx-auto w-full max-w-3xl relative">
          <div className="absolute -inset-10 blob-peach rounded-[40%] opacity-25 blur-3xl float-slow" aria-hidden />
          <div className="relative glass-pink rounded-[1.75rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-14 -rotate-[0.6deg] shine">
            <div className="flex items-center justify-between mb-6">
              <span className="eyebrow-y2k">No. único ✿</span>
              <span className="text-pink-hot text-xl pulse-heart">♥</span>
            </div>

            {greeting && (
              <p className="script text-3xl sm:text-4xl md:text-5xl text-pink-flame mb-7 -rotate-[0.5deg] [overflow-wrap:anywhere]">
                {greeting}
              </p>
            )}

            <div
              className="prose-letter text-ink leading-[1.95] text-lg md:text-xl break-words [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: safeBody }}
            />

            {signature && (
              <div className="mt-12 flex items-center justify-end gap-3">
                <span className="block w-10 h-px bg-pink-soft" />
                <span className="script text-3xl md:text-4xl text-lilac-deep -rotate-2">
                  {signature}
                </span>
              </div>
            )}
          </div>
          {/* corner stickers */}
          <div className="absolute -top-3 -left-3 sticker px-3 py-1.5 -rotate-[8deg] hidden md:block">
            <span className="text-xs font-semibold text-pink-hot">true love ♡</span>
          </div>
          <div className="absolute -bottom-3 -right-3 sticker px-3 py-1.5 rotate-[6deg] hidden md:block">
            <span className="text-xs font-semibold text-lilac-deep">forever ✿</span>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      {images.length > 0 && (
        <section className="px-5 md:px-10 py-14 sm:py-20 md:py-28">
          <div className="mx-auto w-full max-w-6xl">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <p className="eyebrow-y2k">Capítulo II ♡</p>
              <h2 className="display-bubble text-4xl sm:text-5xl md:text-6xl mt-3 text-balance [overflow-wrap:anywhere]">
                <span className="text-gradient">Os momentos</span>{" "}
                <span className="script text-pink-hot text-[1.15em]">nossos</span>
              </h2>
              <p className="text-ink-soft text-base sm:text-lg mt-4 max-w-md mx-auto text-pretty">
                Pequenas lembranças que fazem a carta sair do papel ✨
              </p>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-7">
              {images.map((img, i) => {
                const tilts = [-3, 2, -1.5, 4, -2.5, 1.8];
                const tilt = tilts[i % tilts.length];
                return (
                  <li
                    key={img.url}
                    className="sticker p-3 hover:rotate-0 hover:scale-[1.03] transition-transform duration-500"
                    style={{ rotate: `${tilt}deg` }}
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.caption ?? ""}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 size-6 rounded-full bg-white/90 grid place-items-center text-pink-hot text-xs">
                        ♡
                      </div>
                    </div>
                    {img.caption && (
                      <p className="script text-xl text-ink mt-3 px-1 text-center">
                        {img.caption}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* COLOFON */}
      <section className="px-5 md:px-10 py-16 sm:py-24 md:py-32 text-center">
        <div className="mx-auto w-full max-w-3xl glass rounded-[1.75rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 blob-pink opacity-20 blur-3xl" aria-hidden />
          <div className="absolute top-6 left-6 text-2xl text-pink-hot twinkle">✦</div>
          <div className="absolute top-6 right-6 text-2xl text-lilac-deep twinkle">✿</div>
          <div className="relative">
            <p className="eyebrow-y2k">Colofão ♡</p>
            <p className="script text-3xl sm:text-4xl md:text-6xl mt-6 leading-tight text-balance">
              Algumas palavras{" "}
              <span className="text-gradient">precisam</span>{" "}
              de um <span className="text-pink-hot">lugar</span>{" "}
              para durar.
            </p>
            <div className="mt-12 flex items-center justify-center gap-3">
              <span className="text-2xl text-lilac">✦</span>
              <span className="text-3xl text-pink-hot pulse-heart">♥</span>
              <span className="text-2xl text-pink-flame">✿</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-5 md:px-10 py-10">
        <div className="mx-auto w-full max-w-6xl glass-soft rounded-[1.75rem] md:pill px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-pink-hot pulse-heart shrink-0">♡</span>
            <span className="display-bubble text-xl break-words [overflow-wrap:anywhere]">Foreva · {recipient}</span>
          </div>
          <p className="text-xs text-ink-mute shrink-0">
            Eternizado em {new Date().getFullYear()} ✿
          </p>
        </div>
      </footer>
    </article>
  );
}
