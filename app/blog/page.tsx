'use client';

import { posts } from '#velite';
import { PostCard } from '@/app/components/blog/post-card';

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-noto-serif text-4xl font-semibold tracking-tight mb-2">
        Blog
      </h1>
      <div className="grid gap-6 mt-8">
        {publishedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
