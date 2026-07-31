import assert from "node:assert/strict";
import test from "node:test";
import { leadSchema, mockLead } from "../app/lib/money/lead.ts";
import { auditSchema, mockAudit } from "../app/lib/money/audit.ts";
import { computeCommercialScore, mockAuditForScoring } from "../app/lib/money/score.ts";

// ---------------------------------------------------------------------------
// Lead
// ---------------------------------------------------------------------------

test("mockLead validates against leadSchema", () => {
  const parsed = leadSchema.parse(mockLead);
  assert.equal(parsed.id, "lead_001");
  assert.equal(parsed.status, "needs_audit");
});

test("rejects a lead missing required fields", () => {
  const result = leadSchema.safeParse({ id: "x" });
  assert.equal(result.success, false);
});

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

test("mockAudit validates against auditSchema", () => {
  const parsed = auditSchema.parse(mockAudit);
  assert.equal(parsed.auditMode, "mock");
  assert.equal(parsed.websiteExists, true);
  assert.equal(parsed.hasWhatsapp, false);
});

test("accepts null Lighthouse scores", () => {
  const raw = { ...mockAudit, performanceScore: null };
  const parsed = auditSchema.parse(raw);
  assert.equal(parsed.performanceScore, null);
});

// ---------------------------------------------------------------------------
// Scoring — determinism
// ---------------------------------------------------------------------------

test("computeCommercialScore is deterministic", () => {
  const a = computeCommercialScore(mockAuditForScoring);
  const b = computeCommercialScore(mockAuditForScoring);
  assert.deepEqual(a, b);
});

test("overall is in 0..100", () => {
  const result = computeCommercialScore(mockAuditForScoring);
  assert.ok(result.overall >= 0 && result.overall <= 100);
});

test("priorityLabel matches overall thresholds", () => {
  const result = computeCommercialScore(mockAuditForScoring);
  const { overall, priorityLabel } = result;
  if (overall >= 80) assert.equal(priorityLabel, "urgent");
  else if (overall >= 65) assert.equal(priorityLabel, "high");
  else if (overall >= 45) assert.equal(priorityLabel, "medium");
  else assert.equal(priorityLabel, "low");
});

// ---------------------------------------------------------------------------
// Scoring — mock scenario: site exists but poor
// ---------------------------------------------------------------------------

test("mockAudit scores low for a site with no conversion signals", () => {
  const result = computeCommercialScore(mockAuditForScoring);
  // Site exists but no WhatsApp, no CTA, no form, poor performance.
  assert.ok(result.digitalPresence > 0, "digitalPresence > 0");
  assert.ok(result.conversion === 0, "conversion is 0 (no CTA signals)");
  assert.ok(result.urgency >= 55, "urgency high when CTA/WhatsApp missing");
});

// ---------------------------------------------------------------------------
// Scoring — no website scenario
// ---------------------------------------------------------------------------

test("no website → urgency=90, low digitalPresence", () => {
  const noSite = {
    ...mockAuditForScoring,
    websiteExists: false,
    performanceScore: null,
    seoScore: null,
    bestPracticesScore: null,
  };
  const result = computeCommercialScore(noSite);
  assert.equal(result.urgency, 90);
  assert.ok(result.digitalPresence <= 20, "digitalPresence low without site");
});

// ---------------------------------------------------------------------------
// Scoring — high-opportunity scenario
// ---------------------------------------------------------------------------

test("full conversion signals push conversion to 100", () => {
  const full = {
    ...mockAuditForScoring,
    hasWhatsapp: true,
    hasPrimaryCta: true,
    hasContactForm: true,
    hasBookingOrSchedule: true,
    hasSocialProof: true,
    hasLocalSeoSignals: true,
    hasGoogleMapsEmbed: true,
    performanceScore: 95,
  };
  const result = computeCommercialScore(full);
  assert.equal(result.conversion, 100);
  assert.ok(result.overall > 50, "overall > 50 for strong lead");
});

// ---------------------------------------------------------------------------
// scoreExplanation
// ---------------------------------------------------------------------------

test("scoreExplanation includes all dimensions", () => {
  const result = computeCommercialScore(mockAuditForScoring);
  assert.ok(result.scoreExplanation.includes("Overall:"));
  assert.ok(result.scoreExplanation.includes("Digital presence:"));
  assert.ok(result.scoreExplanation.includes("Performance:"));
  assert.ok(result.scoreExplanation.includes("Local SEO:"));
  assert.ok(result.scoreExplanation.includes("Conversion:"));
  assert.ok(result.scoreExplanation.includes("Trust:"));
  assert.ok(result.scoreExplanation.includes("Sales urgency:"));
});
