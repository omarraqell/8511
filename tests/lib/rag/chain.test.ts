import { describe, it, expect } from "vitest";
import { Document } from "@langchain/core/documents";
import { formatContext } from "@/lib/rag/chain";

describe("formatContext", () => {
  it("renders product docs with slug, name, price", () => {
    const ctx = formatContext([
      new Document({ pageContent: "ignored", metadata: { kind: "product", slug: "aj1", name: "Air Jordan 1", price: "JD 250" } }),
    ]);
    expect(ctx).toContain("aj1");
    expect(ctx).toContain("Air Jordan 1");
    expect(ctx).toContain("JD 250");
  });

  it("renders kb docs with title + text", () => {
    const ctx = formatContext([
      new Document({ pageContent: "Authentication body", metadata: { kind: "kb", title: "Sneaker Authentication" } }),
    ]);
    expect(ctx).toContain("Sneaker Authentication");
    expect(ctx).toContain("Authentication body");
  });
});
