import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slug";
import { hashPassword } from "@/lib/access";

const ImageInput = z.object({
  url: z.string().url(),
  caption: z.string().max(120).optional().nullable(),
});

const Body = z.object({
  title: z.string().min(2).max(120),
  recipient: z.string().min(1).max(80),
  greeting: z.string().max(120).optional().nullable(),
  letterBody: z.string().min(20).max(20000),
  signature: z.string().max(80).optional().nullable(),
  password: z.string().min(4).max(128).optional().nullable(),
  images: z.array(ImageInput).max(20).default([]),
});

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err) }, { status: 400 });
  }

  const slug = makeSlug(parsed.recipient);
  const passwordHash = parsed.password ? await hashPassword(parsed.password) : null;

  const page = await prisma.lovePage.create({
    data: {
      slug,
      title: parsed.title,
      recipient: parsed.recipient,
      greeting: parsed.greeting ?? null,
      letterBody: parsed.letterBody,
      signature: parsed.signature ?? null,
      passwordHash,
      images: {
        create: parsed.images.map((img, i) => ({
          url: img.url,
          caption: img.caption ?? null,
          order: i,
        })),
      },
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ id: page.id, slug: page.slug });
}
