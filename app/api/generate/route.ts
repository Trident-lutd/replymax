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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conversation = String(body?.conversation || "").trim();
    const tone = (body?.tone || "confident") as Tone;

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

    const systemPrompt = `
You are writing a SINGLE high-quality dating-app or texting reply.

Your job:
- Read the conversation carefully.
- Focus especially on the OTHER PERSON'S most recent message.
- Generate a reply that DIRECTLY addresses that message.
- The reply must feel natural, human, and actually sendable.
- Keep it short: usually 1 sentence, sometimes 2.
- Avoid generic filler, vague motivational language, and awkward "AI-sounding" phrasing.
- Do not sound needy.
- Do not sound manipulative or creepy.
- Do not over-explain.
- Do not ignore the actual conversation.
- If the other person is flaky, respond calmly and self-respectfully.
- If they are positive, move things forward.
- If the chat is flat, create chemistry or momentum.

Return STRICT JSON only in this shape:
{
  "reply": "string",
  "why": "string",
  "confidence": 0,
  "tone": "confident" | "playful" | "direct"
}
`;

    const userPrompt = `
Tone requested: ${tone}

Conversation:
${conversation}

Write the best next reply.
`;

    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const raw =
      completion.choices?.[0]?.message?.content ||
      JSON.stringify(buildFallbackReply(conversation, tone));

    const parsed = JSON.parse(cleanJsonBlock(raw));

    const response: GenerateResponse = {
      reply: String(parsed.reply || "").trim() || buildFallbackReply(conversation, tone).reply,
      why:
        String(parsed.why || "").trim() ||
        "This reply was chosen to match the tone of the conversation and directly address the last message.",
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

    try {
      const reqBody = await req.json().catch(() => null);
      const conversation = String(reqBody?.conversation || "").trim();
      const tone = (reqBody?.tone || "confident") as Tone;

      const fallback = buildFallbackReply(conversation, tone);
      return NextResponse.json<GenerateResponse>({
        ...fallback,
        source: "fallback",
      });
    } catch {
      return NextResponse.json(
        { error: "Unable to generate reply right now." },
        { status: 500 }
      );
    }
  }
}