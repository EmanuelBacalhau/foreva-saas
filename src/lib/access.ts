import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ACCESS_COOKIE_SECRET ?? process.env.ABACATE_WEBHOOK_SECRET ?? "dev-secret";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function tokenForSlug(slug: string): string {
  return `${slug}.${sign(slug)}`;
}

export function verifyTokenForSlug(token: string | undefined, slug: string): boolean {
  if (!token) return false;
  const [t, sig] = token.split(".");
  if (t !== slug || !sig) return false;
  const expected = sign(slug);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

const COOKIE_NAME = "amora_access";

export async function setAccessCookie(slug: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, tokenForSlug(slug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function hasAccess(slug: string): Promise<boolean> {
  const jar = await cookies();
  const tok = jar.get(COOKIE_NAME)?.value;
  return verifyTokenForSlug(tok, slug);
}
