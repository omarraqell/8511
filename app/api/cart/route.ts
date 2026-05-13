import { prisma } from "@/lib/db";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const COOKIE = "cart_sid";

function readSid(req: Request): string | null {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === COOKIE) return v ?? null;
  }
  return null;
}

function setSidHeader(sid: string): HeadersInit {
  return {
    "set-cookie": `${COOKIE}=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
    "content-type": "application/json",
  };
}

async function getOrCreateCart(sid: string) {
  const existing = await prisma.cart.findFirst({
    where: { sessionId: sid, userId: null },
    include: { items: true },
  });
  if (existing) return existing;
  return prisma.cart.create({
    data: { sessionId: sid },
    include: { items: true },
  });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    productId: number;
    variantId?: number;
    quantity?: number;
  };
  if (!body.productId) {
    return new Response(JSON.stringify({ error: "productId required" }), { status: 400 });
  }
  let sid = readSid(req);
  const isNew = !sid;
  if (!sid) sid = randomUUID();

  const cart = await getOrCreateCart(sid);
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: body.productId,
      variantId: body.variantId,
      quantity: body.quantity ?? 1,
    },
  });
  const fresh = await prisma.cart.findUniqueOrThrow({
    where: { id: cart.id },
    include: { items: true },
  });
  return new Response(JSON.stringify(fresh), {
    status: 200,
    headers: isNew ? setSidHeader(sid) : { "content-type": "application/json" },
  });
}

export async function GET(req: Request) {
  const sid = readSid(req);
  if (!sid) return Response.json({ items: [] });
  const cart = await prisma.cart.findFirst({
    where: { sessionId: sid, userId: null },
    include: { items: true },
  });
  return Response.json(cart ?? { items: [] });
}
