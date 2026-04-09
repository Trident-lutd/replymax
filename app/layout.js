export const metadata = {
  title: "ReplyMax",
  description: "Stop getting ignored. Get better replies instantly."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif", background: "#0a0a0a", color: "#fafafa" }}>
        {children}
      </body>
    </html>
  );
}
