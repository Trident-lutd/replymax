export type Tone = "confident" | "playful" | "direct";

type FallbackResult = {
  reply: string;
  why: string;
  confidence: number;
  tone: Tone;
};

function getLastNonEmptyLine(conversation: string) {
  const lines = conversation
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines[lines.length - 1] : "";
}

function stripSpeakerPrefix(line: string) {
  return line.replace(/^(them|you|me)\s*:\s*/i, "").trim();
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

export function buildFallbackReply(
  conversation: string,
  tone: Tone = "confident"
): FallbackResult {
  const lastLine = getLastNonEmptyLine(conversation);
  const lastMessage = stripSpeakerPrefix(lastLine).toLowerCase();

  const confident = {
    flaky: "No worries — if you're still up for it, send me a day that actually works for you.",
    positive: "Perfect. Let's lock it in — Thursday or Saturday?",
    open: "I feel like you're better in person than over text — am I right?",
    generic: "Let's skip the dead texting and move this forward — send me a day that works.",
  };

  const playful = {
    flaky: "Haha fair — if you're still in, send me a day that isn't total chaos 😄",
    positive: "Love that. Let's lock it in before one of us gets mysteriously busy 😄 Thursday or Saturday?",
    open: "You seem like way more fun in person than over text — true or false?",
    generic: "You can't leave me on the almost-plan stage forever 😄 Pick a day that works.",
  };

  const direct = {
    flaky: "All good. If you want to reschedule, send a specific day.",
    positive: "Great. Thursday or Saturday?",
    open: "You seem better in person than over text. True?",
    generic: "If you're interested, send a day that works.",
  };

  const voice = tone === "playful" ? playful : tone === "direct" ? direct : confident;

  if (
    hasAny(lastMessage, [
      /maybe another time/,
      /rain check/,
      /let you know/,
      /busy/,
      /chaotic/,
      /something came up/,
      /another time/,
    ])
  ) {
    return {
      reply: voice.flaky,
      why: "Their message is non-committal, so the strongest move is calm, low-need, and pushes for a specific plan instead of more back-and-forth.",
      confidence: tone === "direct" ? 84 : tone === "playful" ? 80 : 82,
      tone,
    };
  }

  if (
    hasAny(lastMessage, [
      /sounds good/,
      /let's do it/,
      /i'd love to/,
      /yes/,
      /definitely/,
      /perfect/,
    ])
  ) {
    return {
      reply: voice.positive,
      why: "They are already warm, so the right move is to convert that momentum into a real plan.",
      confidence: tone === "direct" ? 90 : tone === "playful" ? 87 : 88,
      tone,
    };
  }

  if (
    hasAny(lastMessage, [/\?$/, /what about you/, /what are you up to/, /how's it going/, /haha/, /lol/])
  ) {
    return {
      reply: voice.open,
      why: "The chat is still open but flat, so the reply should create chemistry instead of continuing generic small talk.",
      confidence: tone === "direct" ? 70 : tone === "playful" ? 73 : 68,
      tone,
    };
  }

  return {
    reply: voice.generic,
    why: "This fallback keeps the message short, sendable, and more directional than generic filler.",
    confidence: tone === "direct" ? 60 : tone === "playful" ? 58 : 56,
    tone,
  };
}