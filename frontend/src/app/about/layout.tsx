import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | AnytimeLLM",
  description: "Learn about AnytimeLLM's mission to solve the 24/7 responsiveness problem for local businesses using AI-powered WhatsApp automation.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
