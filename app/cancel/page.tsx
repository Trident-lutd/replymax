export default function CancelPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "80px 20px" }}>
      <div style={{ border: "1px solid #232323", borderRadius: 28, padding: 32 }}>
        <div style={{ fontSize: 42, fontWeight: 800 }}>Checkout cancelled.</div>
        <p style={{ lineHeight: 1.7, color: "#bbb" }}>
          Nothing was charged. You can go back and try again any time.
        </p>
        <a href="/" style={{ color: "#fff", fontWeight: 700 }}>Back to homepage</a>
      </div>
    </main>
  );
}
