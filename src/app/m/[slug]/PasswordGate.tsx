"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function PasswordGate({
  slug,
  recipient,
}: {
  slug: string;
  recipient: string;
}) {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password: pwd }),
      });
      if (res.status === 401) {
        toast.error("Senha incorreta ♡");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Erro");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative z-[1] min-h-dvh flex flex-col">
      <header className="sticky top-0 z-30 px-5 md:px-10 pt-4 md:pt-6 pb-3 bg-(--bg-base)/55 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl">
          <div className="glass pill flex items-center justify-between px-3 md:px-4 py-2.5">
            <div className="flex items-center gap-2 px-3">
              <span className="text-pink-hot pulse-heart">♡</span>
              <span className="display-bubble text-2xl">Foreva</span>
            </div>
            <span className="eyebrow-y2k">Protegido ✿</span>
          </div>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md relative">
          <div className="absolute -inset-10 blob-pink rounded-[40%] opacity-40 blur-3xl float-slow" aria-hidden />
          <div className="absolute -inset-6 blob-lilac rounded-[40%] opacity-30 blur-2xl float-mid" aria-hidden />

          <div className="relative glass-pink rounded-[2.5rem] p-8 md:p-10 -rotate-[1deg] shine">
            <div className="mx-auto size-16 grid place-items-center rounded-full bg-gradient-to-br from-pink-hot to-lilac-deep text-white mb-5 pulse-heart">
              <Lock className="size-7" strokeWidth={1.6} />
            </div>
            <p className="eyebrow-y2k text-center">Acesso restrito</p>
            <h1 className="display-bubble text-3xl md:text-4xl text-center mt-3">
              Uma <span className="script text-pink-hot text-[1.2em]">cartinha</span>{" "}
              para <span className="text-gradient">{recipient}</span>
            </h1>
            <p className="text-ink-soft text-center mt-4 leading-relaxed">
              Só quem tem a senha pode abrir ✦
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="pwd" className="eyebrow-y2k px-1">
                  Senha
                </label>
                <input
                  id="pwd"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  autoFocus
                  placeholder="•••••••"
                  className="input-bubble"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-bubble shine pill w-full text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Verificando…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Abrir carta
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 script text-2xl text-pink-flame">
            Esqueceu? Peça para quem te enviou ♡
          </p>
        </div>
      </section>
    </main>
  );
}
