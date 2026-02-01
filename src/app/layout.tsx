import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dark Horse - Horse Racing Game",
  description: "A strategic horse racing board game for 2-6 players",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
