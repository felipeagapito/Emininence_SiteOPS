import assert from "node:assert/strict";
import test from "node:test";
import { mockAudit } from "../app/lib/money/audit.ts";
import {
  ACCEPTANCE_CRITERIA,
  briefingSchema,
  mockBriefing,
} from "../app/lib/money/briefing.ts";
import {
  buildMainProblems,
  buildSeoKeywords,
  buildSections,
  generateBriefing,
} from "../app/lib/money/briefing-generator.ts";
import { mockLead } from "../app/lib/money/lead.ts";
import {
  computeCommercialScore,
  mockAuditForScoring,
} from "../app/lib/money/score.ts";

const mockScore = computeCommercialScore(mockAuditForScoring);

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

test("generateBriefing is deterministic", () => {
  const a = generateBriefing(mockLead, mockAudit, mockScore);
  const b = generateBriefing(mockLead, mockAudit, mockScore);
  assert.deepEqual(a, b);
});

test("generated briefing validates against briefingSchema", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  const parsed = briefingSchema.parse(briefing);
  assert.equal(parsed.project.name, "Landing page para Calhas Silva");
});

test("mockBriefing validates against briefingSchema", () => {
  const parsed = briefingSchema.parse(mockBriefing);
  assert.equal(parsed.business.name, "Calhas Silva");
});

test("generator output matches the mock snapshot", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.deepEqual(briefing, mockBriefing);
});

// ---------------------------------------------------------------------------
// Project and business blocks
// ---------------------------------------------------------------------------

test("project block follows doc06 defaults", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.equal(briefing.project.type, "local_service_landing");
  assert.equal(briefing.project.targetStack, "nextjs-typescript-tailwind");
  assert.equal(briefing.project.deliveryGoalDays, 3);
  assert.equal(briefing.project.name, "Landing page para Calhas Silva");
});

test("business block maps lead fields without inventing data", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.equal(briefing.business.name, mockLead.businessName);
  assert.equal(briefing.business.category, mockLead.category);
  assert.equal(briefing.business.city, mockLead.city);
  assert.equal(briefing.business.state, mockLead.state);
  assert.equal(briefing.business.websiteUrl, mockLead.websiteUrl);
  assert.equal(briefing.business.whatsapp, mockLead.whatsapp);
  assert.equal(briefing.business.email, undefined);
  assert.equal(briefing.business.googleMapsUrl, undefined);
});

// ---------------------------------------------------------------------------
// Score block
// ---------------------------------------------------------------------------

test("score block matches computeCommercialScore numeric dimensions", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.equal(briefing.diagnosis.score.overall, mockScore.overall);
  assert.equal(briefing.diagnosis.score.conversion, mockScore.conversion);
  assert.equal(briefing.diagnosis.score.urgency, mockScore.urgency);
  assert.equal(briefing.diagnosis.score.digitalPresence, mockScore.digitalPresence);
});

test("score block carries only the seven numeric dimensions", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  const keys = Object.keys(briefing.diagnosis.score).sort();
  assert.deepEqual(keys, [
    "conversion",
    "digitalPresence",
    "localSeo",
    "overall",
    "performance",
    "trust",
    "urgency",
  ]);
});

// ---------------------------------------------------------------------------
// Diagnosis derivation
// ---------------------------------------------------------------------------

test("mainProblems reflect each mock audit gap", () => {
  const problems = buildMainProblems(mockAudit);
  assert.ok(problems.includes("WhatsApp nao visivel no site"));
  assert.ok(problems.includes("CTA principal ausente"));
  assert.ok(problems.includes("Sem formulario de contato"));
  assert.ok(problems.includes("Sem prova social"));
  assert.ok(problems.includes("Performance lenta (Lighthouse 32)"));
  assert.ok(problems.includes("SEO tecnico fraco (Lighthouse 28)"));
});

test("no website yields a single focused problem", () => {
  const noSite = { ...mockAudit, websiteExists: false };
  assert.deepEqual(buildMainProblems(noSite), ["Negocio sem site proprio"]);
});

test("commercial risks include missing channel and high urgency", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  const risks = briefing.diagnosis.commercialRisks;
  assert.ok(
    risks.some((r) => r.startsWith("Sem canal de conversao estruturado")),
  );
  assert.ok(
    risks.some((r) => r.startsWith("Urgencia alta")),
    "urgency >= 65 adds a competitor risk",
  );
});

