import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setAccessCookie, verifyPassword } from "@/lib/access";

const Body = z.object({
  slug: z.string().min(1),
  password: z.string().min(1).max(256),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const page = await prisma.lovePage.findUnique({
    where: { slug: parsed.slug },
    select: { paid: true, passwordHash: true },
  });
  if (!page || !page.paid) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!page.passwordHash) {
    return NextResponse.json({ error: "no password set" }, { status: 400 });
  }

  const ok = await verifyPassword(parsed.password, page.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "invalid password" }, { status: 401 });
  }

  await setAccessCookie(parsed.slug);
  return NextResponse.json({ ok: true });
}
