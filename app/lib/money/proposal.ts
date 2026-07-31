import { z } from "zod";
import {
  ACCEPTANCE_CRITERIA,
  DELIVERY_GOAL_DAYS,
  PRIMARY_CTA,
  PRIMARY_GOAL,
  SECONDARY_CTA,
  TONE,
  VISUAL_DIRECTION,
} from "./briefing.ts";
import type { Briefing } from "./briefing.ts";
import {
  priorityLabelFromOverall,
  priorityLabelSchema,
} from "./score.ts";
import type { PriorityLabel } from "./score.ts";

// ---------------------------------------------------------------------------
// Fixed proposal constants
// ---------------------------------------------------------------------------

/** Warning that must accompany every proposal: human approval before building. */
export const HUMAN_APPROVAL_NOTE =
  "Requer aprovacao humana antes de gerar ou publicar qualquer site. Nenhum dado, depoimento, metrica ou resultado pode ser inventado.";

const PRIORITY_LABEL_PT: Record<PriorityLabel, string> = {
  low: "baixa",
  medium: "media",
  high: "alta",
  urgent: "urgente",
};

/** Translates the canonical priority label for the Portuguese proposal. */
export function priorityLabelToPt(label: PriorityLabel): string {
  return PRIORITY_LABEL_PT[label];
}

// ---------------------------------------------------------------------------
// Proposal schema — the structured commercial diagnosis derived from the
// briefing. The score stays numeric; the priority label is re-derived from the
// overall score so the briefing remains the single input.
// ---------------------------------------------------------------------------

export const proposalMetaSchema = z.object({
  title: z.string().min(1),
  businessName: z.string().min(1),
  priorityLabel: priorityLabelSchema,
  overallScore: z.number(),
});

export const recommendedSitePlanSchema = z.object({
  primaryGoal: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  sections: z.array(z.string()),
  seoKeywords: z.array(z.string()),
  tone: z.string(),
  visualDirection: z.string(),
  deliveryGoalDays: z.number().int().positive(),
});

export const proposalSchema = z.object({
  meta: proposalMetaSchema,
  businessSummary: z.string(),
  mainProblems: z.array(z.string()),
  commercialRisks: z.array(z.string()),
  opportunities: z.array(z.string()),
  recommendedSitePlan: recommendedSitePlanSchema,
  missingAssets: z.array(z.string()),
  requiredAssets: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  humanApprovalRequired: z.literal(true),
  humanApprovalNote: z.string(),
});

export type Proposal = z.infer<typeof proposalSchema>;

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** One-line, deterministic summary of the business for the proposal. */
export function buildBusinessSummary(business: Briefing["business"]): string {
  const segment = business.category ? ` no segmento de ${business.category}` : "";
  const location = business.city
    ? ` em ${business.city}${business.state ? "/" + business.state : ""}`
    : "";
  if (segment || location) return `${business.name} atua${segment}${location}.`;
  return `${business.name} e um negocio local.`;
}

/**
 * Deterministically derives the commercial proposal from a briefing. No
 * randomness, no AI, no external calls — the same briefing always produces
 * the same proposal.
 */
export function generateProposalFromBriefing(briefing: Briefing): Proposal {
  const {
    business,
    diagnosis,
    sitePlan,
    contentRules,
    acceptanceCriteria,
    project,
  } = briefing;

  return {
    meta: {
      title: `Proposta comercial para ${business.name}`,
      businessName: business.name,
      priorityLabel: priorityLabelFromOverall(diagnosis.score.overall),
      overallScore: diagnosis.score.overall,
    },
    businessSummary: buildBusinessSummary(business),
    mainProblems: [...diagnosis.mainProblems],
    commercialRisks: [...diagnosis.commercialRisks],
    opportunities: [...diagnosis.opportunities],
    recommendedSitePlan: {
      primaryGoal: sitePlan.primaryGoal,
      primaryCta: sitePlan.primaryCta,
      secondaryCta: sitePlan.secondaryCta,
      sections: [...sitePlan.sections],
      seoKeywords: [...sitePlan.seoKeywords],
      tone: sitePlan.tone,
      visualDirection: sitePlan.visualDirection,
      deliveryGoalDays: project.deliveryGoalDays,
    },
    missingAssets: [...contentRules.missingAssets],
    requiredAssets: [...contentRules.mustUse],
    acceptanceCriteria: [...acceptanceCriteria],
    humanApprovalRequired: true,
    humanApprovalNote: HUMAN_APPROVAL_NOTE,
  };
}

function bulletList(items: string[]): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : ["- Nenhum item identificado."];
}

