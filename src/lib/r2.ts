import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
const bucket = process.env.R2_BUCKET ?? "";
const publicBase = process.env.R2_PUBLIC_BASE_URL ?? "";

export const r2Configured = Boolean(accountId && accessKeyId && secretAccessKey && bucket);

let _client: S3Client | null = null;
function client(): S3Client {
  if (!r2Configured) throw new Error("R2 not configured");
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _client;
}

export async function presignUpload(key: string, contentType: string) {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client(), cmd, { expiresIn: 60 * 5 });
  const publicUrl = publicBase
    ? `${publicBase.replace(/\/$/, "")}/${key}`
    : `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`;
  return { uploadUrl, publicUrl };
}
