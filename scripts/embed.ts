import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Document } from "@langchain/core/documents";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { loadProducts, loadKB } from "../lib/catalog";
import { GeminiMultimodalEmbeddings } from "../lib/rag/embeddings";

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
  const embeddings = new GeminiMultimodalEmbeddings();

  const products = loadProducts();
  const kb = loadKB();

  const textDocs: Document[] = [
    ...products.map(p => new Document({
      pageContent: `${p.name}. ${p.description}${p.price ? ` Price: ${p.price}.` : ""}`,
      metadata: { kind: "product", slug: p.slug, modality: "text", brand: p.brand, image_url: p.image_url, source_url: p.source_url, name: p.name, price: p.price ?? "" },
    })),
    ...kb.map(c => new Document({
      pageContent: `${c.title}. ${c.text}`,
      metadata: { kind: "kb", id: c.id, modality: "text", type: c.type, title: c.title },
    })),
  ];

  console.log(`embedding ${textDocs.length} text documents...`);
  const store = await FaissStore.fromDocuments(textDocs, embeddings);

  console.log(`embedding ${products.length} product images...`);
  let imgOk = 0;
  for (const p of products) {
    const imgPath = path.join("public", p.image_url.replace(/^\//, ""));
    if (!fs.existsSync(imgPath)) { console.warn("no image for", p.slug); continue; }
    const bytes = fs.readFileSync(imgPath);
    let attempts = 0;
    let success = false;
    while (attempts < 5 && !success) {
      attempts++;
      try {
        const vec = await embeddings.embedImage(bytes);
        await store.addVectors(
          [vec],
          [new Document({
            pageContent: `[image of ${p.name}]`,
            metadata: { kind: "product", slug: p.slug, modality: "image", brand: p.brand, image_url: p.image_url, source_url: p.source_url, name: p.name, price: p.price ?? "" },
          })],
        );
        success = true;
        imgOk++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const is429 = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
        if (is429 && attempts < 5) {
          const wait = 30000 * attempts;
          console.warn(`rate limited on ${p.slug}, waiting ${wait}ms (attempt ${attempts}/5)`);
          await new Promise(r => setTimeout(r, wait));
        } else {
          console.warn("image embed failed for", p.slug, msg);
          break;
        }
      }
    }
    // gentle throttle to stay under per-minute quota
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log(`image vectors written: ${imgOk}/${products.length}`);

  fs.mkdirSync("data/faiss", { recursive: true });
  await store.save("data/faiss");
  console.log(`saved index to data/faiss (${textDocs.length} text + ${products.length} image vectors)`);
}

main().catch(e => { console.error(e); process.exit(1); });
