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
            className="group inline-flex w-fit cursor-pointer select-none items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="bg-[length:0%_0.05em] bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 ease-[cubic-bezier(0.4,_0,_0.2,_1)] [-webkit-box-decoration-break:clone] [box-decoration-break:clone] group-hover:bg-[length:100%_0.05em]">
              {post.author.name}
            </span>
            <svg
              className="ml-[0.3em] inline-block size-[0.55em] shrink-0"
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
