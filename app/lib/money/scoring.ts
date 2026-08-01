import { z } from "zod";
import { evidenceSchema, type Evidence, type EvidenceStatus } from "./evidence.ts";
import { statusOf } from "./evidence.ts";

// ---------------------------------------------------------------------------
// Category scoring — six commercial dimensions derived deterministically from
// Evidence. Higher score is always better (technicalRisk score = "health";
// the UI inverts it for display as risk). Unknown statuses stay neutral and
// are reported honestly via the "Sem dados suficientes" signal.
// ---------------------------------------------------------------------------

export const auditCategorySchema = z.enum([
  "performance",
  "seo",
  "accessibility",
  "conversion",
  "stack",
  "technicalRisk",
]);
export type AuditCategory = z.infer<typeof auditCategorySchema>;

export const auditCategoryScoreSchema = z.object({
  category: auditCategorySchema,
  score: z.number().min(0).max(100),
  summary: z.string(),
  signals: z.array(z.string()),
});
export type AuditCategoryScore = z.infer<typeof auditCategoryScoreSchema>;

/** Typed report returned to the UI and saved as JSON. */
export const siteAuditReportSchema = z.object({
  url: z.string(),
  fetchedAt: z.string(),
  categories: z.array(auditCategoryScoreSchema),
  overall: z.number().min(0).max(100),
  evidence: z.array(evidenceSchema),
});
export type SiteAuditReport = z.infer<typeof siteAuditReportSchema>;

const CATEGORY_LABEL: Record<AuditCategory, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Acessibilidade",
  conversion: "Conversao",
  stack: "Stack/Tecnologia",
  // Display only. The internal key stays `technicalRisk`; a high score means
  // healthy/low risk, so the label reads as positive ("Saude tecnica").
  technicalRisk: "Saude tecnica",
};

export const auditCategoryLabel = (category: AuditCategory): string =>
  CATEGORY_LABEL[category];

