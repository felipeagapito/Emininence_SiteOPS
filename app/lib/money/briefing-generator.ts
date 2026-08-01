import type { Audit } from "./audit.ts";
import type { Lead } from "./lead.ts";
import {
  ACCEPTANCE_CRITERIA,
  DELIVERY_GOAL_DAYS,
  MUST_NOT_INVENT,
  PRIMARY_CTA,
  PRIMARY_GOAL,
  PROJECT_TYPE,
  SECONDARY_CTA,
  TARGET_STACK,
  TONE,
  VISUAL_DIRECTION,
} from "./briefing.ts";
import type { Briefing, BriefingScore } from "./briefing.ts";
import type { Evidence } from "./evidence.ts";
import { statusOf } from "./evidence.ts";
import type { DualScore } from "./score.ts";

export type GenerateBriefingOptions = {
  evidence?: Evidence[];
  unconfirmedPoints?: string[];
  requiresHumanReview?: boolean;
  scores?: DualScore;
};

const MISSING_SITE_PROBLEM = "Negocio sem site proprio";
const DELIVERY_OPPORTUNITY = "Entregar landing em ate 3 dias para aproveitar a urgencia";

// ---------------------------------------------------------------------------
// Diagnosis builders
// ---------------------------------------------------------------------------

/** Problems derived from the audit — each gap becomes a deterministic finding. */
export function buildMainProblems(audit: Audit): string[] {
  if (!audit.websiteExists) return [MISSING_SITE_PROBLEM];

  const problems: string[] = [];
  if (!audit.hasWhatsapp) problems.push("WhatsApp nao visivel no site");
  if (!audit.hasPrimaryCta) problems.push("CTA principal ausente");
  if (!audit.hasContactForm) problems.push("Sem formulario de contato");
  if (!audit.hasBookingOrSchedule)
    problems.push("Sem agendamento ou solicitacao de orcamento online");
  if (!audit.hasSocialProof) problems.push("Sem prova social");
  if (!audit.hasLocalSeoSignals) problems.push("Sem sinais de SEO local");
  if (!audit.hasGoogleMapsEmbed) problems.push("Sem embed do Google Maps");
  if (audit.performanceScore !== null && audit.performanceScore < 50)
    problems.push(`Performance lenta (Lighthouse ${audit.performanceScore})`);
  if (audit.seoScore !== null && audit.seoScore < 50)
    problems.push(`SEO tecnico fraco (Lighthouse ${audit.seoScore})`);
  if (audit.accessibilityScore !== null && audit.accessibilityScore < 70)
    problems.push(`Acessibilidade abaixo do ideal (Lighthouse ${audit.accessibilityScore})`);
  return problems;
}

/** Risks tied to missing conversion structure and to the sales urgency. */
export function buildCommercialRisks(audit: Audit, score: BriefingScore): string[] {
  const risks: string[] = [];
  if (!audit.hasWhatsapp && !audit.hasPrimaryCta && !audit.hasContactForm) {
    risks.push("Sem canal de conversao estruturado: visitantes nao viram contatos");
  }
  if (!audit.hasSocialProof) {
    risks.push("Falta de prova social reduz confianca no fechamento");
  }
  if (score.urgency >= 65) {
    risks.push(
      "Urgencia alta: demanda local pode migrar para concorrentes com presenca digital melhor",
    );
  }
  return risks;
}

/** Risks about the current site's technical quality (Lighthouse only when available). */
export function buildTechnicalRisks(audit: Audit): string[] {
  if (!audit.websiteExists) return [];

  const risks: string[] = [];
  if (audit.performanceScore !== null && audit.performanceScore < 50)
    risks.push(`Performance tecnica baixa (Lighthouse Performance ${audit.performanceScore})`);
  if (audit.accessibilityScore !== null && audit.accessibilityScore < 70)
    risks.push(`Acessibilidade abaixo do alvo (Lighthouse Accessibility ${audit.accessibilityScore})`);
  if (audit.seoScore !== null && audit.seoScore < 50)
    risks.push(`SEO tecnico abaixo do alvo (Lighthouse SEO ${audit.seoScore})`);
  return risks;
}

