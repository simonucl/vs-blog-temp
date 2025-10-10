import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      slug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      // Academic page options (optional)
      academic: z.boolean().optional(),
      authors: z
        .array(
          z.union([
            z.string(),
            z.object({ name: z.string(), aff: z.array(z.number()).optional() }),
          ])
        )
        .optional(),
      affiliations: z.array(z.string()).optional(),
      pdfUrl: z.string().optional(),
      codeUrl: z.string().optional(),
      homepageUrl: z.string().optional(),
      xThreadUrl: z.string().optional(),
      notebookUrl: z.string().optional(),
      bibUrl: z.string().optional(),
      abstract: z.string().optional(),
      showTOC: z.boolean().optional(),
    }),
});

export const collections = { blog };
