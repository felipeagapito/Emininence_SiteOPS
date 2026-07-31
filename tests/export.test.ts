import assert from "node:assert/strict";
import test from "node:test";
import { mockBriefing } from "../app/lib/money/briefing.ts";
import { mockProposal, renderProposalMarkdown } from "../app/lib/money/proposal.ts";
import {
  generateProposalMarkdown,
  serializeBriefing,
} from "../app/lib/money/export.ts";

// ---------------------------------------------------------------------------
// serializeBriefing
// ---------------------------------------------------------------------------

test("serializeBriefing round-trips back to the same briefing", () => {
  const json = serializeBriefing(mockBriefing);
  const parsed = JSON.parse(json);
  assert.deepEqual(parsed, mockBriefing);
});

test("serializeBriefing is deterministic", () => {
  assert.equal(serializeBriefing(mockBriefing), serializeBriefing(mockBriefing));
});

test("serializeBriefing outputs pretty-printed JSON", () => {
  const json = serializeBriefing(mockBriefing);
  assert.ok(json.startsWith("{\n"));
  assert.ok(json.includes("\n  \"project\""));
  assert.ok(json.includes("\n  \"acceptanceCriteria\""));
});

test("serializeBriefing omits absent optional fields (no invented data)", () => {
  const json = serializeBriefing(mockBriefing);
  assert.ok(!json.includes("\"email\""));
  assert.ok(!json.includes("\"googleMapsUrl\""));
  assert.ok(json.includes("\"whatsapp\""));
});

// ---------------------------------------------------------------------------
// generateProposalMarkdown
// ---------------------------------------------------------------------------

test("generateProposalMarkdown chains briefing into a full proposal", () => {
  const md = generateProposalMarkdown(mockBriefing);
  assert.ok(md.startsWith("# Proposta comercial para Calhas Silva"));
  assert.ok(md.includes("## Resumo do negocio"));
  assert.ok(md.includes("## Prioridade comercial"));
  assert.ok(md.includes("## Principais problemas"));
  assert.ok(md.includes("## Riscos comerciais"));
  assert.ok(md.includes("## Oportunidades"));
  assert.ok(md.includes("## Plano de site recomendado"));
  assert.ok(md.includes("## Assets ausentes"));
  assert.ok(md.includes("## Assets obrigatorios"));
  assert.ok(md.includes("## Criterios de aceite"));
});

test("generateProposalMarkdown is deterministic", () => {
  const a = generateProposalMarkdown(mockBriefing);
  const b = generateProposalMarkdown(mockBriefing);
  assert.equal(a, b);
});

test("generateProposalMarkdown output carries the human approval notice", () => {
  const md = generateProposalMarkdown(mockBriefing);
  assert.ok(md.includes("Requer aprovacao humana antes de gerar ou publicar"));
});

test("generateProposalMarkdown output matches renderProposalMarkdown(mockProposal)", () => {
  const fromBriefing = generateProposalMarkdown(mockBriefing);
  const fromMock = renderProposalMarkdown(mockProposal);
  assert.equal(fromBriefing, fromMock);
});
