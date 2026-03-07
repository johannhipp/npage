"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-transparent z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl flex justify-end items-center gap-3">
        <Link
          href="/blog"
          className="transition-transform duration-150 hover:scale-[1.05]"
        >
          <span className="text-black bg-transparent px-4 py-2 text-sm font-medium hover:opacity-80">
            Blog
          </span>
        </Link>
        <Link
          id="agent-platform-button"
          href="https://agentplatform.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-150 hover:scale-[1.05]"
        >
          <span className="text-black bg-transparent px-4 py-2 text-sm font-medium hover:opacity-80">
            Agent Platform
          </span>
        </Link>
      </div>
    </header>
  );
}