/** Renders the proposal as a Markdown document (deterministic). */
export function renderProposalMarkdown(proposal: Proposal): string {
  const { meta, recommendedSitePlan } = proposal;
  const lines: string[] = [];

  lines.push(`# ${meta.title}`, "");
  lines.push("## Resumo do negocio");
  lines.push(proposal.businessSummary, "");
  lines.push("## Prioridade comercial");
  lines.push(
    `Prioridade: ${priorityLabelToPt(meta.priorityLabel)} (nota geral ${meta.overallScore}/100)`,
    "",
  );
  lines.push("## Principais problemas");
  lines.push(...bulletList(proposal.mainProblems), "");
  lines.push("## Riscos comerciais");
  lines.push(...bulletList(proposal.commercialRisks), "");
  lines.push("## Oportunidades");
  lines.push(...bulletList(proposal.opportunities), "");
  lines.push("## Plano de site recomendado");
  lines.push(
    `- Objetivo: ${recommendedSitePlan.primaryGoal}`,
    `- CTA principal: ${recommendedSitePlan.primaryCta}`,
    `- CTA secundario: ${recommendedSitePlan.secondaryCta}`,
    `- Secoes: ${recommendedSitePlan.sections.join(", ")}`,
    `- Palavras-chave SEO: ${
      recommendedSitePlan.seoKeywords.length
        ? recommendedSitePlan.seoKeywords.join("; ")
        : "a definir"
    }`,
    `- Tom: ${recommendedSitePlan.tone}`,
    `- Direcao visual: ${recommendedSitePlan.visualDirection}`,
    `- Entrega estimada: ${recommendedSitePlan.deliveryGoalDays} dias`,
    "",
  );
  lines.push("## Assets ausentes");
  lines.push(...bulletList(proposal.missingAssets), "");
  lines.push("## Assets obrigatorios");
  lines.push(...bulletList(proposal.requiredAssets), "");
  lines.push("## Criterios de aceite");
  lines.push(...bulletList(proposal.acceptanceCriteria), "");
  lines.push("---", "");
  lines.push(`> ${proposal.humanApprovalNote}`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Mock — snapshot of the proposal generated from mockBriefing
// ---------------------------------------------------------------------------

export const mockProposal: Proposal = {
  meta: {
    title: "Proposta comercial para Calhas Silva",
    businessName: "Calhas Silva",
    priorityLabel: "low",
    overallScore: 27,
  },
  businessSummary: "Calhas Silva atua no segmento de Telhados e calhas em Joinville/SC.",
  mainProblems: [
    "WhatsApp nao visivel no site",
    "CTA principal ausente",
    "Sem formulario de contato",
    "Sem agendamento ou solicitacao de orcamento online",
    "Sem prova social",
    "Sem sinais de SEO local",
    "Sem embed do Google Maps",
    "Performance lenta (Lighthouse 32)",
    "SEO tecnico fraco (Lighthouse 28)",
    "Acessibilidade abaixo do ideal (Lighthouse 45)",
  ],
  commercialRisks: [
    "Sem canal de conversao estruturado: visitantes nao viram contatos",
    "Falta de prova social reduz confianca no fechamento",
    "Urgencia alta: demanda local pode migrar para concorrentes com presenca digital melhor",
  ],
  opportunities: [
    "Adicionar WhatsApp visivel para capturar contatos",
    "Adicionar CTA principal acima da dobra",
    "Adicionar formulario de contato simples",
    "Adicionar solicitacao de orcamento online",
    "Coletar depoimentos reais de clientes",
    "Estruturar SEO local basico (cidade, telefone, maps)",
    "Adicionar embed do Google Maps",
    "Entregar landing em ate 3 dias para aproveitar a urgencia",
  ],
  recommendedSitePlan: {
    primaryGoal: PRIMARY_GOAL,
    primaryCta: PRIMARY_CTA,
    secondaryCta: SECONDARY_CTA,
    sections: ["hero", "services", "differentials", "faq", "contact"],
    seoKeywords: [
      "Telhados e calhas em Joinville",
      "Telhados e calhas em Joinville SC",
      "Joinville",
      "Joinville SC",
    ],
    tone: TONE,
    visualDirection: VISUAL_DIRECTION,
    deliveryGoalDays: DELIVERY_GOAL_DAYS,
  },
  missingAssets: [
    "Email de contato",
    "Link do Google Maps / endereco do negocio",
    "Depoimentos reais de clientes",
  ],
  requiredAssets: [
    "Nome real do negocio: Calhas Silva",
    "Categoria: Telhados e calhas",
    "Cidade/UF reais: Joinville/SC",
    "WhatsApp real: +5547999990000",
    "Telefone real: (47) 99999-0000",
    "Site atual: https://example.com",
  ],
  acceptanceCriteria: ACCEPTANCE_CRITERIA,
  humanApprovalRequired: true,
  humanApprovalNote: HUMAN_APPROVAL_NOTE,
};
