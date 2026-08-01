import assert from "node:assert/strict";
import test from "node:test";
import {
  scoreCategoriesFromEvidence,
  computeOverallScore,
  buildSiteAuditReport,
  auditCategoryLabel,
  siteAuditReportSchema,
} from "../app/lib/money/scoring.ts";
import type { Evidence } from "../app/lib/money/evidence.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ev(key: string, status: Evidence["status"]): Evidence {
  return {
    key,
    label: key,
    status,
    evidence: "",
    confidence: "medium",
  };
}

const GOOD_EVIDENCE: Evidence[] = [
  ev("siteExists", "yes"),
  ev("whatsapp", "yes"),
  ev("cta", "yes"),
  ev("contactForm", "yes"),
  ev("booking", "yes"),
  ev("socialProof", "yes"),
  ev("phone", "yes"),
  ev("title", "yes"),
  ev("metaDescription", "yes"),
  ev("h1", "yes"),
  ev("canonical", "yes"),
  ev("localSeo", "yes"),
  ev("viewport", "yes"),
  ev("imagesAlt", "yes"),
  ev("technicalErrors", "no"),
  ev("bodyShort", "no"),
  ev("https", "yes"),
  ev("techStack", "yes"),
];

const BAD_EVIDENCE: Evidence[] = [
  ev("siteExists", "yes"),
  ev("whatsapp", "no"),
  ev("cta", "no"),
  ev("contactForm", "no"),
  ev("booking", "no"),
  ev("socialProof", "no"),
  ev("phone", "no"),
  ev("title", "no"),
  ev("metaDescription", "no"),
  ev("h1", "no"),
  ev("canonical", "no"),
  ev("viewport", "no"),
  ev("charset", "no"),
  ev("technicalErrors", "yes"),
  ev("bodyShort", "yes"),
  ev("https", "no"),
];

// ---------------------------------------------------------------------------
// Category count, determinism, range
// ---------------------------------------------------------------------------

test("returns all six categories in a stable order", () => {
  const categories = scoreCategoriesFromEvidence(GOOD_EVIDENCE);
  assert.deepEqual(
    categories.map((c) => c.category),
    [
      "performance",
      "seo",
      "accessibility",
      "conversion",
      "stack",
      "technicalRisk",
    ],
  );
});

test("is deterministic", () => {
  const a = scoreCategoriesFromEvidence(GOOD_EVIDENCE);
  const b = scoreCategoriesFromEvidence(GOOD_EVIDENCE);
  assert.deepEqual(a, b);
});

test("every score stays within 0..100 and has a summary", () => {
  for (const category of scoreCategoriesFromEvidence(GOOD_EVIDENCE)) {
    assert.ok(category.score >= 0 && category.score <= 100);
    assert.ok(category.summary.length > 0);
    assert.ok(category.signals.length > 0);
  }
});

// ---------------------------------------------------------------------------
// Signal-driven scores
// ---------------------------------------------------------------------------

test("rich conversion evidence produces a high conversion score", () => {
  const categories = scoreCategoriesFromEvidence(GOOD_EVIDENCE);
  const conversion = categories.find((c) => c.category === "conversion");
  assert.ok(conversion);
  assert.ok(conversion.score >= 80, `expected >= 80, got ${conversion.score}`);
  assert.ok(conversion.signals.includes("WhatsApp visivel"));
});

test("missing conversion signals produce a low conversion score", () => {
  const categories = scoreCategoriesFromEvidence(BAD_EVIDENCE);
  const conversion = categories.find((c) => c.category === "conversion");
  assert.ok(conversion);
  assert.ok(conversion.score <= 20, `expected <= 20, got ${conversion.score}`);
});

test("technical errors and insecure http drive technical risk to zero", () => {
  const categories = scoreCategoriesFromEvidence(BAD_EVIDENCE);
  const risk = categories.find((c) => c.category === "technicalRisk");
  assert.ok(risk);
  assert.equal(risk.score, 0);
  assert.match(risk.summary, /critica/);
});

test("seo reflects title/meta/h1/canonical presence", () => {
  const good = scoreCategoriesFromEvidence(GOOD_EVIDENCE).find(
    (c) => c.category === "seo",
  );
  const bad = scoreCategoriesFromEvidence(BAD_EVIDENCE).find(
    (c) => c.category === "seo",
  );
  assert.ok(good && bad);
  assert.ok(good.score > bad.score);
});

test("unknown evidence stays neutral and reports insufficiency", () => {
  const categories = scoreCategoriesFromEvidence([]);
  const conversion = categories.find((c) => c.category === "conversion");
  const stack = categories.find((c) => c.category === "stack");
  assert.ok(conversion && stack);
  assert.equal(conversion.score, 15);
  assert.ok(conversion.signals.includes("Sem dados suficientes"));
  assert.equal(stack.score, 50);
});

// ---------------------------------------------------------------------------
// Overall score
// ---------------------------------------------------------------------------

test("overall score is a weighted average in 0..100", () => {
  const good = computeOverallScore(scoreCategoriesFromEvidence(GOOD_EVIDENCE));
  const bad = computeOverallScore(scoreCategoriesFromEvidence(BAD_EVIDENCE));
  assert.ok(good >= 0 && good <= 100);
  assert.ok(bad >= 0 && bad <= 100);
  assert.ok(good >= 80, `expected good >= 80, got ${good}`);
  assert.ok(bad <= 40, `expected bad <= 40, got ${bad}`);
  assert.ok(good > bad);
});

test("empty evidence produces a mid overall", () => {
  const categories = scoreCategoriesFromEvidence([]);
  const overall = computeOverallScore(categories);
  assert.ok(overall >= 30 && overall <= 50, `got ${overall}`);
});

// ---------------------------------------------------------------------------
// Report schema
// ---------------------------------------------------------------------------

test("buildSiteAuditReport produces a schema-valid report", () => {
  const report = buildSiteAuditReport({
    url: "https://example.com/",
    fetchedAt: "2026-08-01T00:00:00.000Z",
    evidence: GOOD_EVIDENCE,
  });
  const parsed = siteAuditReportSchema.safeParse(report);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.categories.length, 6);
  assert.equal(report.url, "https://example.com/");
});

test("labels map each category to Portuguese", () => {
  assert.equal(auditCategoryLabel("performance"), "Performance");
  assert.equal(auditCategoryLabel("technicalRisk"), "Saude tecnica");
});