/** Concrete next actions — one per detected gap, in a stable order. */
export function buildOpportunities(audit: Audit): string[] {
  const opportunities: string[] = [];
  if (!audit.websiteExists) {
    opportunities.push("Criar site novo com estrutura de conversao e SEO local basico");
  } else {
    if (!audit.hasWhatsapp) opportunities.push("Adicionar WhatsApp visivel para capturar contatos");
    if (!audit.hasPrimaryCta) opportunities.push("Adicionar CTA principal acima da dobra");
    if (!audit.hasContactForm) opportunities.push("Adicionar formulario de contato simples");
    if (!audit.hasBookingOrSchedule)
      opportunities.push("Adicionar solicitacao de orcamento online");
    if (!audit.hasSocialProof) opportunities.push("Coletar depoimentos reais de clientes");
    if (!audit.hasLocalSeoSignals)
      opportunities.push("Estruturar SEO local basico (cidade, telefone, maps)");
    if (!audit.hasGoogleMapsEmbed) opportunities.push("Adicionar embed do Google Maps");
  }
  opportunities.push(DELIVERY_OPPORTUNITY);
  return opportunities;
}

// ---------------------------------------------------------------------------
// Site plan builders
// ---------------------------------------------------------------------------

/**
 * Sections are included only when there is real data to back them:
 * `social_proof` requires audited social proof; `location` requires a Maps
 * embed or a Maps link from the lead.
 */
export function buildSections(audit: Audit, lead: Lead): string[] {
  const sections = ["hero", "services", "differentials"];
  if (audit.hasSocialProof) sections.push("social_proof");
  if (audit.hasGoogleMapsEmbed || lead.googleMapsUrl) sections.push("location");
  sections.push("faq", "contact");
  return sections;
}

/** Local SEO keywords derived deterministically from category + city + state. */
export function buildSeoKeywords(lead: Lead): string[] {
  const category = lead.category.trim();
  const city = lead.city.trim();
  const state = lead.state.trim();
  const keywords: string[] = [];
  if (category && city) keywords.push(`${category} em ${city}`);
  if (category && city && state) keywords.push(`${category} em ${city} ${state}`);
  if (city) keywords.push(city);
  if (city && state) keywords.push(`${city} ${state}`);
  return keywords;
}

// ---------------------------------------------------------------------------
// Content rule builders
// ---------------------------------------------------------------------------

/** Real data that the site builder must use verbatim. */
export function buildMustUse(lead: Lead): string[] {
  const mustUse: string[] = [`Nome real do negocio: ${lead.businessName}`];
  if (lead.category) mustUse.push(`Categoria: ${lead.category}`);
  if (lead.city && lead.state) mustUse.push(`Cidade/UF reais: ${lead.city}/${lead.state}`);
  if (lead.whatsapp) mustUse.push(`WhatsApp real: ${lead.whatsapp}`);
  if (lead.phone) mustUse.push(`Telefone real: ${lead.phone}`);
  if (lead.email) mustUse.push(`Email real: ${lead.email}`);
  if (lead.websiteUrl) mustUse.push(`Site atual: ${lead.websiteUrl}`);
  if (lead.googleMapsUrl) mustUse.push(`Google Maps: ${lead.googleMapsUrl}`);
  return mustUse;
}

/** Data still missing that the builder should mark as pending instead of inventing. */
export function buildMissingAssets(lead: Lead, audit: Audit): string[] {
  const missing: string[] = [];
  if (!lead.whatsapp && !lead.phone) missing.push("Numero de WhatsApp/telefone confirmado");
  if (!lead.email) missing.push("Email de contato");
  if (!lead.googleMapsUrl) missing.push("Link do Google Maps / endereco do negocio");
  if (!audit.hasSocialProof) missing.push("Depoimentos reais de clientes");
  return missing;
}

// ---------------------------------------------------------------------------
// Evidence-aware builders (used by the URL audit pipeline)
// ---------------------------------------------------------------------------

/** Problems derived from evidence statuses — only reports clear absence (no). */
export function buildEvidenceMainProblems(evidence: Evidence[]): string[] {
  if (statusOf(evidence, "siteExists") === "no") return ["Negocio sem site proprio"];
  const problems: string[] = [];
  if (statusOf(evidence, "whatsapp") === "no")
    problems.push("WhatsApp nao visivel no site");
  if (statusOf(evidence, "cta") === "no")
    problems.push("CTA principal ausente");
  if (statusOf(evidence, "contactForm") === "no")
    problems.push("Sem formulario de contato");
  if (statusOf(evidence, "booking") === "no")
    problems.push("Sem agendamento ou solicitacao de orcamento online");
  if (statusOf(evidence, "socialProof") === "no")
    problems.push("Sem prova social");
  if (statusOf(evidence, "localSeo") === "no")
    problems.push("Sem sinais de SEO local");
  if (statusOf(evidence, "googleMaps") === "no")
    problems.push("Sem link/embed do Google Maps");
  const errs = evidence.find(
    (e) => e.key === "technicalErrors" && e.status === "yes",
  );
  if (errs) problems.push(`Erros tecnicos visiveis no HTML (${errs.evidence})`);
  return problems;
}

