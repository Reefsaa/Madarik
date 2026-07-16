import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";

const chatRouter = Router();

const SYSTEM_PROMPTS = {
  business: `You are Modrik (مدارك), an AI financial advisor specialized in Saudi business finance. You analyze cash flow, optimize expenses, recommend financing, and provide business health insights. All currency amounts are in SAR (Saudi Riyal). Be concise, actionable, and data-driven. Provide practical recommendations that improve business financial health. Keep responses focused and under 3 paragraphs unless detail is explicitly requested.`,
  personal: `You are Modrik (مدارك), an AI behavioral finance advisor and personal financial coach for Saudi individuals. You specialize in behavioral finance, emotional trading discipline, portfolio management, investment psychology, and personal financial health. You detect emotional trading patterns (FOMO, panic selling, overconfidence) and help users make rational, disciplined financial decisions. Be empathetic, insightful, and educational. All currency amounts are in SAR. Keep responses concise and actionable.`,
};

chatRouter.post("/chat", async (req, res) => {
  const { messages, mode = "business" } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    mode?: string;
  };

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "AI service not configured. Please add ANTHROPIC_API_KEY to secrets." });
    return;
  }

  const anthropic = new Anthropic({ apiKey });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] ?? SYSTEM_PROMPTS.business;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: messages.slice(-20), // keep last 20 messages for context
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "AI request failed";
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
});

export default chatRouter;
