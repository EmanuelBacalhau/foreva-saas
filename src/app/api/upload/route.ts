import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { presignUpload, r2Configured } from "@/lib/r2";
import { nanoid } from "nanoid";

const Body = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]),
});

export async function POST(req: NextRequest) {
  if (!r2Configured) {
    return NextResponse.json(
      { error: "R2 not configured. Set R2_* env vars." },
      { status: 503 },
    );
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid body", detail: String(err) }, { status: 400 });
  }

  const ext = parsed.filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  const key = `letters/${new Date().toISOString().slice(0, 10)}/${nanoid()}.${ext}`;

  const { uploadUrl, publicUrl } = await presignUpload(key, parsed.contentType);

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
