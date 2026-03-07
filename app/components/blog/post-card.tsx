import Link from 'next/link';
import type { Post } from '#velite';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="text-sm text-muted-foreground mb-2">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h2 className="font-noto-serif text-xl font-semibold mb-2 relative inline-flex items-center before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:before:origin-right group-hover:before:scale-x-100">
        <span>{post.title}</span>
        <svg
          className="ml-[0.3em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
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
      <p className="text-muted-foreground">{post.description}</p>
    </Link>
  );
}
