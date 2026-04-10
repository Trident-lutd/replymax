"use client";

import { useMemo, useState } from "react";

type Tone = "confident" | "playful" | "direct";

type GenerateResult = {
  reply: string;
  why: string;
  confidence: number;
  tone: Tone;
  source: "ai" | "fallback";
};

export default function HomePage() {
  const [conversation, setConversation] = useState(`Them: sorry i've been busy this week 😅
You: no worries, how's it going?
Them: chaotic lol maybe another time`);
  const [tone, setTone] = useState<Tone>("confident");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const generationsLeft = useMemo(() => 5, []);

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate reply.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.error || "Unable to start checkout.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed.");
    }
  }

  async function copyReply() {
    if (!result?.reply) return;
    await navigator.clipboard.writeText(result.reply);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
              Built for fast testing
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-none tracking-tight md:text-7xl">
              Paste the chat.
              <br />
              Get a better reply.
              <br />
              Move it forward.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              ReplyMax gives you a sharper next message that actually relates to
              the conversation in front of you — not random generic filler.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/15 px-4 py-2">
                Relevant replies
              </span>
              <span className="rounded-full border border-white/15 px-4 py-2">
                Tone control
              </span>
              <span className="rounded-full border border-white/15 px-4 py-2">
                Fast sendable output
              </span>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-semibold">Fast value</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  One painful moment. One useful next message.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-semibold">Better relevance</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  The reply is built around the latest message, not boilerplate.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-semibold">Monetizable</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Free to try. Upgrade when it proves useful.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 text-black shadow-2xl">
            <h2 className="text-4xl font-semibold tracking-tight">
              Try the core flow
            </h2>
            <p className="mt-3 text-sm text-black/65">
              Paste a conversation snippet and get a stronger next message.
            </p>

            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              className="mt-6 min-h-[170px] w-full rounded-3xl border border-black/10 bg-black/[0.03] p-4 text-base outline-none"
            />

            <div className="mt-5 grid grid-cols-3 gap-3">
              {(["confident", "playful", "direct"] as Tone[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setTone(item)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    tone === item
                      ? "bg-black text-white"
                      : "border border-black/10 bg-black/[0.03] text-black/75"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate reply"}
              </button>

              <button
                onClick={copyReply}
                disabled={!result?.reply}
                className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-black/70 disabled:opacity-50"
              >
                Copy reply
              </button>
            </div>

            <p className="mt-4 text-sm text-black/55">
              Free generations left today: {generationsLeft}
            </p>

            {error ? (
              <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5 rounded-3xl border border-black/10 bg-black/[0.03] p-5">
              <div className="text-sm text-black/55">Suggested reply</div>
              <p className="mt-3 text-[1.05rem] leading-8">
                {result?.reply || "Your improved reply will appear here."}
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="rounded-3xl border border-black/10 p-5">
                <div className="text-sm text-black/55">Confidence</div>
                <div className="mt-2 text-4xl font-semibold">
                  {result?.confidence ?? 0}/100
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 p-5">
                <div className="text-sm text-black/55">Why this works</div>
                <p className="mt-2 text-sm leading-7 text-black/75">
                  {result?.why ||
                    "You’ll see a short explanation here so the output doesn’t feel random."}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-black/10 p-6">
                <div className="text-sm text-black/55">Free</div>
                <div className="mt-2 text-5xl font-semibold">£0</div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-black/75">
                  <p>5 reply generations per day</p>
                  <p>3 tone modes</p>
                  <p>Copy-ready replies</p>
                  <p>Basic confidence score</p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-black p-6 text-white">
                <div className="text-sm text-white/60">Pro</div>
                <div className="mt-2 text-5xl font-semibold">
                  £14<span className="text-lg text-white/60">/mo</span>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                  <p>Unlimited generations</p>
                  <p>Stronger analysis</p>
                  <p>Premium persona modes</p>
                  <p>Cleaner upgrade path</p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black"
                >
                  Start Pro
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-black/10 p-6">
              <h3 className="text-3xl font-semibold tracking-tight">
                Join waitlist
              </h3>
              <p className="mt-2 text-sm text-black/65">
                For launch updates, product changes, and early offers.
              </p>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="mt-4 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none"
              />

              <button
                className="mt-4 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
                onClick={() => alert("Waitlist capture is still UI-only in this MVP.")}
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}