/** Commercial risks from evidence — only flagged when multiple conversion channels are missing. */
export function buildEvidenceCommercialRisks(
  evidence: Evidence[],
): string[] {
  const risks: string[] = [];
  const noW = statusOf(evidence, "whatsapp") === "no";
  const noC = statusOf(evidence, "cta") === "no";
  const noF = statusOf(evidence, "contactForm") === "no";
  if (noW && noC && noF) {
    risks.push("Sem canal de conversao estruturado: visitantes nao viram contatos");
  }
  if (statusOf(evidence, "socialProof") === "no") {
    risks.push("Falta de prova social reduz confianca no fechamento");
  }
  if (statusOf(evidence, "technicalErrors") === "yes") {
    risks.push(
      "Erros tecnicos visiveis prejudicam a credibilidade do negocio",
    );
  }
  return risks;
}

/** Technical risks from HTML evidence (not lighthouse). */
export function buildEvidenceTechnicalRisks(evidence: Evidence[]): string[] {
  const errs = evidence.find(
    (e) => e.key === "technicalErrors" && e.status === "yes",
  );
  if (errs) return [`Erros tecnicos exibidos no HTML (${errs.evidence})`];
  return [];
}

/** Opportunities derived from evidence — partial items become improvements, not absences. */
export function buildEvidenceOpportunities(evidence: Evidence[]): string[] {
  if (statusOf(evidence, "siteExists") === "no")
    return ["Criar site novo com estrutura de conversao e SEO local basico"];

  const opportunities: string[] = [];
  const s = (key: string) => statusOf(evidence, key);

  const wa = s("whatsapp");
  if (wa === "no")
    opportunities.push("Adicionar WhatsApp visivel para capturar contatos");
  else if (wa === "partial")
    opportunities.push(
      "Tornar o WhatsApp/contato direto mais visivel no site",
    );

  const cta = s("cta");
  if (cta === "no")
    opportunities.push("Adicionar CTA principal acima da dobra");
  else if (cta === "partial")
    opportunities.push(
      "Reforcar o CTA principal e orienta-lo a conversao",
    );

  if (s("contactForm") === "no")
    opportunities.push("Adicionar formulario de contato simples");
  if (s("booking") === "no")
    opportunities.push("Adicionar solicitacao de orcamento online");

  const sp = s("socialProof");
  if (sp === "no")
    opportunities.push("Coletar depoimentos reais de clientes");
  else if (sp === "partial")
    opportunities.push(
      "Destacar prova social existente (depoimentos/avaliacoes)",
    );

  const ls = s("localSeo");
  if (ls === "no")
    opportunities.push("Estruturar SEO local basico (cidade, telefone, maps)");
  else if (ls === "partial")
    opportunities.push("Melhorar sinais de SEO local (cidade, telefone, maps)");

  if (s("googleMaps") === "no")
    opportunities.push("Adicionar link/embed do Google Maps");
  if (s("technicalErrors") === "yes")
    opportunities.push("Corrigir erros tecnicos visiveis exibidos no site");

  const il = s("internalLinks");
  if (il === "no" || il === "partial")
    opportunities.push("Melhorar navegacao interna e distribuicao de links");

  if (s("socialLinks") === "no")
    opportunities.push("Criar e vincular perfis sociais");

  opportunities.push("Entregar landing em ate 3 dias para aproveitar a urgencia");
  return opportunities;
}

