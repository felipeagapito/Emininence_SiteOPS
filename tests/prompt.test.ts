import assert from "node:assert/strict";
import test from "node:test";
import { mockAudit } from "../app/lib/money/audit.ts";
import { mockBriefing } from "../app/lib/money/briefing.ts";
import { generateBriefing } from "../app/lib/money/briefing-generator.ts";
import { mockLead } from "../app/lib/money/lead.ts";
import { generateSiteBuildPrompt } from "../app/lib/money/prompt.ts";
import {
  computeCommercialScore,
  mockAuditForScoring,
} from "../app/lib/money/score.ts";

const mockScore = computeCommercialScore(mockAuditForScoring);
const mockBriefingFromGenerator = generateBriefing(mockLead, mockAudit, mockScore);
const mockPromptMd = generateSiteBuildPrompt(mockBriefing);

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

test("generateSiteBuildPrompt is deterministic", () => {
  const a = generateSiteBuildPrompt(mockBriefing);
  const b = generateSiteBuildPrompt(mockBriefing);
  assert.equal(a, b);
});

// ---------------------------------------------------------------------------
// Required sections
// ---------------------------------------------------------------------------

test("generateSiteBuildPrompt covers every required section", () => {
  for (const heading of [
    "## Contexto do negocio",
    "## Diagnostico resumido",
    "## Prioridade comercial",
    "## Plano recomendado da landing/site",
    "## Secoes obrigatorias",
    "## Assets disponiveis",
    "## Assets ausentes",
    "## Regras de nao inventar dados",
    "## Criterios de aceite",
    "## Aprovacao humana",
    "## Instrucao para gerar o site",
  ]) {
    assert.ok(mockPromptMd.includes(heading), `missing heading: ${heading}`);
  }
});

// ---------------------------------------------------------------------------
// Business context and priority
// ---------------------------------------------------------------------------

test("prompt carries the business context with real data", () => {
  assert.ok(mockPromptMd.includes("# Site build prompt para Calhas Silva"));
  assert.ok(
    mockPromptMd.includes(
      "Calhas Silva atua no segmento de Telhados e calhas em Joinville/SC.",
    ),
  );
});

test("prompt derives the commercial priority from the overall score", () => {
  assert.ok(mockPromptMd.includes("Prioridade: baixa (nota geral 27/100)"));
  const urgent = {
    ...mockBriefing,
    diagnosis: {
      ...mockBriefing.diagnosis,
      score: { ...mockBriefing.diagnosis.score, overall: 85 },
    },
  };
  assert.ok(generateSiteBuildPrompt(urgent).includes("Prioridade: urgente (nota geral 85/100)"));
});

// ---------------------------------------------------------------------------
// Recommended plan and mandatory sections
// ---------------------------------------------------------------------------

test("prompt lists every mandatory section of the site plan", () => {
  for (const section of ["hero", "services", "differentials", "faq", "contact"]) {
    assert.ok(mockPromptMd.includes(`- ${section}`), `missing section: ${section}`);
  }
});

test("prompt carries the recommended plan details and target stack", () => {
  assert.ok(mockPromptMd.includes("- Objetivo: Gerar contatos via WhatsApp/formulario"));
  assert.ok(mockPromptMd.includes("- CTA principal: Solicitar orcamento"));
  assert.ok(mockPromptMd.includes("- Stack alvo: nextjs-typescript-tailwind"));
  assert.ok(mockPromptMd.includes("- Secoes: hero, services, differentials, faq, contact"));
  assert.ok(mockPromptMd.includes("- Entrega estimada: 3 dias"));
});

// ---------------------------------------------------------------------------
// Assets and content rules
// ---------------------------------------------------------------------------

test("prompt lists available assets from real lead data", () => {
  assert.ok(mockPromptMd.includes("Nome real do negocio: Calhas Silva"));
  assert.ok(mockPromptMd.includes("WhatsApp real: +5547999990000"));
  assert.ok(mockPromptMd.includes("Site atual: https://example.com"));
});

test("prompt lists missing assets that must not be invented", () => {
  assert.ok(mockPromptMd.includes("Email de contato"));
  assert.ok(mockPromptMd.includes("Link do Google Maps / endereco do negocio"));
});

test("prompt lists the don't-invent data rules", () => {
  for (const rule of ["depoimentos", "certificacoes", "anos de experiencia"]) {
    assert.ok(mockPromptMd.includes(`- ${rule}`), `missing rule: ${rule}`);
  }
});

test("prompt lists the acceptance criteria", () => {
  assert.ok(mockPromptMd.includes("- CTA acima da dobra"));
  assert.ok(mockPromptMd.includes("- Lighthouse Performance 90+ quando possivel"));
});

// ---------------------------------------------------------------------------
// Human approval and build instruction
// ---------------------------------------------------------------------------

test("prompt warns of human approval before publishing", () => {
  assert.ok(mockPromptMd.includes("## Aprovacao humana"));
  assert.ok(mockPromptMd.includes("Requer aprovacao humana antes de gerar ou publicar"));
});

test("prompt instructs to build a static landing from the briefing", () => {
  assert.ok(mockPromptMd.includes("Crie uma landing page estatica e profissional para Calhas Silva"));
  assert.ok(mockPromptMd.includes("usando a stack nextjs-typescript-tailwind"));
});

// ---------------------------------------------------------------------------
// Safety and robustness
// ---------------------------------------------------------------------------

test("prompt does not fabricate sensitive data that is missing", () => {
  // mockBriefing has no email/address — no invented email must appear anywhere.
  assert.ok(!mockPromptMd.includes("@"));
  assert.ok(!mockPromptMd.includes("Av. "));
});

test("prompt falls back gracefully when asset lists are empty", () => {
  const sparse = {
    ...mockBriefing,
    contentRules: { ...mockBriefing.contentRules, mustUse: [], missingAssets: [] },
  };
  const md = generateSiteBuildPrompt(sparse);
  assert.ok(md.includes("- Nenhum item identificado."));
});

// ---------------------------------------------------------------------------
// Pipeline integration
// ---------------------------------------------------------------------------

test("prompt can be generated straight from the briefing generator", () => {
  const md = generateSiteBuildPrompt(mockBriefingFromGenerator);
  assert.ok(md.includes("Calhas Silva"));
  assert.ok(md.includes("## Instrucao para gerar o site"));
});

test("prompt renders a human-readable document", () => {
  assert.ok(mockPromptMd.trim().length > 300);
  assert.ok(mockPromptMd.split("\n").length > 30);
});
