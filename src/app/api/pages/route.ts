import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slug";
import { hashPassword } from "@/lib/access";
import { promoteFromTmp } from "@/lib/s3";

const ImageInput = z.object({
  key: z.string().min(1).max(200).startsWith("tmp/"),
  caption: z.string().max(120).optional().nullable(),
});

const Body = z.object({
  title: z.string().min(2).max(120),
  recipient: z.string().min(1).max(80),
  greeting: z.string().max(120).optional().nullable(),
  letterBody: z.string().min(20).max(50000),
  signature: z.string().max(80).optional().nullable(),
  password: z.string().min(4).max(128).optional().nullable(),
  creatorEmail: z.string().email().max(160).optional().nullable(),
  images: z.array(ImageInput).max(20).default([]),
});

const ALLOWED_TAGS = ["p", "strong", "em", "u", "mark", "br"];

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err) }, { status: 400 });
  }

  const slug = makeSlug(parsed.recipient);
  const passwordHash = parsed.password ? await hashPassword(parsed.password) : null;
  const cleanBody = DOMPurify.sanitize(parsed.letterBody, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  });
  if (cleanBody.replace(/<[^>]+>/g, "").trim().length < 20) {
    return NextResponse.json(
      { error: "carta muito curta" },
      { status: 400 },
    );
  }

  let promoted: { url: string; caption: string | null; order: number }[];
  try {
    promoted = await Promise.all(
      parsed.images.map(async (img, i) => {
        const { publicUrl } = await promoteFromTmp(img.key);
        return { url: publicUrl, caption: img.caption ?? null, order: i };
      }),
    );
  } catch (err) {
    return NextResponse.json(
      { error: "image promotion failed", detail: String(err) },
      { status: 500 },
    );
  }

  const page = await prisma.lovePage.create({
    data: {
      slug,
      title: parsed.title,
      recipient: parsed.recipient,
      greeting: parsed.greeting ?? null,
      letterBody: cleanBody,
      signature: parsed.signature ?? null,
      passwordHash,
      creatorEmail: parsed.creatorEmail?.toLowerCase().trim() ?? null,
      images: { create: promoted },
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ id: page.id, slug: page.slug });
}