/** Missing assets — only flagged when clearly absent; never for detected items. */
export function buildEvidenceMissingAssets(
  evidence: Evidence[],
  lead: { whatsapp?: string; phone?: string; email?: string; googleMapsUrl?: string },
): string[] {
  const missing: string[] = [];
  const phone = statusOf(evidence, "phone");
  const wa = statusOf(evidence, "whatsapp");
  const email = statusOf(evidence, "email");
  const addr = statusOf(evidence, "address");
  const maps = statusOf(evidence, "googleMaps");

  if (!lead.whatsapp && !lead.phone && phone === "no" && wa === "no")
    missing.push("Numero de WhatsApp/telefone confirmado");
  if (!lead.email && email === "no")
    missing.push("Email de contato");
  if (!lead.googleMapsUrl && addr === "no" && maps === "no")
    missing.push("Link do Google Maps / endereco do negocio");
  if (statusOf(evidence, "socialProof") === "no")
    missing.push("Depoimentos reais de clientes");
  return missing;
}

/** Unconfirmed points from unknown-status evidence items. */
export function buildEvidenceUnconfirmedPoints(evidence: Evidence[]): string[] {
  return evidence
    .filter((e) => e.status === "unknown")
    .map((e) => `${e.label}: ${e.evidence}`);
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

function buildProject(lead: Lead): Briefing["project"] {
  return {
    name: `Landing page para ${lead.businessName}`,
    type: PROJECT_TYPE,
    targetStack: TARGET_STACK,
    deliveryGoalDays: DELIVERY_GOAL_DAYS,
  };
}

function buildBusiness(lead: Lead): Briefing["business"] {
  const business: Briefing["business"] = {
    name: lead.businessName,
    category: lead.category,
    city: lead.city,
    state: lead.state,
  };
  if (lead.websiteUrl) business.websiteUrl = lead.websiteUrl;
  if (lead.whatsapp) business.whatsapp = lead.whatsapp;
  if (lead.email) business.email = lead.email;
  if (lead.googleMapsUrl) business.googleMapsUrl = lead.googleMapsUrl;
  return business;
}

/** Copies only the numeric dimensions — the briefing must not carry labels/explanation. */
function pickScore(score: BriefingScore): BriefingScore {
  return {
    digitalPresence: score.digitalPresence,
    performance: score.performance,
    localSeo: score.localSeo,
    conversion: score.conversion,
    trust: score.trust,
    urgency: score.urgency,
    overall: score.overall,
  };
}

/**
 * Deterministically builds the `briefing.json` artifact for Claude/Codex from
 * a qualified Lead, its Audit and the commercial Score. No randomness, no
 * external calls, no AI — the same inputs always produce the same briefing.
 */
export function generateBriefing(
  lead: Lead,
  audit: Audit,
  score: BriefingScore,
  options?: GenerateBriefingOptions,
): Briefing {
  const hasEvidence = Boolean(options?.evidence);
  const mainProblems = hasEvidence
    ? buildEvidenceMainProblems(options!.evidence!)
    : buildMainProblems(audit);
  const commercialRisks = hasEvidence
    ? buildEvidenceCommercialRisks(options!.evidence!)
    : buildCommercialRisks(audit, score);
  const technicalRisks = hasEvidence
    ? buildEvidenceTechnicalRisks(options!.evidence!)
    : buildTechnicalRisks(audit);
  const opportunities = hasEvidence
    ? buildEvidenceOpportunities(options!.evidence!)
    : buildOpportunities(audit);
  const mustUse = hasEvidence
    ? buildMustUse(lead)
    : buildMustUse(lead);
  const missingAssets = hasEvidence
    ? buildEvidenceMissingAssets(options!.evidence!, lead)
    : buildMissingAssets(lead, audit);

  return {
    project: buildProject(lead),
    business: buildBusiness(lead),
    diagnosis: {
      mainProblems,
      commercialRisks,
      technicalRisks,
      opportunities,
      score: pickScore(score),
      ...(options?.scores ? { scores: options.scores } : {}),
      ...(options?.evidence ? { evidence: options.evidence } : {}),
      ...(options?.unconfirmedPoints
        ? { unconfirmedPoints: options.unconfirmedPoints }
        : {}),
      ...(options?.requiresHumanReview
        ? { requiresHumanReview: true }
        : {}),
    },
    sitePlan: {
      primaryGoal: PRIMARY_GOAL,
      primaryCta: PRIMARY_CTA,
      secondaryCta: SECONDARY_CTA,
      sections: buildSections(audit, lead),
      seoKeywords: buildSeoKeywords(lead),
      tone: TONE,
      visualDirection: VISUAL_DIRECTION,
    },
    contentRules: {
      mustUse,
      mustNotInvent: [...MUST_NOT_INVENT],
      missingAssets,
    },
    acceptanceCriteria: [...ACCEPTANCE_CRITERIA],
  };
}
