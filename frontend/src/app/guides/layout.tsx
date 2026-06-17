import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides & Tutorials | AnytimeLLM",
  description: "Comprehensive guides to help you set up and master AnytimeLLM. Learn how to automate your WhatsApp sales and streamline customer support.",
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
