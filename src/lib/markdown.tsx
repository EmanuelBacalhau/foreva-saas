import React from "react";

type Mark = "bold" | "italic" | "underline" | "highlight";

type Token =
  | { type: "text"; value: string }
  | { type: "marker"; mark: Mark };

const TAG: Record<Mark, "strong" | "em" | "u" | "mark"> = {
  bold: "strong",
  italic: "em",
  underline: "u",
  highlight: "mark",
};

const CLASS: Partial<Record<Mark, string>> = {
  underline: "underline decoration-pink-hot decoration-2 underline-offset-[3px]",
  highlight: "bg-pink-soft/70 text-pink-flame px-1 rounded-md mx-0.5",
};

const LITERAL: Record<Mark, string> = {
  bold: "**",
  italic: "_",
  underline: "__",
  highlight: "==",
};

function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let buf = "";
  const flush = () => {
    if (buf) {
      out.push({ type: "text", value: buf });
      buf = "";
    }
  };
  let i = 0;
  while (i < text.length) {
    const a = text[i];
    const b = text[i + 1];
    if (a === "\\" && b) {
      // escape next char literally
      buf += b;
      i += 2;
      continue;
    }
    if (a === "*" && b === "*") {
      flush();
      out.push({ type: "marker", mark: "bold" });
      i += 2;
      continue;
    }
    if (a === "_" && b === "_") {
      flush();
      out.push({ type: "marker", mark: "underline" });
      i += 2;
      continue;
    }
    if (a === "=" && b === "=") {
      flush();
      out.push({ type: "marker", mark: "highlight" });
      i += 2;
      continue;
    }
    if (a === "_") {
      flush();
      out.push({ type: "marker", mark: "italic" });
      i += 1;
      continue;
    }
    buf += a;
    i += 1;
  }
  flush();
  return out;
}

function parse(tokens: Token[], keyPrefix = "n"): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "text") {
      out.push(t.value);
      i++;
      continue;
    }
    // find matching close (same mark, nearest)
    let close = -1;
    for (let j = i + 1; j < tokens.length; j++) {
      const u = tokens[j];
      if (u.type === "marker" && u.mark === t.mark) {
        close = j;
        break;
      }
    }
    if (close < 0) {
      // no pair — render as literal text
      out.push(LITERAL[t.mark]);
      i++;
      continue;
    }
    const inner = tokens.slice(i + 1, close);
    const Tag = TAG[t.mark];
    out.push(
      React.createElement(
        Tag,
        { key: `${keyPrefix}-${i}`, className: CLASS[t.mark] },
        ...parse(inner, `${keyPrefix}-${i}-c`),
      ),
    );
    i = close + 1;
  }
  return out;
}

export function renderInline(text: string): React.ReactNode[] {
  return parse(tokenize(text));
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
