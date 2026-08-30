/// <reference lib="webworker" />

import type { MLCEngineInterface } from "@mlc-ai/web-llm";

// Available models — ordered by size (smallest first)
export const MODELS = {
  fast: {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    name: "Fast (1B)",
    label: "Fast Model",
    size: "~760MB download",
    description: "Quick responses. Good for general chat and questions.",
    bestFor: "Simple tasks, fast replies",
    speed: 3,
    quality: 2,
  },
  balanced: {
    id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
    name: "Balanced (3B)",
    label: "Balanced Model",
    size: "~1.8GB download",
    description: "Better quality responses. Takes slightly longer.",
    bestFor: "Writing, analysis, longer tasks",
    speed: 2,
    quality: 3,
  },
  quality: {
    id: "Llama-3.1-8B-Instruct-q4f32_1-MLC",
    name: "Quality (8B)",
    label: "Quality Model",
    size: "~4.9GB download",
    description: "Best quality. Needs a good GPU and fast internet.",
    bestFor: "Complex reasoning, creative writing",
    speed: 1,
    quality: 4,
  },
} as const;

export type ModelKey = keyof typeof MODELS;

let engine: MLCEngineInterface | null = null;
let currentModel = "";

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  switch (type) {
    case "LOAD_MODEL": {
      const modelKey = (payload?.model || "fast") as ModelKey;
      const modelConfig = MODELS[modelKey];
      if (!modelConfig) {
        self.postMessage({ type: "ERROR", error: "Unknown model" });
        return;
      }

      try {
        self.postMessage({ type: "LOADING_START", modelName: modelConfig.name });

        // Dynamic import to avoid loading web-llm unless needed
        const webllm = await import("@mlc-ai/web-llm");

        engine = await webllm.CreateMLCEngine(modelConfig.id, {
          initProgressCallback: (progress: { progress: number; text: string }) => {
            self.postMessage({
              type: "LOADING_PROGRESS",
              progress: Math.round(progress.progress * 100),
              text: progress.text,
            });
          },
        });

        currentModel = modelKey;
        self.postMessage({ type: "LOADED", modelName: modelConfig.name, modelKey });
      } catch (err) {
        self.postMessage({
          type: "ERROR",
          error: err instanceof Error ? err.message : "Model load failed",
        });
      }
      break;
    }

    case "CHAT": {
      if (!engine) {
        self.postMessage({ type: "ERROR", error: "Model not loaded" });
        return;
      }

      try {
        const messages = payload.messages;

        self.postMessage({ type: "STREAM_START" });

        const stream = await engine.chat.completions.create({
          messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 1024,
        });

        let fullText = "";
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || "";
          fullText += delta;
          self.postMessage({ type: "STREAM_CHUNK", chunk: delta });
        }

        self.postMessage({ type: "STREAM_END", fullText });
      } catch (err) {
        self.postMessage({
          type: "ERROR",
          error: err instanceof Error ? err.message : "Generation failed",
        });
      }
      break;
    }

    case "RESET": {
      if (engine) await engine.resetChat();
      self.postMessage({ type: "RESET_DONE" });
      break;
    }

    case "CHECK_WEBGPU": {
      const supported = "gpu" in navigator;
      self.postMessage({ type: "WEBGPU_STATUS", supported });
      break;
    }
  }
};
