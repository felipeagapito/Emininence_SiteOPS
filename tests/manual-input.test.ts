import assert from "node:assert/strict";
import test from "node:test";
import { auditSchema } from "../app/lib/money/audit.ts";
import { leadSchema } from "../app/lib/money/lead.ts";
import {
  buildManualArtifacts,
  buildManualAudit,
  buildManualLead,
  type ManualAuditInput,
  type ManualLeadInput,
} from "../app/lib/money/manual-input.ts";

const FIXED_NOW = "2026-07-31T10:00:00.000Z";

const leadInput: ManualLeadInput = {
  businessName: "Padaria Estrela",
  category: "Padaria e confeitaria",
  city: "Joinville",
  state: "SC",
  phone: "(47) 98888-1111",
  whatsapp: "+5547988881111",
  email: "contato@padariaestrela.com.br",
  websiteUrl: "https://padariaestrela.com.br",
  googleMapsUrl: "https://maps.google.com/?q=padaria+estrela",
  notes: "Site existe, mas WhatsApp nao esta visivel.",
};

const auditInput: ManualAuditInput = {
  websiteExists: true,
  hasWhatsapp: false,
  hasPrimaryCta: false,
  hasContactForm: false,
  hasBookingOrSchedule: false,
  hasSocialProof: false,
  hasLocalSeoSignals: false,
  hasGoogleMapsEmbed: false,
  performanceScore: "30",
  accessibilityScore: "55",
  seoScore: "40",
  bestPracticesScore: "",
  mobileUsabilityNotes: "Menu escondido no mobile.",
};

// ---------------------------------------------------------------------------
// buildManualLead
// ---------------------------------------------------------------------------

test("buildManualLead validates against leadSchema with source manual", () => {
  const lead = buildManualLead(leadInput, FIXED_NOW);
  const parsed = leadSchema.parse(lead);
  assert.equal(parsed.businessName, "Padaria Estrela");
  assert.equal(parsed.source, "manual");
  assert.equal(parsed.status, "needs_audit");
  assert.equal(parsed.country, "BR");
});

test("buildManualLead omits empty optional fields", () => {
  const lead = buildManualLead(
    { ...leadInput, phone: "  ", whatsapp: "", email: "", notes: "  " },
    FIXED_NOW,
  );
  assert.equal(lead.phone, undefined);
  assert.equal(lead.whatsapp, undefined);
  assert.equal(lead.email, undefined);
  assert.equal(lead.notes, undefined);
});

test("buildManualLead throws on missing business name", () => {
  assert.throws(() => buildManualLead({ ...leadInput, businessName: " " }, FIXED_NOW));
});

// ---------------------------------------------------------------------------
// buildManualAudit
// ---------------------------------------------------------------------------

test("buildManualAudit validates against auditSchema as manual mode", () => {
  const audit = buildManualAudit(auditInput, "lead_abc", FIXED_NOW);
  const parsed = auditSchema.parse(audit);
  assert.equal(parsed.auditMode, "manual");
  assert.equal(parsed.leadId, "lead_abc");
  assert.equal(parsed.websiteExists, true);
  assert.equal(parsed.hasWhatsapp, false);
});

test("empty Lighthouse score input becomes null", () => {
  const audit = buildManualAudit(auditInput, "lead_abc", FIXED_NOW);
  assert.equal(audit.performanceScore, 30);
  assert.equal(audit.accessibilityScore, 55);
  assert.equal(audit.seoScore, 40);
  assert.equal(audit.bestPracticesScore, null);
});

test("out-of-range Lighthouse score is clamped to 0..100", () => {
  const audit = buildManualAudit(
    {
      ...auditInput,
      performanceScore: "150",
      accessibilityScore: "-5",
      seoScore: "abc",
    },
    "lead_abc",
    FIXED_NOW,
  );
  assert.equal(audit.performanceScore, 100);
  assert.equal(audit.accessibilityScore, 0);
  assert.equal(audit.seoScore, null);
});

// ---------------------------------------------------------------------------
// buildManualArtifacts — determinism and shape
// ---------------------------------------------------------------------------

test("buildManualArtifacts is deterministic for the same inputs", () => {
  const a = buildManualArtifacts(leadInput, auditInput, FIXED_NOW);
  const b = buildManualArtifacts(leadInput, auditInput, FIXED_NOW);
  assert.deepEqual(a, b);
});

test("artifacts are well-formed and carry the business name", () => {
  const { briefingJson, proposalMd, siteBuildPromptMd, score, briefing } =
    buildManualArtifacts(leadInput, auditInput, FIXED_NOW);

  const briefingObj = JSON.parse(briefingJson);
  assert.equal(briefingObj.project.name, "Landing page para Padaria Estrela");
  assert.equal(briefing.business.name, "Padaria Estrela");
  assert.ok(briefingObj.sitePlan.seoKeywords.includes("Padaria e confeitaria em Joinville"));

  assert.ok(proposalMd.startsWith("# Proposta comercial para Padaria Estrela"));
  assert.ok(proposalMd.includes("## Plano de site recomendado"));

  assert.ok(siteBuildPromptMd.startsWith("# Site build prompt para Padaria Estrela"));
  assert.ok(siteBuildPromptMd.includes("## Aprovacao humana"));

  assert.ok(score.overall >= 0 && score.overall <= 100);
});

test("missing contact data surfaces as missing assets, never invented", () => {
  const { briefingJson } = buildManualArtifacts(
    {
      ...leadInput,
      email: "",
      whatsapp: "",
      googleMapsUrl: "",
      websiteUrl: "",
    },
    { ...auditInput, hasSocialProof: false },
    FIXED_NOW,
  );
  assert.ok(briefingJson.includes("Email de contato"));
  assert.ok(briefingJson.includes("Link do Google Maps / endereco do negocio"));
  assert.ok(briefingJson.includes("Depoimentos reais de clientes"));
});

test("strong audit scores higher than a weak audit", () => {
  const weak = buildManualArtifacts(leadInput, auditInput, FIXED_NOW);
  const strong = buildManualArtifacts(
    leadInput,
    {
      ...auditInput,
      hasWhatsapp: true,
      hasPrimaryCta: true,
      hasContactForm: true,
      hasBookingOrSchedule: true,
      hasSocialProof: true,
      hasLocalSeoSignals: true,
      hasGoogleMapsEmbed: true,
      performanceScore: "95",
      accessibilityScore: "92",
      seoScore: "90",
      bestPracticesScore: "94",
    },
    FIXED_NOW,
  );
  assert.ok(strong.score.overall > weak.score.overall);
  assert.equal(strong.score.conversion, 100);
});
