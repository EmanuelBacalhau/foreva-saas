import crypto from "node:crypto";

const BASE = process.env.ABACATE_API_BASE ?? "https://api.abacatepay.com";
const KEY = process.env.ABACATE_API_KEY ?? "";

type CreatePixInput = {
  amountCents: number;
  description?: string;
  externalId?: string;
  expiresInSeconds?: number;
  customer?: {
    name: string;
    taxId: string;
    email?: string;
    cellphone?: string;
  };
  metadata?: Record<string, unknown>;
};

type CreatePixResponse = {
  data: {
    id: string;
    amount: number;
    status: string;
    brCode: string;
    brCodeBase64: string;
    expiresAt: string;
    createdAt: string;
  };
  success: boolean;
  error: string | null;
};

type CheckResponse = {
  data: { id: string; status: string; expiresAt: string };
  success: boolean;
  error: string | null;
};

function authHeaders() {
  if (!KEY) throw new Error("ABACATE_API_KEY not set");
  return {
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
  };
}

export async function createPixCharge(input: CreatePixInput): Promise<CreatePixResponse> {
  const res = await fetch(`${BASE}/v2/transparents/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      method: "PIX",
      data: {
        amount: input.amountCents,
        description: input.description,
        externalId: input.externalId,
        expiresIn: input.expiresInSeconds ?? 60 * 60,
        customer: input.customer,
        metadata: input.metadata,
      },
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as CreatePixResponse;
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Abacate create failed (${res.status})`);
  }
  return json;
}

export async function checkPixStatus(id: string): Promise<CheckResponse> {
  const res = await fetch(`${BASE}/v2/transparents/check?id=${encodeURIComponent(id)}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const json = (await res.json()) as CheckResponse;
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Abacate check failed (${res.status})`);
  }
  return json;
}

export function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
