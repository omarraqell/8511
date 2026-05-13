import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) {
    return new Response(JSON.stringify({ error: "invalid id" }), { status: 400 });
  }
  await prisma.cartItem.delete({ where: { id: numeric } }).catch(() => null);
  return Response.json({ ok: true });
}
