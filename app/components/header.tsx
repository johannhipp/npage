"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-transparent">
      <div className="container mx-auto flex max-w-7xl items-center justify-end gap-3 px-4 py-4">
        <Link href="/blog" className="transition-transform duration-150 hover:scale-[1.15]">
          <span className="bg-transparent px-4 py-2 font-medium text-black text-sm hover:opacity-80">
            Blog
          </span>
        </Link>
        <Link
          id="agentos-button"
          href="https://useagentos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-150 hover:scale-[1.15]"
        >
          <span className="bg-transparent px-4 py-2 font-medium text-black text-sm hover:opacity-80">
            AgentOS
          </span>
        </Link>
      </div>
    </header>
  );
}
