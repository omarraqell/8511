import { describe, it, expect, afterAll } from "vitest";
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
import { prisma } from "@/lib/db";
import { loadProducts, getProductBySlug, loadKB } from "@/lib/catalog";

describe("catalog", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("loadProducts returns products with brand and variants", async () => {
    const products = await loadProducts();
    expect(products.length).toBeGreaterThan(0);
    const p = products[0];
    expect(p.brand).toBeDefined();
    expect(p.brand.slug).toMatch(/nike|adidas|supreme|hats/);
    expect(Array.isArray(p.variants)).toBe(true);
  });

  it("getProductBySlug returns one product or null", async () => {
    const all = await loadProducts();
    const slug = all[0].slug;
    const single = await getProductBySlug(slug);
    expect(single?.slug).toBe(slug);
    expect((single?.variants.length ?? 0)).toBeGreaterThan(0);

    const missing = await getProductBySlug("definitely-not-a-real-slug-xyz");
    expect(missing).toBeNull();
  });

  it("loadKB still reads data/kb.json", () => {
    const kb = loadKB();
    expect(kb.length).toBeGreaterThan(0);
    expect(kb[0].type).toMatch(/service|about|store|contact/);
  });
});
