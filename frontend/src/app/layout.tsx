import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnytimeLLM | Multi-Tenant AI Ingestion Platform",
  description: "Universal business AI dashboard providing multi-tenant vector RAG indexing, relational catalog queries, and WhatsApp webhook integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Importing fonts & icons for premium aesthetic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
