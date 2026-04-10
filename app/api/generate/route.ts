import { NextRequest, NextResponse } from 'next/server';
import { buildReply, type Tone } from '../../../lib/reply';

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

function promptFor(conversation: string, tone: Tone) {
  return [
    'You generate short, high-converting dating app text replies.',
    'Return one reply only.',
    'Keep it under 35 words unless a longer response is clearly necessary.',
    'Make it sound human, not robotic.',
    `Desired tone: ${tone}.`,
    'Avoid manipulation, threats, harassment, or sexual coercion.',
    'Conversation:',
    conversation,
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { conversation, tone } = (await req.json()) as { conversation?: string; tone?: Tone };

    if (!conversation || !tone) {
      return NextResponse.json({ error: 'conversation and tone are required' }, { status: 400 });
    }

    const localFallback = buildReply(conversation, tone);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: localFallback, source: 'fallback' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: promptFor(conversation, tone),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ reply: localFallback, error: `Model request failed: ${text}`, source: 'fallback' }, { status: 200 });
    }

    const data = (await response.json()) as { output_text?: string };
    const reply = data.output_text?.trim() || localFallback;
    return NextResponse.json({ reply, source: 'openai' });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
