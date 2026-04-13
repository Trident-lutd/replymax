import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildFallbackReply, type Tone } from "../../../lib/reply";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

type GenerateResponse = {
  reply: string;
  why: string;
  confidence: number;
  tone: Tone;
  source: "ai" | "fallback";
};

function cleanJsonBlock(text: string) {
  const trimmed = text.trim();

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const genericFence = trimmed.match(/```\s*([\s\S]*?)```/i);
  if (genericFence?.[1]) return genericFence[1].trim();

  return trimmed;
}

function normalizeConfidence(value: unknown) {
  const num = Number(value);
  if (Number.isNaN(num)) return 60;
  return Math.max(1, Math.min(100, Math.round(num)));
}

function getSystemPrompt(tone: Tone) {
  const toneInstructions =
    tone === "playful"
      ? "Make it witty, light, and flirt-aware. Use a little charm. Do not become cheesy or cringe."
      : tone === "direct"
      ? "Make it concise, clean, and assertive. No fluff. No overexplaining."
      : "Make it self-assured, attractive, and socially calibrated. Calm, not needy.";

  return `
You are writing ONE high-quality dating-app or texting reply.

Your output must:
- directly respond to the latest message
- clearly reflect the requested tone
- sound human and sendable
- usually be one sentence, occasionally two
- avoid generic filler
- avoid robotic phrasing
- avoid sounding needy, try-hard, or overly polite
- move the conversation forward

Tone instructions:
${toneInstructions}

Return STRICT JSON only in this shape:
{
  "reply": "string",
  "why": "string",
  "confidence": 0,
  "tone": "confident" | "playful" | "direct"
}
`;
}

export async function POST(req: NextRequest) {
  let conversation = "";
  let tone: Tone = "confident";

  try {
    const body = await req.json();
    conversation = String(body?.conversation || "").trim();
    tone = (body?.tone || "confident") as Tone;

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const fallback = buildFallbackReply(conversation, tone);
      return NextResponse.json<GenerateResponse>({
        ...fallback,
        source: "fallback",
      });
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: tone === "playful" ? 1 : 0.8,
      messages: [
        { role: "system", content: getSystemPrompt(tone) },
        {
          role: "user",
          content: `Requested tone: ${tone}

Conversation:
${conversation}

Write the single best next reply.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw =
      completion.choices?.[0]?.message?.content ||
      JSON.stringify(buildFallbackReply(conversation, tone));

    const parsed = JSON.parse(cleanJsonBlock(raw));
    const fallback = buildFallbackReply(conversation, tone);

    const response: GenerateResponse = {
      reply: String(parsed.reply || "").trim() || fallback.reply,
      why:
        String(parsed.why || "").trim() ||
        fallback.why,
      confidence: normalizeConfidence(parsed.confidence),
      tone:
        parsed.tone === "playful" || parsed.tone === "direct" || parsed.tone === "confident"
          ? parsed.tone
          : tone,
      source: "ai",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Generate route error:", error);

    const fallback = buildFallbackReply(conversation, tone);

    return NextResponse.json<GenerateResponse>({
      ...fallback,
      source: "fallback",
    });
  }
}