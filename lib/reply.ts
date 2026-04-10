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

  const toneMap = {
    confident: {
      softener: "No worries",
      push: "If you still want to do this, send me a day that actually works for you.",
      tease: "You can't leave me with that and no proper plan 😄 Pick a day that works for you.",
      direct: "If you're up for it, send a day that works.",
    },
    playful: {
      softener: "Fair enough",
      push: "If you're still in, send me a day that isn't pure chaos 😄",
      tease: "You can't hit me with that and disappear 😄 Pick a day that works for you.",
      direct: "If you're still interested, send a day that works.",
    },
    direct: {
      softener: "All good",
      push: "If you want to reschedule, send a specific day.",
      tease: "Pick a day that works if you still want to do this.",
      direct: "Send a specific day if you want to meet.",
    },
  }[tone];

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
      reply: `${toneMap.softener} — ${toneMap.push}`,
      why: "Their last message sounds flaky or non-committal, so the best move is calm and self-respecting: leave the ball in their court and ask for a specific day.",
      confidence: 82,
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
      reply:
        tone === "playful"
          ? "Love that. Let's lock it in before one of us starts acting mysterious 😄 Thursday or Saturday?"
          : tone === "direct"
          ? "Great. Thursday or Saturday?"
          : "Perfect. Let's lock it in — Thursday or Saturday?",
      why: "They are already positive, so the best next step is not more banter. Convert the momentum into an actual plan.",
      confidence: 88,
      tone,
    };
  }

  if (
    hasAny(lastMessage, [
      /\?$/,
      /what about you/,
      /what are you up to/,
      /how's it going/,
      /haha/,
      /lol/,
    ])
  ) {
    return {
      reply:
        tone === "playful"
          ? "Haha fair. I feel like you're more fun in person than over text though — true or false?"
          : tone === "direct"
          ? "You seem better in person than over text. True?"
          : "I feel like you're more interesting in person than over text — am I right?",
      why: "The conversation is still open and light. A stronger reply should move from flat small talk toward chemistry or a real-world plan.",
      confidence: 68,
      tone,
    };
  }

  return {
    reply:
      tone === "playful"
        ? toneMap.tease
        : tone === "direct"
        ? toneMap.direct
        : "Let's skip the endless texting a bit — if you're still up for it, send me a day that works.",
    why: "The fallback moved toward clarity and momentum while staying short enough to actually send.",
    confidence: 56,
    tone,
  };
}