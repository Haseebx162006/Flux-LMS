import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLUX — Digital Experiences & Skill Platform",
  description: "A premium modern LMS designed for high-impact digital learning and skill mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-canvas text-[#121212]">
        {children}
      </body>
    </html>
  );
}
