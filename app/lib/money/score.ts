import { z } from "zod";
import type { Evidence, EvidenceStatus } from "./evidence.ts";
import { statusOf } from "./evidence.ts";

const WEIGHTS = {
  digitalPresence: 20,
  performance: 15,
  localSeo: 15,
  conversion: 25,
  trust: 15,
  urgency: 10,
} as const;

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function scoreDigitalPresence(input: ScoringInput): number {
  if (!input.websiteExists) return 15;
  let score = 35;
  if (input.hasLocalSeoSignals) score += 15;
  if (input.hasGoogleMapsEmbed) score += 15;
  if (input.seoScore !== null && input.seoScore > 60) score += 15;
  return clamp(score);
}

function scorePerformance(input: ScoringInput): number {
  if (input.performanceScore !== null) return clamp(input.performanceScore);
  return 50;
}

function scoreLocalSeo(input: ScoringInput): number {
  const signals = [input.hasLocalSeoSignals, input.hasGoogleMapsEmbed].filter(
    Boolean,
  ).length;
  return clamp(signals * 40 + (input.websiteExists ? 15 : 0));
}

function scoreConversion(input: ScoringInput): number {
  const signals = [
    input.hasWhatsapp,
    input.hasPrimaryCta,
    input.hasContactForm,
    input.hasBookingOrSchedule,
  ].filter(Boolean).length;
  return clamp((signals / 4) * 100);
}

function scoreTrust(input: ScoringInput): number {
  let score = 20;
  if (input.hasSocialProof) score += 50;
  if (input.websiteExists) score += 15;
  if (input.performanceScore !== null && input.performanceScore > 50)
    score += 10;
  return clamp(score);
}

function scoreUrgency(input: ScoringInput): number {
  if (!input.websiteExists) return 90;
  if (!input.hasWhatsapp && !input.hasPrimaryCta) return 75;
  if (!input.hasWhatsapp || !input.hasPrimaryCta) return 55;
  return 30;
}

export type ScoringInput = {
  websiteExists: boolean;
  hasWhatsapp: boolean;
  hasPrimaryCta: boolean;
  hasContactForm: boolean;
  hasBookingOrSchedule: boolean;
  hasSocialProof: boolean;
  hasLocalSeoSignals: boolean;
  hasGoogleMapsEmbed: boolean;
  performanceScore: number | null;
  accessibilityScore: number | null;
  seoScore: number | null;
  bestPracticesScore: number | null;
};

/** Mock scoring input — a site that exists but has no conversion features. */
export const mockAuditForScoring: ScoringInput = {
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
};

export const priorityLabelSchema = z.enum(["low", "medium", "high", "urgent"]);

export type PriorityLabel = z.infer<typeof priorityLabelSchema>;

/** Maps an overall score (0..100) to the commercial priority label. */
export function priorityLabelFromOverall(overall: number): PriorityLabel {
  return overall >= 80
    ? "urgent"
    : overall >= 65
      ? "high"
      : overall >= 45
        ? "medium"
        : "low";
}

export function computeCommercialScore(input: ScoringInput): {
  digitalPresence: number;
  performance: number;
  localSeo: number;
  conversion: number;
  trust: number;
  urgency: number;
  overall: number;
  priorityLabel: PriorityLabel;
  scoreExplanation: string;
} {
  const digitalPresence = scoreDigitalPresence(input);
  const performance = scorePerformance(input);
  const localSeo = scoreLocalSeo(input);
  const conversion = scoreConversion(input);
  const trust = scoreTrust(input);
  const urgency = scoreUrgency(input);

  const overall = Math.round(
    (digitalPresence * WEIGHTS.digitalPresence +
      performance * WEIGHTS.performance +
      localSeo * WEIGHTS.localSeo +
      conversion * WEIGHTS.conversion +
      trust * WEIGHTS.trust +
      urgency * WEIGHTS.urgency) /
      100,
  );

  const priorityLabel = priorityLabelFromOverall(overall);

  return {
    digitalPresence,
    performance,
    localSeo,
    conversion,
    trust,
    urgency,
    overall,
    priorityLabel,
    scoreExplanation: buildExplanation(
      digitalPresence,
      performance,
      localSeo,
      conversion,
      trust,
      urgency,
      overall,
      priorityLabel,
    ),
  };
}

export function auditToScoringInput(audit: {
  websiteExists: boolean;
  hasWhatsapp: boolean;
  hasPrimaryCta: boolean;
  hasContactForm: boolean;
  hasBookingOrSchedule: boolean;
  hasSocialProof: boolean;
  hasLocalSeoSignals: boolean;
  hasGoogleMapsEmbed: boolean;
  performanceScore: number | null;
  accessibilityScore: number | null;
  seoScore: number | null;
  bestPracticesScore: number | null;
}): ScoringInput {
  return { ...audit };
}

