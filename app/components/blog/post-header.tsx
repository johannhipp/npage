"use client";

import type { Post } from "#velite";

export function PostHeader({ post }: { post: Post }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mb-4 border-border border-b pb-4">
      <h1 className="mb-4 font-noto-serif font-semibold text-4xl tracking-tight">{post.title}</h1>
      {post.description && <p className="mb-4 text-muted-foreground text-xl">{post.description}</p>}
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        {post.author.url ? (
          <a
            href={post.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex w-fit cursor-pointer select-none items-center text-muted-foreground before:pointer-events-none before:absolute before:top-[1.2em] before:left-0 before:h-[0.05em] before:w-full before:origin-left before:scale-x-0 before:bg-current before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[''] hover:text-foreground hover:before:origin-right hover:before:scale-x-100"
          >
            <span>{post.author.name}</span>
            <svg
              className="ml-[0.3em] size-[0.55em]"
              fill="none"
              viewBox="0 0 10 10"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : (
          <span>{post.author.name}</span>
        )}
        <span>·</span>
        <time dateTime={post.date}>{formattedDate}</time>
      </div>
    </header>
  );
}
