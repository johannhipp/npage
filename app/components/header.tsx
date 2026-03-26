"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [workOpen, setWorkOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-transparent">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="transition-transform duration-150 hover:scale-[1.05]">
          <span className="font-[family-name:var(--font-noto-serif)] font-bold text-black text-lg hover:opacity-80">
            Johann Hipp
          </span>
        </Link>
        <div className="flex items-baseline gap-3">
          <Link href="/blog" className="px-4 py-2 font-medium text-black text-sm transition-transform duration-150 hover:scale-[1.15]">
            Blog
          </Link>
          <div
            className="relative transition-transform duration-150 hover:scale-[1.15]"
            onMouseEnter={() => setWorkOpen(true)}
            onMouseLeave={() => setWorkOpen(false)}
          >
            <button className="px-4 py-2 font-medium text-black text-sm">
              Work
            </button>
            <div className="absolute left-0 right-0 h-4 top-full" />
            <div
              className={`absolute left-1/2 top-full min-w-[160px] -translate-x-1/2 py-1 transition-all duration-200 ${
                workOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
                <Link
                  href="https://useagentos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-black line-through hover:opacity-60"
                >
                  AgentOS
                </Link>
                <Link
                  href="https://agentplatform.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-black hover:opacity-60"
                >
                  Agent Platform
                </Link>
                <Link
                  href="https://opencompany.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-black hover:opacity-60"
                >
                  Open Company
                </Link>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
}
