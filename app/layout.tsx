import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import type React from "react";
import "./globals.css";
import { LayoutWrapper } from "./components/layout-wrapper";
import { PostHogProvider } from "./components/posthog-provider";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "Johann Hipp",
  description: "Portfolio website of Johann Hipp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${notoSerif.variable}`}>
        <PostHogProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}