// Weighted average — conversion carries the most commercial weight.
const OVERALL_WEIGHTS: Record<AuditCategory, number> = {
  performance: 0.2,
  seo: 0.2,
  accessibility: 0.15,
  conversion: 0.25,
  stack: 0.1,
  technicalRisk: 0.1,
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function bandLabel(score: number): string {
  if (score >= 80) return "saudavel";
  if (score >= 60) return "adequado";
  if (score >= 40) return "requer atencao";
  return "critico";
}

function summaryFor(category: AuditCategory, score: number): string {
  const label = CATEGORY_LABEL[category];
  if (category === "technicalRisk") {
    // Score is health (high = low risk), so wording matches the positive frame.
    if (score >= 80) return `${label} alta`;
    if (score >= 60) return `${label} moderada`;
    if (score >= 40) return `${label} baixa`;
    return `${label} critica`;
  }
  return `${label} ${bandLabel(score)}`;
}

// ---------------------------------------------------------------------------
// Per-category scorers — each returns a score plus the signals that produced it
// ---------------------------------------------------------------------------

function scorePerformance(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 55;

  const tech = statusOf(evidence, "technicalErrors");
  if (tech === "yes") {
    score -= 30;
    signals.push("Erros tecnicos visiveis detectados");
  } else if (tech === "partial") {
    score -= 15;
    signals.push("Possiveis erros tecnicos");
  } else if (tech === "no") {
    score += 10;
    signals.push("Sem erros tecnicos basicos");
  }

  if (statusOf(evidence, "bodyShort") === "yes") {
    score -= 15;
    signals.push("Conteudo quase vazio (possivel JS-rendered)");
  }

  const perf = statusOf(evidence, "performance");
  if (perf === "yes") {
    score += 20;
    signals.push("Performance Lighthouse saudavel");
  } else if (perf === "partial") {
    score -= 10;
    signals.push("Performance Lighthouse baixa");
  } else if (perf === "no") {
    score -= 25;
    signals.push("Performance Lighthouse critica");
  }

  if (signals.length === 0) {
    signals.push("Sem dados suficientes (Lighthouse nao executado)");
  }
  return { category: "performance", score: clamp(score), summary: "", signals };
}

function scoreSeo(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 35;

  const title = statusOf(evidence, "title");
  if (title === "yes") {
    score += 20;
    signals.push("Titulo da pagina presente");
  } else if (title === "no") {
    signals.push("Titulo da pagina ausente");
  }

  const desc = statusOf(evidence, "metaDescription");
  if (desc === "yes") {
    score += 20;
    signals.push("Meta description presente");
  } else if (desc === "no") {
    signals.push("Meta description ausente");
  }

  if (statusOf(evidence, "h1") === "yes") {
    score += 10;
    signals.push("H1 presente");
  }
  if (statusOf(evidence, "canonical") === "yes") {
    score += 10;
    signals.push("URL canonica presente");
  }

  const local = statusOf(evidence, "localSeo");
  if (local === "yes") {
    score += 10;
    signals.push("Sinais de SEO local");
  } else if (local === "partial") {
    score += 5;
  }

  if (signals.length === 0) {
    signals.push("Sem dados suficientes");
  }
  return { category: "seo", score: clamp(score), summary: "", signals };
}

function scoreAccessibility(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 45;

  const viewport = statusOf(evidence, "viewport");
  if (viewport === "yes") {
    score += 20;
    signals.push("Viewport presente (responsivo)");
  } else if (viewport === "no") {
    signals.push("Viewport ausente — pode nao ser responsivo");
  }

  const imagesAlt = statusOf(evidence, "imagesAlt");
  if (imagesAlt === "yes") {
    score += 15;
    signals.push("Imagens com atributo alt");
  } else if (imagesAlt === "no") {
    signals.push("Imagens sem atributo alt");
  }

  if (statusOf(evidence, "h1") === "yes") {
    score += 15;
    signals.push("Estrutura de heading presente");
  }

  const access = statusOf(evidence, "accessibility");
  if (access === "yes") {
    score += 20;
    signals.push("Acessibilidade Lighthouse saudavel");
  } else if (access === "partial") {
    score -= 10;
  } else if (access === "no") {
    score -= 20;
    signals.push("Acessibilidade Lighthouse baixa");
  }

  if (signals.length === 0) {
    signals.push("Sem dados suficientes");
  }
  return {
    category: "accessibility",
    score: clamp(score),
    summary: "",
    signals,
  };
}

function scoreConversion(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 15;

  const whatsapp = statusOf(evidence, "whatsapp");
  if (whatsapp === "yes") {
    score += 20;
    signals.push("WhatsApp visivel");
  } else if (whatsapp === "no") {
    signals.push("WhatsApp ausente");
  }

  const cta = statusOf(evidence, "cta");
  if (cta === "yes") {
    score += 20;
    signals.push("CTA principal presente");
  } else if (cta === "no") {
    signals.push("CTA principal ausente");
  }

  if (statusOf(evidence, "contactForm") === "yes") {
    score += 15;
    signals.push("Formulario de contato");
  }
  if (statusOf(evidence, "booking") === "yes") {
    score += 10;
    signals.push("Agendamento / reserva disponivel");
  }
  if (statusOf(evidence, "socialProof") === "yes") {
    score += 10;
    signals.push("Prova social presente");
  }
  if (statusOf(evidence, "phone") === "yes") {
    score += 5;
    signals.push("Telefone visivel");
  }

  if (signals.length === 0) {
    signals.push("Sem dados suficientes");
  }
  return { category: "conversion", score: clamp(score), summary: "", signals };
}

function scoreStack(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 50;

  const stack = statusOf(evidence, "techStack");
  if (stack === "yes") {
    score += 25;
    signals.push("Stack moderna detectada");
  } else if (stack === "partial") {
    score += 5;
    signals.push("Tecnologia parcialmente detectada");
  } else if (stack === "no") {
    score -= 25;
    signals.push("Stack legado / desatualizada");
  } else {
    signals.push("Stack nao detectada no HTML");
  }

  if (statusOf(evidence, "siteExists") === "no") {
    score -= 30;
    signals.push("Site sem presenca detectavel");
  }

  return { category: "stack", score: clamp(score), summary: "", signals };
}

function scoreTechnicalRisk(evidence: Evidence[]): AuditCategoryScore {
  const signals: string[] = [];
  let score = 60;

  const tech = statusOf(evidence, "technicalErrors");
  if (tech === "yes") {
    score -= 30;
    signals.push("Erros tecnicos visiveis");
  } else if (tech === "partial") {
    score -= 15;
  } else if (tech === "no") {
    score += 10;
    signals.push("Sem erros tecnicos basicos");
  }

  if (statusOf(evidence, "viewport") === "no") {
    score -= 15;
    signals.push("Viewport ausente");
  }
  if (statusOf(evidence, "charset") === "no") {
    score -= 10;
    signals.push("Charset ausente");
  }
  if (statusOf(evidence, "bodyShort") === "yes") {
    score -= 10;
    signals.push("Conteudo JS-rendered sem fallback");
  }

  const https = statusOf(evidence, "https");
  if (https === "yes") {
    score += 5;
    signals.push("HTTPS ativo");
  } else if (https === "no") {
    score -= 15;
    signals.push("Site sem HTTPS");
  }

  if (signals.length === 0) {
    signals.push("Sem dados suficientes");
  }
  return {
    category: "technicalRisk",
    score: clamp(score),
    summary: "",
    signals,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const SCORERS: Record<AuditCategory, (e: Evidence[]) => AuditCategoryScore> = {
  performance: scorePerformance,
  seo: scoreSeo,
  accessibility: scoreAccessibility,
  conversion: scoreConversion,
  stack: scoreStack,
  technicalRisk: scoreTechnicalRisk,
};

/** Scores all six categories deterministically from evidence. */
export function scoreCategoriesFromEvidence(
  evidence: Evidence[],
): AuditCategoryScore[] {
  const categories = (Object.keys(SCORERS) as AuditCategory[]).map((category) =>
    SCORERS[category](evidence),
  );
  for (const cat of categories) {
    cat.summary = summaryFor(cat.category, cat.score);
  }
  return categories;
}

export function computeOverallScore(categories: AuditCategoryScore[]): number {
  const totalWeight = Object.values(OVERALL_WEIGHTS).reduce((a, b) => a + b, 0);
  const weighted = categories.reduce(
    (sum, cat) => sum + cat.score * (OVERALL_WEIGHTS[cat.category] ?? 0),
    0,
  );
  return clamp(weighted / totalWeight);
}

/** Builds the full typed report consumed by the UI and saved as JSON. */
export function buildSiteAuditReport(input: {
  url: string;
  fetchedAt: string;
  evidence: Evidence[];
}): SiteAuditReport {
  const categories = scoreCategoriesFromEvidence(input.evidence);
  return siteAuditReportSchema.parse({
    url: input.url,
    fetchedAt: input.fetchedAt,
    categories,
    overall: computeOverallScore(categories),
    evidence: input.evidence,
  });
}

// ---------------------------------------------------------------------------
// Evidence type helper (exported for the UI to render statuses)
// ---------------------------------------------------------------------------

export type { EvidenceStatus };
