// Content collections. `blog`: one Markdown file per post in src/content/blog.
// Title and meta description for each post live in src/data/seo.ts under the post's slug, like every other page.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const link = z.object({ label: z.string(), href: z.string() });

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(), // the H1
    summary: z.string(), // the lede on the post and the blurb on the index
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    related: z.array(link).default([]), // service pages the post points to
    sources: z.array(link).default([]), // where any figures in the post came from
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
