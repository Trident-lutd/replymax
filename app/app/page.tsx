import Link from 'next/link';

export default function AppPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#0a0a0b', color: '#f5f5f7' }}>
      <div style={{ maxWidth: 700, textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(38px, 7vw, 64px)', marginBottom: 18 }}>App route reserved</h1>
        <p style={{ color: '#a4a7b0', lineHeight: 1.8 }}>
          Keep the landing page on the homepage and move your paid app experience here once you add authentication and usage tracking on the server.
        </p>
        <div style={{ marginTop: 18 }}>
          <Link href="/" style={{ display: 'inline-block', padding: '14px 18px', borderRadius: 18, background: '#fff', color: '#000', fontWeight: 700 }}>Back to homepage</Link>
        </div>
      </div>
    </main>
  );
}
