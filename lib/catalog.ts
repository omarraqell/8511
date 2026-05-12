import { z } from "zod";
import fs from "node:fs";
import { prisma } from "@/lib/db";

export const KBChunkSchema = z.object({
  id: z.string(),
  type: z.enum(["service", "about", "store", "contact"]),
  title: z.string(),
  text: z.string(),
});
export type KBChunk = z.infer<typeof KBChunkSchema>;

export async function loadProducts() {
  return prisma.product.findMany({
    include: {
      brand: true,
      variants: { orderBy: { sizeEu: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      variants: { orderBy: { sizeEu: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export type ProductWithRelations = Awaited<ReturnType<typeof getProductBySlug>>;

export function loadKB(file = "data/kb.json"): KBChunk[] {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  return z.array(KBChunkSchema).parse(raw);
}
