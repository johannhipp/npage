"use client";

import { posts } from "#velite";
import { PostCard } from "@/app/components/blog/post-card";

export default function BlogPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 font-noto-serif font-semibold text-4xl tracking-tight">Blog</h1>
      <div className="mt-8 grid gap-6">
        {publishedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
