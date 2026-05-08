import { FaissStore } from "@langchain/community/vectorstores/faiss";
import type { Embeddings } from "@langchain/core/embeddings";

export async function saveStore(store: FaissStore, dir: string): Promise<void> {
  await store.save(dir);
}

export async function loadStore(dir: string, embeddings: Embeddings): Promise<FaissStore> {
  return FaissStore.load(dir, embeddings);
}
