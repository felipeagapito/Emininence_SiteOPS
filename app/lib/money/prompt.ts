import type { Briefing } from "./briefing.ts";
import {
  generateProposalFromBriefing,
  priorityLabelToPt,
} from "./proposal.ts";

// ---------------------------------------------------------------------------
// site-build-prompt.md — deterministic build handoff for Claude/Codex
// ---------------------------------------------------------------------------

function bulletList(items: string[]): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : ["- Nenhum item identificado."];
}

const FINAL_INSTRUCTION_RULES = [
  "Pagina rapida, responsiva e profissional",
  "CTA principal acima da dobra",
  "Incluir todas as secoes obrigatorias listadas acima",
  "SEO local basico",
  "Nao usar backend complexo",
  "Respeitar as Regras de nao inventar dados e os Criterios de aceite listados acima",
  "Para assets ausentes, usar texto generico seguro ou marcar como pendencia",
  "Evitar visual generico, poluido ou com cara de template barato",
  "Nao publicar o site: entregar o codigo para revisao e aprovacao humana",
];

const FINAL_INSTRUCTION_DELIVERABLES = [
  "Codigo completo do site estatico",
  "README com como rodar",
  "Checklist de validacao",
  "Lista do que ainda precisa de informacao real do cliente",
];

/**
 * Deterministically renders the `site-build-prompt.md` handoff for Claude/Codex
 * from a briefing. It reuses the proposal derivation (same business summary,
 * same priority labels) so every artifact tells one story. No randomness, no
 * AI, no external calls — the same briefing always produces the same prompt.
 */
export function generateSiteBuildPrompt(briefing: Briefing): string {
  const proposal = generateProposalFromBriefing(briefing);
  const { meta, recommendedSitePlan } = proposal;
  const lines: string[] = [];

  lines.push(`# Site build prompt para ${meta.businessName}`, "");
  lines.push(
    "> Instrucao para Claude/Codex: gere uma landing page estatica e profissional",
    "> com base no briefing abaixo. Use somente os dados reais listados em Assets",
    "> disponiveis. Nao invente nenhuma informacao e nao publique sem aprovacao humana.",
    "",
  );

  lines.push("## Contexto do negocio");
  lines.push(proposal.businessSummary, "");

  lines.push("## Diagnostico resumido");
  lines.push(`Score geral: ${meta.overallScore}/100`, "");
  lines.push("Principais problemas:");
  lines.push(...bulletList(proposal.mainProblems), "");
  lines.push("Riscos comerciais:");
  lines.push(...bulletList(proposal.commercialRisks), "");
  lines.push("Oportunidades:");
  lines.push(...bulletList(proposal.opportunities), "");

  lines.push("## Prioridade comercial");
  lines.push(
    `Prioridade: ${priorityLabelToPt(meta.priorityLabel)} (nota geral ${meta.overallScore}/100)`,
    "",
  );

  lines.push("## Plano recomendado da landing/site");
  lines.push(
    `- Objetivo: ${recommendedSitePlan.primaryGoal}`,
    `- CTA principal: ${recommendedSitePlan.primaryCta}`,
    `- CTA secundario: ${recommendedSitePlan.secondaryCta}`,
    `- Stack alvo: ${briefing.project.targetStack}`,
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

  lines.push("## Secoes obrigatorias");
  lines.push(...bulletList(recommendedSitePlan.sections), "");

  lines.push("## Assets disponiveis");
  lines.push(...bulletList(proposal.requiredAssets), "");

  lines.push("## Assets ausentes");
  lines.push(...bulletList(proposal.missingAssets), "");

  lines.push("## Regras de nao inventar dados");
  lines.push(...bulletList(briefing.contentRules.mustNotInvent), "");

  lines.push("## Criterios de aceite");
  lines.push(...bulletList(proposal.acceptanceCriteria), "");

  lines.push("## Aprovacao humana");
  lines.push(`> ${proposal.humanApprovalNote}`, "");

  lines.push("## Instrucao para gerar o site");
  lines.push(
    `Crie uma landing page estatica e profissional para ${meta.businessName} a partir do briefing deste prompt, usando a stack ${briefing.project.targetStack}.`,
    "",
  );
  lines.push("Regras obrigatorias:");
  lines.push(...bulletList(FINAL_INSTRUCTION_RULES), "");
  lines.push("Entregue:");
  lines.push(...bulletList(FINAL_INSTRUCTION_DELIVERABLES));

  return lines.join("\n");
}
