import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates | AnytimeLLM",
  description: "Pre-built AI templates and prompts to help you jumpstart your AnytimeLLM setup. Tailored for retail, services, e-commerce, and more.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
