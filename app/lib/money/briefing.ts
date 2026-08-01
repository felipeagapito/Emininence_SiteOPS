import { z } from "zod";
import { evidenceSchema } from "./evidence.ts";
import { dualScoreSchema } from "./score.ts";

// ---------------------------------------------------------------------------
// Fixed project / content constants (see 06_SITE_BUILDER_HANDOFF.md)
// ---------------------------------------------------------------------------

export const PROJECT_TYPE = "local_service_landing" as const;
export const TARGET_STACK = "nextjs-typescript-tailwind" as const;
export const DELIVERY_GOAL_DAYS = 3;

export const PRIMARY_GOAL = "Gerar contatos via WhatsApp/formulario";
export const PRIMARY_CTA = "Solicitar orcamento";
export const SECONDARY_CTA = "Chamar no WhatsApp";
export const TONE = "profissional, claro e confiavel";
export const VISUAL_DIRECTION = "premium, local, rapido, sem visual generico";

/** Information the site builder must never invent. */
export const MUST_NOT_INVENT = [
  "depoimentos",
  "certificacoes",
  "anos de experiencia",
  "numero de clientes",
  "garantias de resultado",
  "informacoes juridicas",
];

export const ACCEPTANCE_CRITERIA = [
  "CTA acima da dobra",
  "WhatsApp visivel",
  "formulario simples",
  "responsivo",
  "SEO local basico",
  "Lighthouse Performance 90+ quando possivel",
  "Accessibility 90+",
  "SEO 90+",
  "sem backend complexo",
];

// ---------------------------------------------------------------------------
// Briefing schema — the artifact handed to Claude/Codex to build the site
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  name: z.string().min(1),
  type: z.literal(PROJECT_TYPE),
  targetStack: z.literal(TARGET_STACK),
  deliveryGoalDays: z.number().int().positive(),
});

export const businessSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  city: z.string(),
  state: z.string(),
  websiteUrl: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().optional(),
});

export const briefingScoreSchema = z.object({
  digitalPresence: z.number(),
  performance: z.number(),
  localSeo: z.number(),
  conversion: z.number(),
  trust: z.number(),
  urgency: z.number(),
  overall: z.number(),
});

export const diagnosisSchema = z.object({
  mainProblems: z.array(z.string()),
  commercialRisks: z.array(z.string()),
  technicalRisks: z.array(z.string()),
  opportunities: z.array(z.string()),
  score: briefingScoreSchema,
  scores: dualScoreSchema.optional(),
  evidence: z.array(evidenceSchema).optional(),
  unconfirmedPoints: z.array(z.string()).optional(),
  requiresHumanReview: z.boolean().optional(),
});

export const sitePlanSchema = z.object({
  primaryGoal: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  sections: z.array(z.string()),
  seoKeywords: z.array(z.string()),
  tone: z.string(),
  visualDirection: z.string(),
});

export const contentRulesSchema = z.object({
  mustUse: z.array(z.string()),
  mustNotInvent: z.array(z.string()),
  missingAssets: z.array(z.string()),
});

export const briefingSchema = z.object({
  project: projectSchema,
  business: businessSchema,
  diagnosis: diagnosisSchema,
  sitePlan: sitePlanSchema,
  contentRules: contentRulesSchema,
  acceptanceCriteria: z.array(z.string()),
});

export type Briefing = z.infer<typeof briefingSchema>;
export type BriefingScore = z.infer<typeof briefingScoreSchema>;

/** Snapshot of the briefing generated from mockLead + mockAudit + the mock score. */
export const mockBriefing: Briefing = {
  project: {
    name: "Landing page para Calhas Silva",
    type: PROJECT_TYPE,
    targetStack: TARGET_STACK,
    deliveryGoalDays: DELIVERY_GOAL_DAYS,
  },
  business: {
    name: "Calhas Silva",
    category: "Telhados e calhas",
    city: "Joinville",
    state: "SC",
    websiteUrl: "https://example.com",
    whatsapp: "+5547999990000",
  },
  diagnosis: {
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
    technicalRisks: [
      "Performance tecnica baixa (Lighthouse Performance 32)",
      "Acessibilidade abaixo do alvo (Lighthouse Accessibility 45)",
      "SEO tecnico abaixo do alvo (Lighthouse SEO 28)",
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
    score: {
      digitalPresence: 35,
      performance: 32,
      localSeo: 15,
      conversion: 0,
      trust: 35,
      urgency: 75,
      overall: 27,
    },
  },
  sitePlan: {
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
  },
  contentRules: {
    mustUse: [
      "Nome real do negocio: Calhas Silva",
      "Categoria: Telhados e calhas",
      "Cidade/UF reais: Joinville/SC",
      "WhatsApp real: +5547999990000",
      "Telefone real: (47) 99999-0000",
      "Site atual: https://example.com",
    ],
    mustNotInvent: MUST_NOT_INVENT,
    missingAssets: [
      "Email de contato",
      "Link do Google Maps / endereco do negocio",
      "Depoimentos reais de clientes",
    ],
  },
  acceptanceCriteria: ACCEPTANCE_CRITERIA,
};
