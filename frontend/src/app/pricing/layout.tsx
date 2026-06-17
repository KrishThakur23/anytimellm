import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | AnytimeLLM",
  description: "Simple, transparent pricing for your AI employee. Choose the perfect AnytimeLLM plan for your business and never miss a WhatsApp order again.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
