import { notFound } from "next/navigation";
import { posts } from "#velite";
import { PostContent } from "@/app/components/blog/post-content";
import { PostHeader } from "@/app/components/blog/post-header";
import { TableOfContents } from "@/app/components/blog/table-of-contents";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match: RegExpExecArray | null = headingRegex.exec(content);

  while (match !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
    match = headingRegex.exec(content);
  }

  return headings;
}

export default async function PostPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug && p.published);

  if (!post) notFound();

  const headings = extractHeadings(post.raw);

  return (
    <div className="container mx-auto py-12">
      <div className="mx-auto max-w-2xl px-4">
        <article>
          <PostHeader post={post} />
          <div className="relative">
            <TableOfContents headings={headings} />
            <PostContent content={post.body} />
          </div>
        </article>
      </div>
    </div>
  );
}
