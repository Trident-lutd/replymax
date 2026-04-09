export default function SuccessPage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "80px 20px" }}>
      <div style={{ background: "#fff", color: "#000", borderRadius: 28, padding: 32 }}>
        <div style={{ fontSize: 42, fontWeight: 800 }}>You’re in.</div>
        <p style={{ lineHeight: 1.7, color: "#333" }}>
          Checkout succeeded. The next production step is to add a Stripe webhook and persist subscription status in your database.
        </p>
        <a href="/" style={{ color: "#000", fontWeight: 700 }}>Back to homepage</a>
      </div>
    </main>
  );
}
