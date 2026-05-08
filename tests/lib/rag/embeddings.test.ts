import { describe, it, expect, vi } from "vitest";
import { GeminiMultimodalEmbeddings } from "@/lib/rag/embeddings";

function fakeClient(textVec: number[], imageVec: number[]) {
  return {
    models: {
      embedContent: vi.fn().mockImplementation(async ({ contents }: any) => {
        const part = contents[0]?.parts?.[0] ?? contents[0];
        const isImage = part?.inlineData != null;
        return { embeddings: [{ values: isImage ? imageVec : textVec }] };
      }),
    },
  };
}

describe("GeminiMultimodalEmbeddings", () => {
  it("returns text embeddings for embedDocuments", async () => {
    const tv = new Array(3072).fill(0.1);
    const e = new GeminiMultimodalEmbeddings({ apiKey: "k", client: fakeClient(tv, []) as any });
    const out = await e.embedDocuments(["hello", "world"]);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual(tv);
  });

  it("returns text embedding for embedQuery", async () => {
    const tv = new Array(3072).fill(0.2);
    const e = new GeminiMultimodalEmbeddings({ apiKey: "k", client: fakeClient(tv, []) as any });
    const v = await e.embedQuery("hello");
    expect(v).toEqual(tv);
  });

  it("embedImage sends base64 inlineData and returns image embedding", async () => {
    const iv = new Array(3072).fill(0.5);
    const client = fakeClient([], iv);
    const e = new GeminiMultimodalEmbeddings({ apiKey: "k", client: client as any });
    const v = await e.embedImage(Buffer.from("fakejpg"), "image/jpeg");
    expect(v).toEqual(iv);
    const arg = (client.models.embedContent as any).mock.calls[0][0];
    expect(arg.contents[0].parts[0].inlineData.mimeType).toBe("image/jpeg");
    expect(arg.contents[0].parts[0].inlineData.data).toBe(Buffer.from("fakejpg").toString("base64"));
  });
});
