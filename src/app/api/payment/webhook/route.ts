import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { timingSafeEqual } from "@/lib/abacate";

type WebhookBody = {
  event: string;
  data?: {
    transparent?: {
      id?: string;
      externalId?: string;
      status?: string;
    };
  };
};

export async function POST(req: NextRequest) {
  const expected = process.env.ABACATE_WEBHOOK_SECRET ?? "";
  const provided = req.nextUrl.searchParams.get("secret") ?? "";
  if (!expected || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = (await req.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (body.event !== "transparent.completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const t = body.data?.transparent;
  if (!t) return NextResponse.json({ error: "missing transparent" }, { status: 400 });
  if (t.status !== "PAID") return NextResponse.json({ ok: true, ignored: true });

  const pageId = t.externalId;
  const abacateId = t.id;
  if (!pageId || !abacateId) {
    return NextResponse.json({ error: "missing identifiers" }, { status: 400 });
  }

  const page = await prisma.lovePage.findUnique({
    where: { id: pageId },
    include: { payment: true },
  });
  if (!page || !page.payment || page.payment.abacateId !== abacateId) {
    return NextResponse.json({ error: "page/charge mismatch" }, { status: 404 });
  }

  if (page.paid) return NextResponse.json({ ok: true, alreadyPaid: true });

  await prisma.$transaction([
    prisma.lovePage.update({ where: { id: page.id }, data: { paid: true } }),
    prisma.payment.update({
      where: { pageId: page.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
