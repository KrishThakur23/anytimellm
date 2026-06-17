import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | AnytimeLLM",
  description: "Insights, updates, and strategies on conversational commerce, WhatsApp automation, and growing your local business with AI.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
