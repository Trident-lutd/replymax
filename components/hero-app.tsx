'use client';

import { useMemo, useState } from 'react';
import type { Tone } from '@/lib/reply';
import { buildAnalysis, buildReply } from '@/lib/reply';

const FREE_DAILY_LIMIT = 5;
const STORAGE_KEY = 'replymax_daily_usage';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getStoredUsage() {
  if (typeof window === 'undefined') return { date: getTodayKey(), count: 0 };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { date: getTodayKey(), count: 0 };
  try {
    const parsed = JSON.parse(raw) as { date: string; count: number };
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function setStoredUsage(count: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
}

export default function HeroApp() {
  const [conversation, setConversation] = useState('');
  const [tone, setTone] = useState<Tone>('confident');
  const [email, setEmail] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [waitlistState, setWaitlistState] = useState<'idle' | 'saving' | 'done'>('idle');

  const fallbackReply = useMemo(() => buildReply(conversation || 'general conversation', tone), [conversation, tone]);
  const analysis = useMemo(() => buildAnalysis(conversation || 'general conversation'), [conversation]);
  const usage = getStoredUsage();
  const freeRemaining = Math.max(FREE_DAILY_LIMIT - usage.count, 0);
  const reply = generatedReply || fallbackReply;

  async function generateReply() {
    setError('');
    if (!conversation.trim()) {
      setError('Paste a conversation first.');
      return;
    }
    if (freeRemaining <= 0) {
      setError('You used today’s free generations. Plug Stripe in and send people to Pro from here.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, tone }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error || 'Generation failed.');
      }
      const nextCount = usage.count + 1;
      setStoredUsage(nextCount);
      setGeneratedReply(data.reply);
    } catch (err) {
      setGeneratedReply(fallbackReply);
      setError(err instanceof Error ? `${err.message} Showing fallback reply.` : 'Generation failed. Showing fallback reply.');
    } finally {
      setLoading(false);
    }
  }

  async function copyReply() {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  async function saveWaitlist() {
    if (!email.trim()) return;
    setWaitlistState('saving');
    try {
      const existing = JSON.parse(window.localStorage.getItem('replymax_waitlist') || '[]') as string[];
      if (!existing.includes(email)) {
        existing.push(email);
      }
      window.localStorage.setItem('replymax_waitlist', JSON.stringify(existing));
      setWaitlistState('done');
      setEmail('');
    } finally {
      setTimeout(() => setWaitlistState('idle'), 1800);
    }
  }

  async function startCheckout() {
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error || 'Checkout is not configured yet. Add Stripe keys to enable Pro.');
    } catch {
      setError('Checkout failed. Add Stripe keys to enable Pro.');
    }
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-mark">R</div>
            <div>
              <div style={{ fontWeight: 700 }}>ReplyMax</div>
              <div className="subtle small">Stop getting ignored. Get better replies instantly.</div>
            </div>
          </div>
          <div className="row">
            <span className="badge">Deploy-ready MVP</span>
            <a className="btn" href="#pricing">Pricing</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge light">Built to test demand fast</span>
              <h1>Paste the chat. Get the reply. Move it forward.</h1>
              <p className="lead">
                This is a landing-page-first dating reply optimizer with a real API route, free daily limits on the client, and Stripe checkout wiring ready to be turned on.
              </p>
              <div className="row" style={{ marginTop: 24 }}>
                <span className="badge">Instant rewrites</span>
                <span className="badge">Tone controls</span>
                <span className="badge">Free-to-paid funnel</span>
              </div>
              <div className="kicker-grid">
                <div className="card card-pad"><strong>Fast value</strong><div className="subtle small">One painful moment. One clear output.</div></div>
                <div className="card card-pad"><strong>Sticky loop</strong><div className="subtle small">Message arrives → open app → copy reply.</div></div>
                <div className="card card-pad"><strong>Monetizable</strong><div className="subtle small">Free credits now. Unlimited in Pro later.</div></div>
              </div>
            </div>

            <div className="card light card-pad">
              <h2 style={{ fontSize: 32, marginBottom: 8 }}>Try the core flow</h2>
              <p className="small" style={{ color: '#4b5563', marginTop: 0 }}>Paste a conversation snippet and generate a stronger reply.</p>
              <textarea
                className="textarea"
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                placeholder={"Example:\nThem: sorry i've been busy this week 😅\nYou: no worries, how's it going?\nThem: chaotic lol maybe another time"}
              />
              <div style={{ height: 14 }} />
              <div className="tone-group">
                {(['confident', 'playful', 'direct'] as Tone[]).map((value) => (
                  <button
                    key={value}
                    className={`tone-btn ${tone === value ? 'active' : ''}`}
                    onClick={() => setTone(value)}
                    type="button"
                  >
                    {value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ height: 14 }} />
              <div className="row">
                <button className="btn primary" type="button" onClick={generateReply} disabled={loading}>
                  {loading ? 'Generating…' : 'Generate reply'}
                </button>
                <button className="btn" type="button" onClick={copyReply}> {copied ? 'Copied' : 'Copy reply'} </button>
              </div>
              <div className="small" style={{ color: '#6b7280', marginTop: 10 }}>Free generations left today: {freeRemaining}</div>
              <div style={{ height: 14 }} />
              <div className="metric" style={{ background: '#f3f4f6' }}>
                <div className="small" style={{ color: '#6b7280' }}>Suggested reply</div>
                <div style={{ color: '#111827', marginTop: 8, lineHeight: 1.7 }}>{reply}</div>
              </div>
              <div style={{ height: 14 }} />
              <div className="metric-grid">
                <div className="metric">
                  <div className="small" style={{ color: '#6b7280' }}>Conversation score</div>
                  <div style={{ fontSize: 36, fontWeight: 700, marginTop: 6 }}>{analysis.score}/100</div>
                </div>
                <div className="metric">
                  <div className="small" style={{ color: '#6b7280' }}>What is going on</div>
                  <div className="small" style={{ color: '#374151', marginTop: 8 }}>{analysis.diagnosis}</div>
                </div>
              </div>
              <div style={{ height: 14 }} />
              <div className="metric">
                <div className="small" style={{ color: '#6b7280' }}>Best next move</div>
                <div className="small" style={{ color: '#374151', marginTop: 8 }}>{analysis.fix}</div>
              </div>
              {error ? <div className="notice error" style={{ marginTop: 14 }}>{error}</div> : null}
            </div>
          </div>
        </section>

        <section className="container" style={{ paddingBottom: 26 }} id="pricing">
          <div className="section-grid">
            <div className="card card-pad">
              <h2>Pricing I would test first</h2>
              <p className="lead" style={{ fontSize: 17 }}>Simple enough to launch quickly, strong enough to monetize if the traffic hits.</p>
              <div className="pricing-grid">
                <div className="price-card dark">
                  <div className="subtle small">Free</div>
                  <div style={{ fontSize: 46, fontWeight: 700, marginTop: 6 }}>£0</div>
                  <p className="small subtle">5 reply generations per day. Enough to prove value and build habit.</p>
                  <div className="list small">
                    <div>3 tone modes</div>
                    <div>Copy-ready replies</div>
                    <div>Basic conversation score</div>
                  </div>
                </div>
                <div className="price-card light">
                  <div className="small" style={{ color: '#6b7280' }}>Pro</div>
                  <div style={{ fontSize: 46, fontWeight: 700, marginTop: 6 }}>£14<span style={{ fontSize: 18, color: '#6b7280' }}>/mo</span></div>
                  <p className="small" style={{ color: '#4b5563' }}>Unlimited generations, premium personas, stronger analysis, and cleaner upsell paths.</p>
                  <div className="list small" style={{ color: '#111827' }}>
                    <div>Unlimited replies</div>
                    <div>Ghost / flake / recovery prompts</div>
                    <div>Premium persona modes</div>
                  </div>
                  <button className="btn primary block" style={{ marginTop: 18 }} type="button" onClick={startCheckout}>Start Pro</button>
                </div>
              </div>
            </div>

            <div className="card card-pad">
              <h2>Waitlist capture</h2>
              <p className="lead" style={{ fontSize: 17 }}>This uses local storage out of the box. Swap it for Supabase, Firebase, ConvertKit, or Beehiiv when you want real collection.</p>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              <div style={{ height: 12 }} />
              <button className="btn primary block" type="button" onClick={saveWaitlist}>
                {waitlistState === 'saving' ? 'Saving…' : waitlistState === 'done' ? 'Saved' : 'Join waitlist'}
              </button>
              <div style={{ height: 12 }} />
              <div className="notice success">Fast launch path: deploy this first, then replace local waitlist storage with your database or ESP.</div>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: '16px 24px 56px' }}>
          <div className="card card-pad">
            <h2>What is already wired</h2>
            <div className="list small subtle">
              <div>1. Next.js app router project structure.</div>
              <div>2. API route for reply generation with OpenAI REST call support and a local fallback.</div>
              <div>3. Stripe checkout session route with environment variable gating.</div>
              <div>4. Client-side free daily usage counter for quick MVP testing.</div>
              <div>5. Clean deploy target for Vercel.</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">ReplyMax MVP. Ship this, test traffic, then decide whether to deepen the product.</div>
      </footer>
    </>
  );
}
