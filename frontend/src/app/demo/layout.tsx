import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Demo | AnytimeLLM",
  description: "Experience your future AI employee. Try the AnytimeLLM interactive demo to see how our Business Brain handles complex customer requests instantly.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
