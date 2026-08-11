import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Area riservata · LIINE",
  robots: { index: false, follow: false },
};

export default function RiservatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
