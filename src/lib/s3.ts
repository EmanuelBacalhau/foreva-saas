import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const bucket = process.env.S3_BUCKET ?? "";
const region = process.env.AWS_REGION ?? "sa-east-1";
const publicBase = process.env.S3_PUBLIC_BASE_URL ?? "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? "";

export const s3Configured = Boolean(bucket && accessKeyId && secretAccessKey);

const TMP_PREFIX = "tmp/";
const FINAL_PREFIX = "letters/";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

let _client: S3Client | null = null;
function client(): S3Client {
  if (!s3Configured) throw new Error("S3 not configured");
  if (!_client) {
    _client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _client;
}

function buildPublicUrl(key: string): string {
  return publicBase
    ? `${publicBase.replace(/\/$/, "")}/${key}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function presignUpload(tmpKey: string, contentType: string) {
  if (!tmpKey.startsWith(TMP_PREFIX)) throw new Error("upload key must start with tmp/");
  const { url, fields } = await createPresignedPost(client(), {
    Bucket: bucket,
    Key: tmpKey,
    Conditions: [
      ["content-length-range", 1, MAX_UPLOAD_BYTES],
      ["eq", "$Content-Type", contentType],
      ["starts-with", "$key", TMP_PREFIX],
    ],
    Fields: { "Content-Type": contentType },
    Expires: 60 * 5,
  });
  return { uploadUrl: url, fields, publicUrl: buildPublicUrl(tmpKey), key: tmpKey };
}

export async function promoteFromTmp(tmpKey: string) {
  if (!tmpKey.startsWith(TMP_PREFIX)) throw new Error("key not in tmp/");
  const finalKey = FINAL_PREFIX + tmpKey.slice(TMP_PREFIX.length);
  const c = client();
  await c.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${tmpKey}`,
      Key: finalKey,
    }),
  );
  await c.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: tmpKey,
    }),
  );
  return { key: finalKey, publicUrl: buildPublicUrl(finalKey) };
}
