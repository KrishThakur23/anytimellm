import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases | AnytimeLLM",
  description: "See how different industries use AnytimeLLM to automate WhatsApp sales. From e-commerce to salons and real estate, explore real use cases.",
};

export default function UseCasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
