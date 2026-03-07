import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug("blog"),
    description: s.string().max(300),
    date: s.isodate(),
    published: s.boolean().default(true),
    author: s.object({
      name: s.string(),
      url: s.string().optional(),
    }),
    tags: s.array(s.string()).default([]),
    raw: s.raw(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
    remarkPlugins: [],
  },
});
