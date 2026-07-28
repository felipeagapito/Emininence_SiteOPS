import { z } from "zod";

export const siteBriefSchema = z.object({
  brand: z.string().min(2).max(80),
  segment: z.string().min(2).max(120),
  objective: z.string().min(8).max(500),
  audience: z.string().min(5).max(500),
  personality: z.array(z.string().min(2).max(40)).min(1).max(5),
  references: z.string().max(500).default(""),
  proof: z.string().max(500).default(""),
  motionLevel: z.enum(["essential", "expressive", "cinematic"]),
  use3d: z.boolean(),
});

const colorSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  role: z.string(),
});

export const siteBlueprintSchema = z.object({
  concept: z.string(),
  thesis: z.string(),
  palette: z.array(colorSchema).min(3).max(6),
  typography: z.object({
    display: z.string(),
    text: z.string(),
    rationale: z.string(),
  }),
  hero: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    subhead: z.string(),
    interaction: z.string(),
  }),
  sections: z
    .array(
      z.object({
        name: z.string(),
        purpose: z.string(),
        visual: z.string(),
      }),
    )
    .min(3)
    .max(7),
  motion: z.object({
    language: z.string(),
    rules: z.array(z.string()).min(2).max(5),
  }),
  threeD: z
    .object({
      enabled: z.boolean(),
      concept: z.string(),
      fallback: z.string(),
    })
    .nullable(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  truthGuard: z.array(z.string()).min(2).max(6),
});

export type SiteBrief = z.infer<typeof siteBriefSchema>;
export type SiteBlueprint = z.infer<typeof siteBlueprintSchema>;
