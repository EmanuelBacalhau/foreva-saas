import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MAX_UPLOAD_BYTES, presignUpload, s3Configured } from "@/lib/s3";
import { nanoid } from "nanoid";

const Body = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export async function POST(req: NextRequest) {
  if (!s3Configured) {
    return NextResponse.json(
      { error: "S3 not configured. Set S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY." },
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
  const key = `tmp/${new Date().toISOString().slice(0, 10)}/${nanoid()}.${ext}`;

  const { uploadUrl, fields, publicUrl } = await presignUpload(key, parsed.contentType);

  return NextResponse.json({ uploadUrl, fields, publicUrl, key });
}
