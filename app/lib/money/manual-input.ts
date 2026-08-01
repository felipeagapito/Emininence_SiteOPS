import type { Lead } from "./lead.ts";
import { leadSchema } from "./lead.ts";
import type { Audit } from "./audit.ts";
import { auditSchema } from "./audit.ts";
import { computeCommercialScore } from "./score.ts";
import type { ScoringInput } from "./score.ts";
import { computeDualScore } from "./score.ts";
import type { DualScore } from "./score.ts";
import { auditToEvidence } from "./evidence.ts";
import type { Briefing } from "./briefing.ts";
import { generateBriefing } from "./briefing-generator.ts";
import {
  generateProposalMarkdown,
  generateSiteBuildPrompt,
  serializeBriefing,
} from "./export.ts";

// ---------------------------------------------------------------------------
// Manual entry — raw form values from the browser. Nothing is persisted:
// the pipeline builds a Lead + Audit in memory, validates them with the
// existing schemas and derives the three artifacts deterministically.
// ---------------------------------------------------------------------------

/** Raw Lead fields from the manual form (empty strings become optional fields). */
export type ManualLeadInput = {
  businessName: string;
  category: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
  websiteUrl: string;
  googleMapsUrl: string;
  notes: string;
};

/** Raw Audit fields from the manual form (scores are strings; empty → null). */
export type ManualAuditInput = {
  websiteExists: boolean;
  hasWhatsapp: boolean;
  hasPrimaryCta: boolean;
  hasContactForm: boolean;
  hasBookingOrSchedule: boolean;
  hasSocialProof: boolean;
  hasLocalSeoSignals: boolean;
  hasGoogleMapsEmbed: boolean;
  performanceScore: string;
  accessibilityScore: string;
  seoScore: string;
  bestPracticesScore: string;
  mobileUsabilityNotes: string;
};

/** Maps an empty string to `undefined` so optional Lead fields stay absent. */
function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** Parses a Lighthouse score input, clamping to 0..100; empty/invalid → null. */
function scoreOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

/**
 * Builds an entity ID from a millisecond-precision timestamp. The ID stays a
 * pure function of `now` so the pipeline remains deterministic: the same input
 * at the same instant reproduces the same artifacts. The old `slice(0, 14)`
 * truncated to seconds, so two submissions inside one second collided; keeping
 * the full digits preserves the milliseconds and keeps those apart.
 */
function timestampId(prefix: string, now: string): string {
  return `${prefix}_${now.replace(/\D/g, "")}`;
}

/** Builds a validated `Lead` from the manual form. Throws if invalid. */
export function buildManualLead(
  input: ManualLeadInput,
  now: string = new Date().toISOString(),
): Lead {
  return leadSchema.parse({
    id: timestampId("lead", now),
    businessName: input.businessName.trim(),
    category: input.category.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    country: "BR",
    phone: optional(input.phone),
    whatsapp: optional(input.whatsapp),
    email: optional(input.email),
    websiteUrl: optional(input.websiteUrl),
    googleMapsUrl: optional(input.googleMapsUrl),
    source: "manual",
    status: "needs_audit",
    notes: optional(input.notes),
    createdAt: now,
    updatedAt: now,
  });
}

/** Builds a validated `Audit` from the manual form. Throws if invalid. */
export function buildManualAudit(
  input: ManualAuditInput,
  leadId: string,
  now: string = new Date().toISOString(),
): Audit {
  return auditSchema.parse({
    id: timestampId("audit", now),
    leadId,
    auditMode: "manual",
    websiteExists: input.websiteExists,
    hasWhatsapp: input.hasWhatsapp,
    hasPrimaryCta: input.hasPrimaryCta,
    hasContactForm: input.hasContactForm,
    hasBookingOrSchedule: input.hasBookingOrSchedule,
    hasSocialProof: input.hasSocialProof,
    hasLocalSeoSignals: input.hasLocalSeoSignals,
    hasGoogleMapsEmbed: input.hasGoogleMapsEmbed,
    mobileUsabilityNotes: optional(input.mobileUsabilityNotes),
    performanceScore: scoreOrNull(input.performanceScore),
    accessibilityScore: scoreOrNull(input.accessibilityScore),
    seoScore: scoreOrNull(input.seoScore),
    bestPracticesScore: scoreOrNull(input.bestPracticesScore),
    createdAt: now,
  });
}

/** Maps the audited fields onto the commercial scoring input. */
function toScoringInput(audit: Audit): ScoringInput {
  return {
    websiteExists: audit.websiteExists,
    hasWhatsapp: audit.hasWhatsapp,
    hasPrimaryCta: audit.hasPrimaryCta,
    hasContactForm: audit.hasContactForm,
    hasBookingOrSchedule: audit.hasBookingOrSchedule,
    hasSocialProof: audit.hasSocialProof,
    hasLocalSeoSignals: audit.hasLocalSeoSignals,
    hasGoogleMapsEmbed: audit.hasGoogleMapsEmbed,
    performanceScore: audit.performanceScore,
    accessibilityScore: audit.accessibilityScore,
    seoScore: audit.seoScore,
    bestPracticesScore: audit.bestPracticesScore,
  };
}

export type ManualArtifacts = {
  lead: Lead;
  audit: Audit;
  score: ReturnType<typeof computeCommercialScore>;
  dualScore: DualScore;
  briefing: Briefing;
  briefingJson: string;
  proposalMd: string;
  siteBuildPromptMd: string;
};

/**
 * Runs the full local pipeline for a manual entry: Lead + Audit → score →
 * briefing → proposal → site-build prompt. Deterministic for the same inputs;
 * no I/O, no AI, no persistence.
 */
export function buildManualArtifacts(
  leadInput: ManualLeadInput,
  auditInput: ManualAuditInput,
  now: string = new Date().toISOString(),
): ManualArtifacts {
  const lead = buildManualLead(leadInput, now);
  const audit = buildManualAudit(auditInput, lead.id, now);
  const score = computeCommercialScore(toScoringInput(audit));
  const evidence = auditToEvidence(audit);
  const dualScore = computeDualScore(evidence, {
    performanceScore: audit.performanceScore,
    seoScore: audit.seoScore,
    accessibilityScore: audit.accessibilityScore,
    bestPracticesScore: audit.bestPracticesScore,
  });
  const briefing = generateBriefing(lead, audit, score);
  return {
    lead,
    audit,
    score,
    dualScore,
    briefing,
    briefingJson: serializeBriefing(briefing),
    proposalMd: generateProposalMarkdown(briefing),
    siteBuildPromptMd: generateSiteBuildPrompt(briefing),
  };
}
