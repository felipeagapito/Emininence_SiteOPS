import { z } from "zod";

export const auditModeSchema = z.enum([
  "manual",
  "mock",
  "firecrawl",
  "lighthouse",
  "combined",
  "url",
]);

export const auditSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  auditMode: auditModeSchema,
  websiteExists: z.boolean(),
  hasWhatsapp: z.boolean(),
  hasPrimaryCta: z.boolean(),
  hasContactForm: z.boolean(),
  hasBookingOrSchedule: z.boolean(),
  hasSocialProof: z.boolean(),
  hasLocalSeoSignals: z.boolean(),
  hasGoogleMapsEmbed: z.boolean(),
  mobileUsabilityNotes: z.string().optional(),
  performanceScore: z.number().nullable(),
  accessibilityScore: z.number().nullable(),
  seoScore: z.number().nullable(),
  bestPracticesScore: z.number().nullable(),
  rawFindingsJson: z.string().optional(),
  createdAt: z.string(),
});

export type Audit = z.infer<typeof auditSchema>;

export const mockAudit: Audit = {
  id: "audit_001",
  leadId: "lead_001",
  auditMode: "mock",
  websiteExists: true,
  hasWhatsapp: false,
  hasPrimaryCta: false,
  hasContactForm: false,
  hasBookingOrSchedule: false,
  hasSocialProof: false,
  hasLocalSeoSignals: false,
  hasGoogleMapsEmbed: false,
  performanceScore: 32,
  accessibilityScore: 45,
  seoScore: 28,
  bestPracticesScore: 35,
  createdAt: "2026-07-31T10:05:00.000Z",
};
