"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Loader2,
  Lock,
  Sparkles,
  Underline,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { renderInline, splitParagraphs } from "@/lib/markdown";

type UploadedImage = { url: string; caption: string };

const schema = z.object({
  title: z.string().min(2, "Dá um titulinho fofo").max(120),
  recipient: z.string().min(1, "Para quem é a carta?").max(80),
  greeting: z.string().max(120).optional().or(z.literal("")),
  letterBody: z
    .string()
    .min(20, "Uma carta merece pelo menos 20 letrinhas")
    .max(20000, "Passou do limite ♡"),
  signature: z.string().max(80).optional().or(z.literal("")),
  password: z
    .string()
    .max(128)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.length >= 4, "Mínimo 4 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function CriarPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      recipient: "",
      greeting: "",
      letterBody: "",
      signature: "",
      password: "",
    },
  });

  const live = watch();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!presignRes.ok) {
        const j = await presignRes.json().catch(() => ({}));
        throw new Error(j.error ?? "Falha no upload");
      }
      const { uploadUrl, publicUrl } = await presignRes.json();
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Falha enviando arquivo");
      setImages((prev) => [...prev, { url: publicUrl, caption: "" }]);
      toast.success("Fotinha adicionada ♡");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const body = {
        title: values.title,
        recipient: values.recipient,
        greeting: values.greeting || null,
        letterBody: values.letterBody,
        signature: values.signature || null,
        password: values.password || null,
        images,
      };
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Falha ao criar carta");
      }
      const { id } = await res.json();
      router.push(`/pagamento/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar");
      setSubmitting(false);
    }
  }

  const previewParagraphs = splitParagraphs(live.letterBody ?? "");

  return (
    <main className="relative z-[1] flex flex-col">
      <header className="sticky top-0 z-30 px-5 md:px-10 pt-4 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <div className="glass pill flex items-center justify-between px-3 md:px-4 py-2.5">
            <Link href="/" className="flex items-center gap-2 px-3 group">
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform text-ink-soft" />
              <span className="display-bubble text-2xl tracking-tight">Amora</span>
            </Link>
            <span className="eyebrow-y2k hidden md:block">Capítulo I ✿ Escrever</span>
          </div>
        </div>
      </header>

      <section className="px-5 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 md:mb-14">
            <p className="eyebrow-y2k fade-in-up delay-1">O coração no papel ♡</p>
            <h1 className="display-bubble text-5xl md:text-7xl mt-3 fade-in-up delay-2">
              Escreva uma{" "}
              <span className="script text-pink-hot text-[1.18em]">cartinha</span>{" "}
              <span className="text-gradient">de verdade</span>.
            </h1>
            <p className="text-ink-soft text-lg mt-5 max-w-xl mx-auto fade-in-up delay-3">
              Sem pressa. Dá para ver a prévia ao lado enquanto você escreve ✨
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6 md:gap-10">
            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="col-span-12 lg:col-span-7 space-y-8"
            >
              <Section number="01" title="Para quem?" emoji="✿">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nome" hint="Aparece bem grande na capa" error={errors.recipient?.message}>
                    <input {...register("recipient")} placeholder="Maria" className="input-bubble" />
                  </Field>
                  <Field label="Título" hint="O subtítulo da página" error={errors.title?.message}>
                    <input {...register("title")} placeholder="Para você, com carinho" className="input-bubble" />
                  </Field>
                </div>
                <Field label="Saudação" hint="Opcional — abre a carta" error={errors.greeting?.message}>
                  <input {...register("greeting")} placeholder="Oiii, tudo bem?" className="input-bubble" />
                </Field>
              </Section>

              <Section number="02" title="A carta" emoji="♡">
                <Field
                  label="O que precisa dizer"
                  hint="Linha em branco = parágrafo. Selecione um trecho e use a barrinha para formatar ✿"
                  error={errors.letterBody?.message}
                >
                  <MarkdownTextarea
                    register={register("letterBody")}
                    placeholder="Hoje quero te dizer o quanto…"
                  />
                </Field>
                <Field label="Assinatura" hint="Como você assina" error={errors.signature?.message}>
                  <input {...register("signature")} placeholder="Com amor, E." className="input-bubble" />
                </Field>
              </Section>

              <Section number="03" title="Fotinhas" emoji="✦" subtitle={`${images.length}/20`}>
                <p className="text-sm text-ink-soft -mt-1">
                  Opcional ♡ Uma foto vale uma frase a mais.
                </p>
                <label
                  className={cn(
                    "glass-soft rounded-3xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5",
                    "border-2 border-dashed border-pink-soft",
                    (uploading || images.length >= 20) && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <ImagePlus className="size-7 text-pink-hot" strokeWidth={1.6} />
                  <span className="display-bubble text-xl">
                    {uploading ? "Enviando…" : "Clique para adicionar"}
                  </span>
                  <span className="eyebrow-y2k">JPG · PNG · WEBP · GIF</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploading || images.length >= 20}
                    onChange={(e) => {
                      const f = e.currentTarget.files?.[0];
                      if (f) handleFile(f);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                {images.length > 0 && (
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                      <li key={img.url} className="sticker p-2 -rotate-[1.5deg] hover:rotate-0 transition-transform" style={{ rotate: `${(i % 2 === 0 ? -2 : 2)}deg` }}>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages((p) => p.filter((_, ix) => ix !== i))}
                            className="absolute top-1.5 right-1.5 size-7 grid place-items-center rounded-full bg-white/95 text-ink hover:bg-pink-hot hover:text-white transition-colors shadow"
                            aria-label="remover"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                        <input
                          placeholder="Legenda fofa"
                          value={img.caption}
                          maxLength={120}
                          onChange={(e) => {
                            const v = e.target.value;
                            setImages((prev) =>
                              prev.map((x, ix) =>
                                ix === i ? { ...x, caption: v } : x,
                              ),
                            );
                          }}
                          className="input-bubble mt-2 text-sm py-1.5 px-3"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section number="04" title="Só para quem você quer" emoji="✨">
                <Field label="Senha de acesso" hint="Opcional. Só quem souber consegue abrir." error={errors.password?.message}>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-pink-hot" />
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Senha mínima de 4 caracteres"
                      className="input-bubble pl-10"
                    />
                  </div>
                </Field>
              </Section>

              <div className="glass-soft rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <p className="text-sm text-ink-soft text-center sm:text-left max-w-md">
                  No próximo passo você vai pro PIX único ♡ A carta só fica pública depois do pagamento confirmado.
                </p>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="btn-bubble shine pill text-base whitespace-nowrap"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Criando…
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Ir pro pagamento
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* LIVE PREVIEW */}
            <aside className="col-span-12 lg:col-span-5 lg:sticky lg:top-6 self-start">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-pink-hot pulse-heart">♡</span>
                  <p className="eyebrow-y2k">Prévia ao vivo</p>
                </div>
                <span className="eyebrow-y2k">Como vai ficar ✿</span>
              </div>
              <LetterPreview
                recipient={live.recipient}
                title={live.title}
                greeting={live.greeting}
                paragraphs={previewParagraphs}
                signature={live.signature}
                images={images}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({
  number,
  title,
  emoji,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  emoji: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-[2rem] p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="display-bubble text-3xl text-gradient">{number}</span>
          <span className="text-2xl text-pink-hot pulse-heart">{emoji}</span>
          <h2 className="display-bubble text-2xl">{title}</h2>
        </div>
        {subtitle && <span className="eyebrow-y2k">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="eyebrow-y2k px-1">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-ink-soft px-1">{hint}</p>}
      {error && (
        <p className="text-xs text-pink-flame font-semibold px-1 flex items-center gap-1">
          <span>♡</span> {error}
        </p>
      )}
    </div>
  );
}

function LetterPreview({
  recipient,
  title,
  greeting,
  paragraphs,
  signature,
  images,
}: {
  recipient?: string;
  title?: string;
  greeting?: string;
  paragraphs: string[];
  signature?: string;
  images: { url: string; caption: string }[];
}) {
  const tilts = [-3, 2, -1.5, 4, -2.5, 1.8];

  return (
    <div className="relative">
      {/* outer floating decor */}
      <div className="absolute -inset-10 blob-pink rounded-[40%] opacity-25 blur-3xl float-slow pointer-events-none" aria-hidden />
      <div className="absolute -inset-6 blob-lilac rounded-[40%] opacity-20 blur-3xl float-mid pointer-events-none" aria-hidden />

      {/* preview frame — mimics the real /m/[slug] page surface */}
      <div className="relative rounded-[2rem] border border-glass-border bg-gradient-to-b from-[oklch(0.985_0.018_320/0.6)] to-[oklch(0.95_0.04_320/0.5)] backdrop-blur-md shadow-[0_22px_60px_oklch(0.55_0.22_295/0.18)] overflow-hidden">
        {/* glass viewport scrollable */}
        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain px-5 md:px-6 py-7 md:py-9 space-y-7">
          {/* HERO — same recipe as Letter.tsx hero, scaled */}
          <header className="text-center relative">
            <p className="eyebrow-y2k">Para</p>
            <p
              className="display-bubble mt-2 leading-[0.92] break-words [overflow-wrap:anywhere] text-gradient"
              style={{ fontSize: dynRecipient(recipient ?? "") }}
            >
              {recipient ? (
                <>
                  {recipient}
                  <span className="text-pink-flame">,</span>
                </>
              ) : (
                <span className="text-ink-mute display-bubble text-5xl">—</span>
              )}
            </p>
            {title && (
              <p className="script text-2xl md:text-3xl text-pink-flame mt-3 break-words leading-snug">
                {title}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 mt-5">
              <span className="text-base text-lilac twinkle">✦</span>
              <span className="text-xl text-pink-hot pulse-heart">♡</span>
              <span className="text-base text-pink-flame twinkle">✿</span>
            </div>
          </header>

          {/* CARTA */}
          <div className="relative">
            <div className="absolute -inset-3 blob-peach rounded-[40%] opacity-25 blur-2xl pointer-events-none" aria-hidden />
            <div className="relative glass-pink rounded-[2rem] p-5 md:p-7 -rotate-[0.5deg] shine">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow-y2k">No. único ✿</span>
                <span className="text-pink-hot text-base pulse-heart">♥</span>
              </div>

              {greeting && (
                <p className="script text-2xl md:text-3xl text-pink-flame mb-4 break-words leading-tight -rotate-[0.5deg]">
                  {greeting}
                </p>
              )}

              {paragraphs.length > 0 ? (
                <div className="space-y-3 text-ink leading-[1.85] text-[0.95rem]">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="break-words [overflow-wrap:anywhere]">
                      {renderInline(p)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-ink-mute italic">
                  Sua carta aparece aqui enquanto você escreve ✿
                </p>
              )}

              {signature && (
                <div className="mt-6 flex items-center justify-end gap-2">
                  <span className="block w-8 h-px bg-pink-soft" />
                  <span className="script text-2xl md:text-3xl text-lilac-deep -rotate-2 break-words">
                    {signature}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* GALERIA — sticker cards iguais ao Letter final */}
          {images.length > 0 && (
            <section>
              <div className="text-center mb-4">
                <p className="eyebrow-y2k">Os momentos ♡</p>
                <p className="display-bubble text-2xl mt-1">
                  <span className="text-gradient">Lembrancinhas</span>
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <li
                    key={img.url}
                    className="sticker p-2"
                    style={{ rotate: `${tilts[i % tilts.length]}deg` }}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.caption ?? ""}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white/90 grid place-items-center text-pink-hot text-[10px]">
                        ♡
                      </div>
                    </div>
                    {img.caption && (
                      <p className="script text-base text-ink mt-2 px-1 text-center break-words">
                        {img.caption}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* COLOFON mini */}
          <div className="glass rounded-[1.5rem] p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0 blob-pink opacity-20 blur-2xl pointer-events-none" aria-hidden />
            <p className="eyebrow-y2k relative">Colofão ♡</p>
            <p className="script text-xl md:text-2xl mt-2 leading-tight relative">
              Algumas palavras precisam{" "}
              <span className="text-gradient">de um lugar</span> para durar.
            </p>
          </div>
        </div>
      </div>

      <p className="text-center mt-3 eyebrow-y2k">
        É exatamente assim que vai aparecer ✦
      </p>
    </div>
  );
}

function dynRecipient(text: string): string {
  const len = text.length;
  if (len <= 5) return "clamp(3rem, 12vw, 5rem)";
  if (len <= 8) return "clamp(2.6rem, 10vw, 4.25rem)";
  if (len <= 12) return "clamp(2.2rem, 8vw, 3.5rem)";
  if (len <= 18) return "clamp(1.7rem, 6vw, 2.7rem)";
  if (len <= 26) return "clamp(1.35rem, 4.5vw, 2rem)";
  return "clamp(1.1rem, 3.5vw, 1.6rem)";
}

type RHFRegister = ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;

function MarkdownTextarea({
  register,
  placeholder,
}: {
  register: RHFRegister;
  placeholder?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function wrap(left: string, right: string = left, fallback = "Texto") {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const value = ta.value;
    const sel = value.slice(start, end);
    const inner = sel || fallback;
    const next = value.slice(0, start) + left + inner + right + value.slice(end);

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(ta, next);
    ta.dispatchEvent(new Event("input", { bubbles: true }));

    requestAnimationFrame(() => {
      ta.focus();
      const innerStart = start + left.length;
      const innerEnd = innerStart + inner.length;
      ta.setSelectionRange(innerStart, innerEnd);
    });
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod || e.shiftKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "b") {
      e.preventDefault();
      wrap("**", "**", "Texto");
    } else if (k === "i") {
      e.preventDefault();
      wrap("_", "_", "Itálico");
    } else if (k === "u") {
      e.preventDefault();
      wrap("__", "__", "Sublinhado");
    } else if (k === "e") {
      e.preventDefault();
      wrap("==", "==", "Destaque");
    }
  }

  return (
    <div className="space-y-2">
      <div className="glass-soft pill px-2 py-1.5 inline-flex items-center gap-1 flex-wrap">
        <ToolbarBtn label="Negrito (Cmd+B)" onClick={() => wrap("**", "**", "Texto")}>
          <Bold className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <ToolbarBtn label="Itálico (Cmd+I)" onClick={() => wrap("_", "_", "Itálico")}>
          <Italic className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <ToolbarBtn label="Sublinhado (Cmd+U)" onClick={() => wrap("__", "__", "Sublinhado")}>
          <Underline className="size-3.5" strokeWidth={2.4} />
        </ToolbarBtn>
        <span className="w-px h-4 bg-pink-soft mx-1" aria-hidden />
        <ToolbarBtn
          label="Destaque rosa (Cmd+E)"
          onClick={() => wrap("==", "==", "Destaque")}
          tone="hot"
        >
          <Highlighter className="size-3.5" strokeWidth={2.2} />
        </ToolbarBtn>
        <span className="ml-2 eyebrow-y2k !text-[9px] text-ink-mute">
          Selecione e clique ✦
        </span>
      </div>
      <textarea
        {...register}
        ref={(el) => {
          register.ref(el);
          taRef.current = el;
        }}
        onKeyDown={onKey}
        rows={12}
        placeholder={placeholder}
        className="input-bubble textarea text-base leading-[1.85] font-mono"
        spellCheck
      />
    </div>
  );
}

function ToolbarBtn({
  label,
  onClick,
  tone,
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "hot";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "size-7 grid place-items-center rounded-full border transition-all",
        "border-pink-soft text-ink hover:bg-pink-soft hover:text-pink-flame hover:-translate-y-0.5",
        tone === "hot" && "text-pink-hot border-pink-hot/40 hover:bg-pink-hot hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
