import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPixStatus } from "@/lib/abacate";

export async function GET(req: NextRequest) {
  const pageId = req.nextUrl.searchParams.get("pageId");
  if (!pageId) return NextResponse.json({ error: "pageId required" }, { status: 400 });

  const page = await prisma.lovePage.findUnique({
    where: { id: pageId },
    include: { payment: true },
  });
  if (!page) return NextResponse.json({ error: "page not found" }, { status: 404 });

  if (page.paid) {
    return NextResponse.json({ status: "PAID", paid: true, slug: page.slug });
  }

  if (!page.payment?.abacateId) {
    return NextResponse.json({ status: "NO_CHARGE", paid: false });
  }

  const remote = await checkPixStatus(page.payment.abacateId);
  const status = remote.data.status;

  if (status === "PAID" && !page.paid) {
    await prisma.$transaction([
      prisma.lovePage.update({ where: { id: page.id }, data: { paid: true } }),
      prisma.payment.update({
        where: { pageId: page.id },
        data: { status, paidAt: new Date() },
      }),
    ]);
    return NextResponse.json({ status, paid: true, slug: page.slug });
  }

  if (status !== page.payment.status) {
    await prisma.payment.update({
      where: { pageId: page.id },
      data: { status },
    });
  }

  return NextResponse.json({ status, paid: false });
}
