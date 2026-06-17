import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | AnytimeLLM",
  description: "Read the Terms of Service for using AnytimeLLM's AI and WhatsApp automation platform. Understand your rights and responsibilities.",
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
