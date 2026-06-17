import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AnytimeLLM",
  description: "Log in to your AnytimeLLM command center to manage your AI assistant, track conversations, and view orders.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
