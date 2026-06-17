import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | AnytimeLLM",
  description: "Create your AnytimeLLM account. Start your 30-day free trial today and automate your customer support and sales on WhatsApp.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
