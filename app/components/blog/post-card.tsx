import Link from "next/link";
import type { Post } from "#velite";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="mb-2 text-muted-foreground text-sm">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h2 className="mb-2 font-noto-serif font-semibold text-xl">
        <span className="bg-[length:0%_0.05em] bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 ease-[cubic-bezier(0.4,_0,_0.2,_1)] [-webkit-box-decoration-break:clone] [box-decoration-break:clone] group-hover:bg-[length:100%_0.05em]">
          {post.title}
        </span>
        <svg
          className="ml-[0.3em] inline-block size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
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
      </h2>
      {post.description && <p className="text-muted-foreground">{post.description}</p>}
    </Link>
  );
}
