export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>

        <div className="mt-8 space-y-6 text-white/75">
          <p>
            ReplyMax may process conversation text that users submit in order to
            generate message suggestions.
          </p>

          <p>
            We may also process basic technical information such as browser,
            device, page usage, and diagnostic logs to operate and improve the
            service.
          </p>

          <p>
            Payment information is handled by third-party payment providers such
            as Stripe and is not stored directly by ReplyMax unless explicitly
            stated.
          </p>

          <p>
            We do not promise permanent storage of submitted conversations in this
            MVP version. Users should avoid submitting sensitive personal,
            financial, medical, or highly confidential information.
          </p>

          <p>
            We may update this policy as the product evolves. Continued use of the
            service after updates means you accept the revised policy.
          </p>

          <p>
            This page is a simple MVP privacy baseline and should be reviewed by a
            qualified legal professional before large-scale launch.
          </p>
        </div>
      </div>
    </main>
  );
}