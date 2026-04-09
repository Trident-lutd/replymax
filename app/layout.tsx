import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReplyMax',
  description: 'Stop getting ignored. Get better replies instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
