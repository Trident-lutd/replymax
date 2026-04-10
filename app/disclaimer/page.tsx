export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Disclaimer</h1>

        <div className="mt-8 space-y-6 text-white/75">
          <p>
            ReplyMax is an AI suggestion tool. Its outputs are provided for
            informational and entertainment purposes only.
          </p>

          <p>
            The service does not provide legal, psychological, therapeutic,
            relationship, or professional advice.
          </p>

          <p>
            Users are fully responsible for reviewing, editing, and deciding
            whether to send any suggested message.
          </p>

          <p>
            ReplyMax does not guarantee improved response rates, dates,
            relationships, attraction, compatibility, or any personal outcome.
          </p>

          <p>
            Do not rely on ReplyMax for high-stakes, sensitive, illegal, or
            harmful communications.
          </p>

          <p>
            If you are under 18, do not use this service.
          </p>
        </div>
      </div>
    </main>
  );
}