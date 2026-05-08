import { HuggingFaceInference } from "@langchain/community/llms/hf";

export function makeQwen(opts?: { model?: string; temperature?: number; maxTokens?: number }) {
  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) throw new Error("HF_TOKEN missing");
  return new HuggingFaceInference({
    model: opts?.model ?? "Qwen/Qwen2.5-7B-Instruct",
    apiKey,
    temperature: opts?.temperature ?? 0.2,
    maxTokens: opts?.maxTokens ?? 512,
  });
}
