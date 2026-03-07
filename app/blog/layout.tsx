import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Johann Hipp",
    default: "Blog | Johann Hipp",
  },
  description: "Technical writing by Johann Hipp.",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen pt-20">{children}</main>;
}
