import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — AnytimeLLM",
  description: "Learn how to connect your WhatsApp Business number, sync your inventory catalog, and configure your automated answers.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