// ---------------------------------------------------------------------------
// Dual score — separated digital maturity vs commercial opportunity.
// `overallPriority` derives from opportunity + urgency, NOT maturity — a high
// maturity (good existing site) should not automatically push priority up.
// ---------------------------------------------------------------------------

export const dualScoreSchema = z.object({
  digitalMaturity: z.number(),
  commercialOpportunity: z.number(),
  urgency: z.number(),
  overallPriority: z.number(),
  priorityLabel: priorityLabelSchema,
});
export type DualScore = z.infer<typeof dualScoreSchema>;

export type LighthouseScores = {
  performanceScore: number | null;
  seoScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
};

/**
 * Computes the separated dual score from Evidence statuses.
 * When lighthouse scores are available (manual mode), they are factored into
 * digital maturity to reflect real performance quality.
 */
export function computeDualScore(
  evidence: Evidence[],
  lighthouse?: LighthouseScores,
): DualScore {
  const s = (key: string): EvidenceStatus => statusOf(evidence, key);
  const has = (key: string) => s(key) === "yes";
  const no = (key: string) => s(key) === "no";
  const siteExists = has("siteExists");

  if (!siteExists) {
    return {
      digitalMaturity: 10,
      commercialOpportunity: 80,
      urgency: 90,
      overallPriority: 84,
      priorityLabel: "urgent",
    };
  }

  // ── Digital maturity (quality of the current site) ──────────────────
  let maturity = 25;
  if (has("title")) maturity += 5;
  if (s("metaDescription") === "yes") maturity += 5;
  if (has("phone")) maturity += 5;
  if (has("email")) maturity += 5;
  if (has("whatsapp")) maturity += 5;
  if (has("address")) maturity += 5;
  if (has("contactForm")) maturity += 8;
  if (has("booking")) maturity += 6;
  if (has("socialProof")) maturity += 8;
  if (has("socialLinks")) maturity += 3;
  const il = evidence.find((e) => e.key === "internalLinks");
  const internalCount = il
    ? parseInt((il.evidence.match(/(\d+) links?/)?.[1] ?? "0"), 10)
    : 0;
  if (internalCount >= 3) maturity += 5;
  if (lighthouse?.performanceScore !== null && lighthouse?.performanceScore !== undefined)
    maturity += Math.round(lighthouse.performanceScore / 10);
  if (has("technicalErrors")) maturity -= 25;

  // ── Commercial opportunity (sellable gaps) ──────────────────────────
  let opportunity = 28;
  if (has("technicalErrors")) opportunity += 10;
  if (no("whatsapp")) opportunity += 6;
  if (no("cta")) opportunity += 5;
  if (no("contactForm")) opportunity += 8;
  if (no("booking")) opportunity += 5;
  if (no("socialProof")) opportunity += 4;
  if (no("localSeo")) opportunity += 4;
  if (no("googleMaps")) opportunity += 3;
  if (s("metaDescription") === "partial") opportunity += 2;
  if (internalCount > 0 && internalCount < 3) opportunity += 1;

  // ── Urgency (how time-sensitive the sale is) ────────────────────────
  let urgency = 35;
  if (no("whatsapp")) urgency += 6;
  if (no("cta")) urgency += 5;
  if (no("contactForm")) urgency += 6;
  if (has("technicalErrors")) urgency += 6;
  if (no("socialProof")) urgency += 3;
  if (no("localSeo")) urgency += 3;
  if (no("booking")) urgency += 3;
  if (no("whatsapp") && no("cta") && no("contactForm")) urgency += 10;

  // ── Overall priority: opportunity + urgency, NOT maturity ───────────
  const overallPriority = Math.round(
    0.6 * clamp(opportunity) + 0.4 * clamp(urgency),
  );

  return {
    digitalMaturity: clamp(maturity),
    commercialOpportunity: clamp(opportunity),
    urgency: clamp(urgency),
    overallPriority: clamp(overallPriority),
    priorityLabel: priorityLabelFromOverall(clamp(overallPriority)),
  };
}

function buildExplanation(
  digitalPresence: number,
  performance: number,
  localSeo: number,
  conversion: number,
  trust: number,
  urgency: number,
  overall: number,
  priorityLabel: PriorityLabel,
): string {
  return [
    `Overall: ${overall}/100 (${priorityLabel}).`,
    `Digital presence: ${digitalPresence}/100.`,
    `Performance: ${performance}/100.`,
    `Local SEO: ${localSeo}/100.`,
    `Conversion: ${conversion}/100.`,
    `Trust: ${trust}/100.`,
    `Sales urgency: ${urgency}/100.`,
  ].join(" ");
}
