import assert from "node:assert/strict";
import test from "node:test";
import { mockAudit } from "../app/lib/money/audit.ts";
import { mockBriefing } from "../app/lib/money/briefing.ts";
import { generateBriefing } from "../app/lib/money/briefing-generator.ts";
import { mockLead } from "../app/lib/money/lead.ts";
import {
  computeCommercialScore,
  mockAuditForScoring,
  priorityLabelFromOverall,
} from "../app/lib/money/score.ts";
import {
  HUMAN_APPROVAL_NOTE,
  buildBusinessSummary,
  generateProposalFromBriefing,
  mockProposal,
  priorityLabelToPt,
  proposalSchema,
  renderProposalMarkdown,
} from "../app/lib/money/proposal.ts";

const mockScore = computeCommercialScore(mockAuditForScoring);
const mockBriefingFromGenerator = generateBriefing(mockLead, mockAudit, mockScore);

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

test("generateProposalFromBriefing is deterministic", () => {
  const a = generateProposalFromBriefing(mockBriefing);
  const b = generateProposalFromBriefing(mockBriefing);
  assert.deepEqual(a, b);
});

test("generated proposal validates against proposalSchema", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  const parsed = proposalSchema.parse(proposal);
  assert.equal(parsed.meta.businessName, "Calhas Silva");
});

test("mockProposal validates against proposalSchema", () => {
  const parsed = proposalSchema.parse(mockProposal);
  assert.equal(parsed.humanApprovalRequired, true);
});

test("generator output matches the mock snapshot", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.deepEqual(proposal, mockProposal);
});

test("proposal can be generated straight from the briefing generator", () => {
  const proposal = generateProposalFromBriefing(mockBriefingFromGenerator);
  assert.equal(proposalSchema.parse(proposal).meta.businessName, "Calhas Silva");
});

// ---------------------------------------------------------------------------
// Meta: priority derivation
// ---------------------------------------------------------------------------

test("priorityLabel is derived from the overall score, not carried over", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.equal(proposal.meta.priorityLabel, priorityLabelFromOverall(27));
  assert.equal(proposal.meta.overallScore, 27);
  assert.equal(proposal.meta.title, "Proposta comercial para Calhas Silva");
});

test("priority thresholds map overall to low/medium/high/urgent", () => {
  assert.equal(priorityLabelFromOverall(27), "low");
  assert.equal(priorityLabelFromOverall(50), "medium");
  assert.equal(priorityLabelFromOverall(70), "high");
  assert.equal(priorityLabelFromOverall(85), "urgent");
});

test("proposal reflects each priority threshold", () => {
  function withOverall(overall: number) {
    return {
      ...mockBriefing,
      diagnosis: {
        ...mockBriefing.diagnosis,
        score: { ...mockBriefing.diagnosis.score, overall },
      },
    };
  }
  assert.equal(generateProposalFromBriefing(withOverall(27)).meta.priorityLabel, "low");
  assert.equal(generateProposalFromBriefing(withOverall(50)).meta.priorityLabel, "medium");
  assert.equal(generateProposalFromBriefing(withOverall(70)).meta.priorityLabel, "high");
  assert.equal(generateProposalFromBriefing(withOverall(85)).meta.priorityLabel, "urgent");
});

test("priorityLabelToPt translates labels for the Portuguese document", () => {
  assert.equal(priorityLabelToPt("low"), "baixa");
  assert.equal(priorityLabelToPt("medium"), "media");
  assert.equal(priorityLabelToPt("high"), "alta");
  assert.equal(priorityLabelToPt("urgent"), "urgente");
});

// ---------------------------------------------------------------------------
// Business summary
// ---------------------------------------------------------------------------

test("businessSummary combines name, segment and location", () => {
  assert.equal(
    buildBusinessSummary(mockBriefing.business),
    "Calhas Silva atua no segmento de Telhados e calhas em Joinville/SC.",
  );
});

