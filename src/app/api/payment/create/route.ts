import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPixCharge } from "@/lib/abacate";

const Body = z.object({ pageId: z.string().min(1) });

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err) }, { status: 400 });
  }

  const page = await prisma.lovePage.findUnique({
    where: { id: parsed.pageId },
    include: { payment: true },
  });
  if (!page) return NextResponse.json({ error: "page not found" }, { status: 404 });
  if (page.paid) return NextResponse.json({ error: "already paid" }, { status: 409 });

  const amountCents = Number(process.env.PRICE_CENTS ?? "1990");

  const existing = page.payment;
  if (existing && existing.expiresAt && existing.expiresAt > new Date() && existing.brCode) {
    return NextResponse.json({
      brCode: existing.brCode,
      brCodeBase64: existing.brCodeBase64,
      expiresAt: existing.expiresAt,
      status: existing.status,
      paymentId: existing.id,
    });
  }

  const charge = await createPixCharge({
    amountCents,
    description: `Carta para ${page.recipient}`,
    externalId: page.id,
    expiresInSeconds: 60 * 60,
    metadata: { pageId: page.id, slug: page.slug },
  });

  const expiresAt = new Date(charge.data.expiresAt);

  const payment = await prisma.payment.upsert({
    where: { pageId: page.id },
    update: {
      abacateId: charge.data.id,
      amountCents,
      status: charge.data.status,
      brCode: charge.data.brCode,
      brCodeBase64: charge.data.brCodeBase64,
      expiresAt,
    },
    create: {
      pageId: page.id,
      abacateId: charge.data.id,
      amountCents,
      status: charge.data.status,
      brCode: charge.data.brCode,
      brCodeBase64: charge.data.brCodeBase64,
      expiresAt,
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    brCode: charge.data.brCode,
    brCodeBase64: charge.data.brCodeBase64,
    expiresAt,
    status: charge.data.status,
  });
}
