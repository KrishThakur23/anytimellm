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
        {/* Importing Outfit Font for premium aesthetic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;750;900&family=Outfit:wght@300;400;500;650;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
