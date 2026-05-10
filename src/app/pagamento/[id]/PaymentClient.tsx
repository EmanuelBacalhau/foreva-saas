"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Copy,
  Heart,
  Loader2,
  QrCode,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type Charge = {
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
  status: string;
};

export default function PaymentClient({
  pageId,
  slug,
  alreadyPaid,
  priceCents,
}: {
  pageId: string;
  slug: string;
  alreadyPaid: boolean;
  priceCents: number;
}) {
  const router = useRouter();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [creating, setCreating] = useState(false);
  const [paid, setPaid] = useState(alreadyPaid);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());

  const price = useMemo(
    () =>
      (priceCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
    [priceCents],
  );

  async function startCharge() {
    setCreating(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Falha gerando cobrança");
      setCharge({
        brCode: json.brCode,
        brCodeBase64: json.brCodeBase64,
        expiresAt: json.expiresAt,
        status: json.status,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (paid) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch(
          `/api/payment/status?pageId=${encodeURIComponent(pageId)}`,
        );
        if (!r.ok) return;
        const j = await r.json();
        if (cancelled) return;
        if (j.paid) {
          setPaid(true);
          toast.success("Pagamento confirmado ♡");
          setTimeout(() => router.push(`/m/${slug}`), 900);
        }
      } catch {}
    };
    const i = setInterval(tick, 4000);
    tick();
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, [paid, pageId, router, slug]);

  useEffect(() => {
    if (!charge) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [charge]);

  const remaining = useMemo(() => {
    if (!charge) return null;
    const ms = new Date(charge.expiresAt).getTime() - now;
    if (ms <= 0) return "Expirado";
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [charge, now]);

  if (paid) {
    return (
      <div className="relative">
        <div className="absolute -inset-8 blob-pink rounded-[40%] opacity-40 blur-3xl float-slow" aria-hidden />
        <div className="relative glass-pink rounded-[2.5rem] p-10 md:p-14 text-center shine">
          <div className="mx-auto size-16 grid place-items-center rounded-full bg-gradient-to-br from-pink-hot to-lilac-deep text-white mb-5 pulse-heart">
            <Heart className="size-7 fill-current" />
          </div>
          <p className="eyebrow-y2k">Confirmado ✿</p>
          <h2 className="display-bubble text-4xl md:text-5xl mt-3">
            Pagamento{" "}
            <span className="text-gradient">recebido</span>{" "}
            <span className="text-pink-hot">♡</span>
          </h2>
          <p className="text-ink-soft mt-4 max-w-sm mx-auto">
            A página da carta já está disponível ✨
          </p>
          <a
            href={`/m/${slug}`}
            className="btn-bubble shine pill text-base mt-7 inline-flex"
          >
            Ver carta
            <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    );
  }

  if (!charge) {
    if (creating) {
      return (
        <div className="glass-pink rounded-[2.5rem] p-10 md:p-12 text-center">
          <Loader2 className="size-10 mx-auto animate-spin text-pink-hot" />
          <p className="display-bubble text-2xl mt-5">Gerando QR…</p>
          <p className="text-ink-soft text-sm mt-2">Só um segundinho ♡</p>
        </div>
      );
    }
    return (
      <div className="relative">
        <div className="absolute -inset-6 blob-lilac rounded-[40%] opacity-30 blur-3xl" aria-hidden />
        <div className="relative glass-pink rounded-[2.5rem] p-8 md:p-10 shine">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="eyebrow-y2k">Total único ✿</p>
              <p className="display-bubble text-6xl md:text-7xl text-gradient mt-1">{price}</p>
            </div>
            <span className="px-3 py-1.5 glass pill text-xs font-semibold text-lilac-deep">
              Via PIX ♡
            </span>
          </div>
          <ul className="space-y-3 mb-7">
            {[
              "Página única e permanente",
              "Fotos e legendas inclusas",
              "Senha de acesso opcional",
              "Sem mensalidade nunca",
            ].map((r) => (
              <li key={r} className="flex items-center gap-3">
                <span className="grid place-items-center size-7 rounded-full bg-pink-hot/10 text-pink-hot">
                  <Check className="size-4" strokeWidth={2.4} />
                </span>
                <span className="text-ink">{r}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={startCharge}
            className="btn-bubble shine pill w-full text-base"
          >
            <QrCode className="size-4" />
            Gerar QR Code PIX
            <ArrowRight className="size-4" />
          </button>
          <p className="text-xs text-ink-mute text-center mt-4">
            Pagamento processado pelo Abacate Pay ♡
          </p>
        </div>
      </div>
    );
  }

  const qrSrc = charge.brCodeBase64.startsWith("data:")
    ? charge.brCodeBase64
    : `data:image/png;base64,${charge.brCodeBase64}`;

  const expired = remaining === "Expirado";

  return (
    <div className="relative">
      <div className="absolute -inset-6 blob-pink rounded-[40%] opacity-30 blur-3xl float-slow" aria-hidden />
      <div className="relative glass-pink rounded-[2.5rem] p-7 md:p-9 space-y-6 shine">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow-y2k">Aguardando pagamento</p>
            <p className="display-bubble text-3xl md:text-4xl text-gradient mt-1">
              {price}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md font-mono font-semibold text-sm ${
              expired
                ? "bg-destructive/15 text-destructive border border-destructive/30"
                : "bg-white/70 text-pink-flame border border-pink-soft"
            }`}
          >
            {!expired && <Sparkles className="size-3.5 twinkle" />}
            {remaining}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="script text-2xl text-pink-hot">
            Aponte a câmera ✿
          </p>
          <div className="sticker p-3 -rotate-[1.5deg]">
            <div className="rounded-2xl overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="QR Code PIX"
                className="block w-64 h-64 md:w-72 md:h-72"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="eyebrow-y2k">Ou copie o código</p>
            <span className="text-xs text-ink-mute flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" />
              Verificando…
            </span>
          </div>
          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={charge.brCode}
              className="input-bubble flex-1 text-xs font-mono truncate !rounded-full"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(charge.brCode);
                setCopied(true);
                toast.success("Código copiado ♡");
                setTimeout(() => setCopied(false), 2000);
              }}
              className="btn-glass pill text-sm whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-soft pt-2 border-t border-pink-soft/40">
          <span>Expira {new Date(charge.expiresAt).toLocaleString("pt-BR")}</span>
          <span>Status: {charge.status}</span>
        </div>
      </div>
    </div>
  );
}
