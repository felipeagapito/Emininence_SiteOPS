import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeUrl,
  buildUrlAuditArtifacts,
  urlAuditRequestSchema,
} from "../app/lib/money/url-audit.ts";

// ---------------------------------------------------------------------------
// normalizeUrl
// ---------------------------------------------------------------------------

test("adds https when no scheme is present", () => {
  assert.equal(normalizeUrl("example.com"), "https://example.com/");
});

test("trims whitespace and strips fragment", () => {
  assert.equal(
    normalizeUrl("  example.com/path#secao  "),
    "https://example.com/path",
  );
});

test("preserves an explicit http scheme", () => {
  assert.equal(normalizeUrl("http://example.com"), "http://example.com/");
});

test("rejects empty input", () => {
  assert.throws(() => normalizeUrl("  "), /URL vazia/);
});

test("rejects non-http(s) protocols", () => {
  assert.throws(() => normalizeUrl("ftp://example.com"), /Protocolo nao suportado/);
  assert.throws(() => normalizeUrl("javascript:alert(1)"), /Protocolo nao suportado/);
});

test("rejects malformed urls", () => {
  assert.throws(() => normalizeUrl("not a url"));
});

// ---------------------------------------------------------------------------
// urlAuditRequestSchema — loose string, real validation at normalizeUrl
// ---------------------------------------------------------------------------

test("schema accepts a scheme-less url", () => {
  const parsed = urlAuditRequestSchema.safeParse({ url: "example.com" });
  assert.equal(parsed.success, true);
});

test("schema requires nothing at minimum", () => {
  const parsed = urlAuditRequestSchema.safeParse({});
  assert.equal(parsed.success, true);
});

// ---------------------------------------------------------------------------
// buildUrlAuditArtifacts — HTML fixture
// ---------------------------------------------------------------------------

const GOOD_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Calhas Silva — calhas e rufos em Joinville SC" />
  <link rel="canonical" href="https://calhassilva.com.br/" />
  <title>Calhas Silva — Calhas em Joinville</title>
  <meta name="generator" content="WordPress" />
</head>
<body>
  <h1>Calhas e rufos em Joinville</h1>
  <img src="banner.jpg" alt="Calhas instaladas" />
  <a href="https://wa.me/5547999990000">Chamar no WhatsApp</a>
  <a href="tel:+554733332222">(47) 3333-2222</a>
  <a href="/servicos">Servicos</a>
  <button>Solicitar orcamento</button>
  <form action="/enviar"><input name="nome" /></form>
  <p>Depoimento: cliente satisfeito com a instalacao das calhas.</p>
</body>
</html>`;

test("produces the full typed report with six categories", () => {
  const artifacts = buildUrlAuditArtifacts(
    { businessName: "Calhas Silva", city: "Joinville", state: "SC" },
    GOOD_HTML,
    "https://calhassilva.com.br/",
    "2026-08-01T00:00:00.000Z",
  );

  assert.ok(artifacts.report, "report is present");
  assert.equal(artifacts.report.url, "https://calhassilva.com.br/");
  assert.equal(artifacts.report.categories.length, 6);
  assert.ok(
    artifacts.report.overall >= 0 && artifacts.report.overall <= 100,
  );

  const evidence = artifacts.evidence;
  const byKey = (key: string) => evidence.find((e) => e.key === key);

  // Extracted signals surface as evidence
  assert.equal(byKey("whatsapp")?.status, "yes");
  assert.equal(byKey("cta")?.status, "yes");
  assert.equal(byKey("contactForm")?.status, "yes");
  assert.equal(byKey("h1")?.status, "yes");
  assert.equal(byKey("viewport")?.status, "yes");
  assert.equal(byKey("canonical")?.status, "yes");
  assert.equal(byKey("imagesAlt")?.status, "yes");
  assert.equal(byKey("https")?.status, "yes");
  // WordPress generator -> partial stack
  assert.equal(byKey("techStack")?.status, "partial");
});

test("commercial categories score well on a strong site", () => {
  const artifacts = buildUrlAuditArtifacts(
    {},
    GOOD_HTML,
    "https://calhassilva.com.br/",
    "2026-08-01T00:00:00.000Z",
  );
  const conversion = artifacts.report.categories.find(
    (c) => c.category === "conversion",
  );
  const seo = artifacts.report.categories.find((c) => c.category === "seo");
  assert.ok(conversion && seo);
  assert.ok(conversion.score >= 60, `conversion ${conversion.score}`);
  assert.ok(seo.score >= 60, `seo ${seo.score}`);
});

test("lead carries the URL source and website url", () => {
  const artifacts = buildUrlAuditArtifacts(
    {},
    GOOD_HTML,
    "https://calhassilva.com.br/",
    "2026-08-01T00:00:00.000Z",
  );
  assert.equal(artifacts.lead.websiteUrl, "https://calhassilva.com.br/");
  assert.equal(artifacts.lead.businessName, "Calhas Silva — Calhas em Joinville");
});

test("handles a near-empty HTML payload gracefully", () => {
  const artifacts = buildUrlAuditArtifacts(
    {},
    "<html><head></head><body></body></html>",
    "https://vazio.com/",
    "2026-08-01T00:00:00.000Z",
  );
  assert.equal(artifacts.report.categories.length, 6);
  assert.ok(artifacts.lead.businessName.length > 0);
});
