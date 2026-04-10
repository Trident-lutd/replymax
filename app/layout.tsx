import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ReplyMax",
  description: "AI-powered reply suggestions for dating and text conversations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}

        <footer className="border-t border-white/10 bg-black">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
            <div>
              ReplyMax provides AI-generated suggestions for informational and
              entertainment purposes only.
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}