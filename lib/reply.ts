export type Tone = 'confident' | 'playful' | 'direct';

type Scenario = 'positive' | 'flaky' | 'logistics' | 'shortReply' | 'noReply' | 'general';

export function detectScenario(text: string): Scenario {
  const t = text.toLowerCase();
  const signals = {
    shortReply: /(\bk\b|\bok\b|\bhaha\b|\blol\b|\bnice\b|\bcool\b|\bmaybe\b|we'll see|we will see)/.test(t),
    noReply: /(seen|left on read|ignored|no reply|didn'?t answer|didnt answer)/.test(t),
    logistics: /(when are you free|what are you doing|this weekend|tonight|tomorrow|grab a drink|coffee|dinner|meet)/.test(t),
    flaky: /(sorry.*busy|maybe another time|let you know|something came up|rain check)/.test(t),
    positive: /(sounds good|yes|definitely|i'd love to|let's do it|can't wait)/.test(t),
  };

  if (signals.positive) return 'positive';
  if (signals.flaky) return 'flaky';
  if (signals.logistics) return 'logistics';
  if (signals.shortReply) return 'shortReply';
  if (signals.noReply) return 'noReply';
  return 'general';
}

export function buildReply(input: string, tone: Tone) {
  const scenario = detectScenario(input);

  const library: Record<Scenario, Record<Tone, string>> = {
    positive: {
      confident: 'Perfect. Let’s lock it in — are you free Thursday evening or Saturday afternoon?',
      playful: 'Love that. Let’s make it happen before one of us starts acting mysterious 😏 Thursday or Saturday?',
      direct: 'Great. Pick a day: Thursday evening or Saturday afternoon.',
    },
    flaky: {
      confident: 'No worries — if you genuinely want to do this, send me a day that works and we’ll make it easy.',
      playful: 'I respect the dramatic scheduling arc 😂 If you’re still up for it, send me a day that actually works.',
      direct: 'All good. If you want to reschedule, send a specific day.',
    },
    logistics: {
      confident: 'I’m free Thursday after 7. Let’s keep it simple and grab a drink.',
      playful: 'Thursday after 7 works for me. Low effort, high quality — drink and good conversation.',
      direct: 'Thursday after 7 works. Let’s do drinks.',
    },
    shortReply: {
      confident: 'You seem fun when you’re not giving me one-word replies. What’s your actual verdict — trouble or worth meeting?',
      playful: 'That reply was almost suspiciously brief 😂 Give me a real answer — what’s your vibe actually like?',
      direct: 'You can give me more than one word. What do you actually think?',
    },
    noReply: {
      confident: 'I’m going to assume your week got chaotic rather than my chat being tragic. If you’re still up for it, let’s do Thursday.',
      playful: 'Either you got busy or I need to fire my texting intern 😌 If you’re still interested, let’s pick a day.',
      direct: 'Checking once: if you’re still interested, let’s set a day. If not, no worries.',
    },
    general: {
      confident: 'Let’s skip the pen-pal phase a little — what’s something about you that’s more interesting in person than over text?',
      playful: 'Enough polite small talk. What’s the quickest way I’d figure out your real personality in ten minutes?',
      direct: 'What’s something real about you that doesn’t come across over text?',
    },
  };

  return library[scenario][tone];
}

export function buildAnalysis(input: string) {
  const scenario = detectScenario(input);
  const notes: Record<Scenario, { score: number; diagnosis: string; fix: string }> = {
    positive: {
      score: 86,
      diagnosis: 'Good signal. The move now is to stop chatting in circles and convert to a plan.',
      fix: 'Offer two concrete time options instead of asking vague open-ended questions.',
    },
    flaky: {
      score: 42,
      diagnosis: 'Interest might be real, but priority is low right now.',
      fix: 'Do not chase. Hand the ball back and require a specific day from them.',
    },
    logistics: {
      score: 74,
      diagnosis: 'This is close to a date. Momentum matters more than cleverness now.',
      fix: 'Be simple, decisive, and move to a clear plan.',
    },
    shortReply: {
      score: 39,
      diagnosis: 'Energy is flat. You need to create tension, playfulness, or specificity.',
      fix: 'Avoid interview questions and generic compliments. Use sharper, more polarizing prompts.',
    },
    noReply: {
      score: 31,
      diagnosis: 'You may be sliding into chasing territory.',
      fix: 'Send one clean re-entry text. If there’s still no response, move on.',
    },
    general: {
      score: 57,
      diagnosis: 'Neutral. Nothing is broken, but nothing is creating momentum yet.',
      fix: 'Push toward banter, chemistry, or a real-world plan faster.',
    },
  };
  return notes[scenario];
}