test("businessSummary handles missing segment or location", () => {
  const base = { name: "Loja X", category: "", city: "", state: "" };
  assert.equal(
    buildBusinessSummary({ ...base, category: "Pizzaria", city: "Curitiba", state: "PR" }),
    "Loja X atua no segmento de Pizzaria em Curitiba/PR.",
  );
  assert.equal(
    buildBusinessSummary({ ...base, city: "Curitiba", state: "PR" }),
    "Loja X atua em Curitiba/PR.",
  );
  assert.equal(
    buildBusinessSummary({ ...base, category: "Pizzaria" }),
    "Loja X atua no segmento de Pizzaria.",
  );
  assert.equal(buildBusinessSummary(base), "Loja X e um negocio local.");
});

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

test("diagnosis blocks are copied from the briefing", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.deepEqual(proposal.mainProblems, mockBriefing.diagnosis.mainProblems);
  assert.deepEqual(proposal.commercialRisks, mockBriefing.diagnosis.commercialRisks);
  assert.deepEqual(proposal.opportunities, mockBriefing.diagnosis.opportunities);
});

test("recommendedSitePlan is assembled from the briefing site plan and project", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.deepEqual(proposal.recommendedSitePlan.sections, mockBriefing.sitePlan.sections);
  assert.deepEqual(proposal.recommendedSitePlan.seoKeywords, mockBriefing.sitePlan.seoKeywords);
  assert.equal(proposal.recommendedSitePlan.primaryCta, mockBriefing.sitePlan.primaryCta);
  assert.equal(proposal.recommendedSitePlan.deliveryGoalDays, mockBriefing.project.deliveryGoalDays);
});

test("missing/required assets and acceptance criteria come from contentRules", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.deepEqual(proposal.missingAssets, mockBriefing.contentRules.missingAssets);
  assert.deepEqual(proposal.requiredAssets, mockBriefing.contentRules.mustUse);
  assert.deepEqual(proposal.acceptanceCriteria, mockBriefing.acceptanceCriteria);
});

test("human approval is always required and always stated", () => {
  const proposal = generateProposalFromBriefing(mockBriefing);
  assert.equal(proposal.humanApprovalRequired, true);
  assert.equal(proposal.humanApprovalNote, HUMAN_APPROVAL_NOTE);
});

// ---------------------------------------------------------------------------
// Markdown rendering
// ---------------------------------------------------------------------------

test("renderProposalMarkdown is deterministic", () => {
  const a = renderProposalMarkdown(mockProposal);
  const b = renderProposalMarkdown(mockProposal);
  assert.equal(a, b);
});

test("renderProposalMarkdown covers every required section", () => {
  const md = renderProposalMarkdown(mockProposal);
  assert.ok(md.includes("# Proposta comercial para Calhas Silva"));
  assert.ok(md.includes("## Resumo do negocio"));
  assert.ok(md.includes("## Prioridade comercial"));
  assert.ok(md.includes("Prioridade: baixa (nota geral 27/100)"));
  assert.ok(md.includes("## Principais problemas"));
  assert.ok(md.includes("- WhatsApp nao visivel no site"));
  assert.ok(md.includes("## Riscos comerciais"));
  assert.ok(md.includes("## Oportunidades"));
  assert.ok(md.includes("## Plano de site recomendado"));
  assert.ok(md.includes("- Objetivo: Gerar contatos via WhatsApp/formulario"));
  assert.ok(md.includes("- Secoes: hero, services, differentials, faq, contact"));
  assert.ok(md.includes("## Assets ausentes"));
  assert.ok(md.includes("- Email de contato"));
  assert.ok(md.includes("## Assets obrigatorios"));
  assert.ok(md.includes("- WhatsApp real: +5547999990000"));
  assert.ok(md.includes("## Criterios de aceite"));
  assert.ok(md.includes("- CTA acima da dobra"));
  assert.ok(md.includes(`> ${HUMAN_APPROVAL_NOTE}`));
});

test("renderProposalMarkdown renders a human-readable document", () => {
  const md = renderProposalMarkdown(mockProposal);
  // Title is the top-level heading; body is not an empty document.
  assert.ok(md.trim().length > 200);
  assert.ok(md.split("\n").length > 25);
});
