import type { Metadata } from "next";
import TourProvider from "@/components/admin/tour/TourProvider";

export const metadata: Metadata = {
  title: "Area riservata · LIINE",
  robots: { index: false, follow: false },
};

export default function RiservatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TourProvider>{children}</TourProvider>;
}
