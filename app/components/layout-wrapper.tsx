"use client";

import { Footer } from "./footer";
import { Header } from "./header";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
