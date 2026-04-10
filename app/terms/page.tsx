export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Terms & Conditions</h1>

        <div className="mt-8 space-y-6 text-white/75">
          <p>
            By using ReplyMax, you agree to use the service lawfully and at your
            own discretion.
          </p>

          <p>
            ReplyMax provides AI-generated text suggestions. We do not guarantee
            replies, dates, matches, compatibility, relationship outcomes, or any
            specific result.
          </p>

          <p>
            You are solely responsible for any messages you choose to send and any
            consequences that follow from using the service.
          </p>

          <p>
            You may not use ReplyMax for harassment, abuse, fraud, impersonation,
            unlawful conduct, or to generate harmful or deceptive content.
          </p>

          <p>
            We may update, suspend, or discontinue parts of the service at any
            time without notice.
          </p>

          <p>
            Paid subscriptions, if offered, renew according to the billing terms
            shown at checkout unless cancelled.
          </p>

          <p>
            These terms are provided as a simple MVP legal baseline and should be
            reviewed by a qualified legal professional before large-scale launch.
          </p>
        </div>
      </div>
    </main>
  );
}