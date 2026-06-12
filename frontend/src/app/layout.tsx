import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/layout/LenisProvider";

export const metadata: Metadata = {
  title: "AnytimeLLM — Never Miss Another Customer",
  description: "AI Operating System for local businesses. Every message, order, question, and lead handled automatically across WhatsApp and the Web. Set up in 3 minutes.",
};

import GlobalAIAssistant from "@/components/ui/GlobalAIAssistant";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Startup typography — Poppins for display, Inter for body */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Material Symbols for dashboard icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LenisProvider>
          {children}
          <WhatsAppWidget />
          <GlobalAIAssistant />
        </LenisProvider>
      </body>
    </html>
  );
}