test("technical risks include low Lighthouse dimensions", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.deepEqual(briefing.diagnosis.technicalRisks, [
    "Performance tecnica baixa (Lighthouse Performance 32)",
    "Acessibilidade abaixo do alvo (Lighthouse Accessibility 45)",
    "SEO tecnico abaixo do alvo (Lighthouse SEO 28)",
  ]);
});

test("opportunities map one-to-one to the audited gaps", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  const opportunities = briefing.diagnosis.opportunities;
  assert.ok(opportunities.includes("Adicionar WhatsApp visivel para capturar contatos"));
  assert.ok(opportunities.includes("Adicionar CTA principal acima da dobra"));
  assert.ok(opportunities.includes("Coletar depoimentos reais de clientes"));
  assert.ok(
    opportunities.includes("Entregar landing em ate 3 dias para aproveitar a urgencia"),
  );
});

// ---------------------------------------------------------------------------
// Site plan
// ---------------------------------------------------------------------------

test("sections omit social_proof and location without real data", () => {
  assert.deepEqual(buildSections(mockAudit, mockLead), [
    "hero",
    "services",
    "differentials",
    "faq",
    "contact",
  ]);
});

test("sections include social_proof and location when real data exists", () => {
  const fullAudit = { ...mockAudit, hasSocialProof: true, hasGoogleMapsEmbed: true };
  const sections = buildSections(fullAudit, mockLead);
  assert.ok(sections.includes("social_proof"));
  assert.ok(sections.includes("location"));
});

test("location is included when the lead has a Maps link", () => {
  const leadWithMaps = { ...mockLead, googleMapsUrl: "https://maps.app.goo.gl/x" };
  const sections = buildSections(mockAudit, leadWithMaps);
  assert.ok(sections.includes("location"));
});

test("seoKeywords combine category, city and state", () => {
  assert.deepEqual(buildSeoKeywords(mockLead), [
    "Telhados e calhas em Joinville",
    "Telhados e calhas em Joinville SC",
    "Joinville",
    "Joinville SC",
  ]);
});

test("seoKeywords stay city-only when category is empty", () => {
  const lead = { ...mockLead, category: "" };
  assert.deepEqual(buildSeoKeywords(lead), ["Joinville", "Joinville SC"]);
});

// ---------------------------------------------------------------------------
// Content rules
// ---------------------------------------------------------------------------

test("contentRules list real data to use and what not to invent", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.ok(briefing.contentRules.mustUse.includes("Nome real do negocio: Calhas Silva"));
  assert.ok(briefing.contentRules.mustUse.includes("WhatsApp real: +5547999990000"));
  assert.deepEqual(briefing.contentRules.mustNotInvent, [
    "depoimentos",
    "certificacoes",
    "anos de experiencia",
    "numero de clientes",
    "garantias de resultado",
    "informacoes juridicas",
  ]);
});

test("missingAssets list the data the lead does not have yet", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.deepEqual(briefing.contentRules.missingAssets, [
    "Email de contato",
    "Link do Google Maps / endereco do negocio",
    "Depoimentos reais de clientes",
  ]);
});

test("acceptanceCriteria follows doc06", () => {
  const briefing = generateBriefing(mockLead, mockAudit, mockScore);
  assert.deepEqual(briefing.acceptanceCriteria, ACCEPTANCE_CRITERIA);
});

// ---------------------------------------------------------------------------
// No-website scenario
// ---------------------------------------------------------------------------

test("no-website lead produces a focused briefing with urgency 90", () => {
  const noSiteAudit = {
    ...mockAudit,
    websiteExists: false,
    performanceScore: null,
    accessibilityScore: null,
    seoScore: null,
    bestPracticesScore: null,
  };
  const noSiteScore = computeCommercialScore({
    ...mockAuditForScoring,
    websiteExists: false,
    performanceScore: null,
    accessibilityScore: null,
    seoScore: null,
    bestPracticesScore: null,
  });
  const briefing = generateBriefing(mockLead, noSiteAudit, noSiteScore);
  assert.deepEqual(briefing.diagnosis.mainProblems, ["Negocio sem site proprio"]);
  assert.equal(briefing.diagnosis.score.urgency, 90);
  assert.equal(briefing.diagnosis.score.overall, noSiteScore.overall);
  assert.deepEqual(briefing.diagnosis.technicalRisks, []);
});
