import { describe, it, expect } from "vitest";
import { FakeEmbeddings } from "@langchain/core/utils/testing";
import { Document } from "@langchain/core/documents";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { saveStore, loadStore } from "@/lib/rag/vectorstore";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

describe("vectorstore", () => {
  it("saves and loads a FaissStore", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "faiss-"));
    const store = await FaissStore.fromDocuments(
      [new Document({ pageContent: "hi", metadata: { id: "a" } })],
      new FakeEmbeddings()
    );
    await saveStore(store, dir);
    const loaded = await loadStore(dir, new FakeEmbeddings());
    const r = await loaded.similaritySearch("hi", 1);
    expect(r[0].metadata.id).toBe("a");
  });
});
