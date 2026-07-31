import { z } from "zod";

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

  const priorityLabel: PriorityLabel =
    overall >= 80
      ? "urgent"
      : overall >= 65
        ? "high"
        : overall >= 45
          ? "medium"
          : "low";

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
