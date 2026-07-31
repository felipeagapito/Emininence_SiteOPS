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
): Briefing {
  return {
    project: buildProject(lead),
    business: buildBusiness(lead),
    diagnosis: {
      mainProblems: buildMainProblems(audit),
      commercialRisks: buildCommercialRisks(audit, score),
      technicalRisks: buildTechnicalRisks(audit),
      opportunities: buildOpportunities(audit),
      score: pickScore(score),
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
      mustUse: buildMustUse(lead),
      mustNotInvent: [...MUST_NOT_INVENT],
      missingAssets: buildMissingAssets(lead, audit),
    },
    acceptanceCriteria: [...ACCEPTANCE_CRITERIA],
  };
}
