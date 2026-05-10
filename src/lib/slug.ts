import { customAlphabet } from "nanoid";

const nano = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);

export function makeSlug(recipient: string): string {
  const base = recipient
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 24);
  return `${base || "carta"}-${nano()}`;
}
