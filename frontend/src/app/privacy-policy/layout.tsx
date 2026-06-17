import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AnytimeLLM",
  description: "Learn how AnytimeLLM protects your data. Read our comprehensive Privacy Policy covering data collection, usage, and your privacy rights.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
