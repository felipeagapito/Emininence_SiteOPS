import { z } from "zod";

// ---------------------------------------------------------------------------
// Evidence status — replaces boolean checklist with a richer signal model.
// yes: clearly present; partially present; clearly absent; unknown: cannot
// determine (e.g. JS-rendered widget, missing data).
// ---------------------------------------------------------------------------

export const evidenceStatusSchema = z.enum(["yes", "partial", "no", "unknown"]);
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

export const evidenceConfidenceSchema = z.enum(["low", "medium", "high"]);
export type EvidenceConfidence = z.infer<typeof evidenceConfidenceSchema>;

export const evidenceSchema = z.object({
  key: z.string(),
  label: z.string(),
  status: evidenceStatusSchema,
  evidence: z.string(),
  confidence: evidenceConfidenceSchema,
});
export type Evidence = z.infer<typeof evidenceSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a boolean audit field to EvidenceStatus. */
export function booleanToStatus(value: boolean): "yes" | "no" {
  return value ? "yes" : "no";
}

/** Converts EvidenceStatus to boolean. yes/partial → true; else false. */
export function statusToBoolean(
  status: EvidenceStatus,
  fallback = false,
): boolean {
  if (status === "yes" || status === "partial") return true;
  if (status === "no") return false;
  return fallback;
}

/** Looks up the status of an evidence item by key (defaults to "unknown"). */
export function statusOf(
  evidence: Evidence[],
  key: string,
): EvidenceStatus {
  return evidence.find((e) => e.key === key)?.status ?? "unknown";
}

/** Finds a full Evidence item by key. */
export function evidenceByKey(
  evidence: Evidence[],
  key: string,
): Evidence | undefined {
  return evidence.find((e) => e.key === key);
}

// ---------------------------------------------------------------------------
// Audit → Evidence conversion (for manual page: checkboxes → statuses)
// ---------------------------------------------------------------------------

function bool(
  key: string,
  label: string,
  value: boolean,
  confidence: EvidenceConfidence = "medium",
): Evidence {
  return {
    key,
    label,
    status: value ? "yes" : "no",
    evidence: value ? "Confirmado no formulario manual" : "Nao informado",
    confidence,
  };
}

/**
 * Maps a boolean Audit to Evidence statuses so the manual page can use the
 * same dual-score and evidence-aware builders as the URL audit page.
 */
export function auditToEvidence(
  audit: {
    websiteExists: boolean;
    hasWhatsapp: boolean;
    hasPrimaryCta: boolean;
    hasContactForm: boolean;
    hasBookingOrSchedule: boolean;
    hasSocialProof: boolean;
    hasLocalSeoSignals: boolean;
    hasGoogleMapsEmbed: boolean;
    performanceScore: number | null;
    seoScore: number | null;
    accessibilityScore: number | null;
  },
  options?: { hasLocalContext?: boolean },
): Evidence[] {
  const hasLocal = options?.hasLocalContext ?? false;
  const evidence: Evidence[] = [
    bool("siteExists", "Site existente", audit.websiteExists, "high"),
    bool("whatsapp", "WhatsApp", audit.hasWhatsapp, "medium"),
    bool("cta", "CTA principal", audit.hasPrimaryCta, "medium"),
    bool("contactForm", "Formulario de contato", audit.hasContactForm, "medium"),
    bool("booking", "Agendamento / reserva", audit.hasBookingOrSchedule, "medium"),
    bool("socialProof", "Prova social", audit.hasSocialProof, "medium"),
    bool("googleMaps", "Google Maps", audit.hasGoogleMapsEmbed, "medium"),
  ];

  // Derived local SEO: based on explicit signals or whether user gave local context.
  const localSignals = [
    audit.hasLocalSeoSignals,
    audit.hasGoogleMapsEmbed,
    hasLocal,
  ].filter(Boolean).length;
  evidence.push({
    key: "localSeo",
    label: "Sinais de SEO local",
    status:
      localSignals >= 2 ? "yes" : localSignals === 1 ? "partial" : "no",
    evidence: hasLocal
      ? "Informacao de cidade/UF fornecida pelo usuario"
      : "Nenhum sinal de SEO local detectado",
    confidence: "medium",
  });

  // Informational signals not available via checkboxes → unknown
  evidence.push(
    {
      key: "title",
      label: "Titulo da pagina",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "metaDescription",
      label: "Meta description",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "phone",
      label: "Telefone",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "email",
      label: "Email",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "address",
      label: "Endereco",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "technicalErrors",
      label: "Erros tecnicos visiveis",
      status: audit.performanceScore !== null && audit.performanceScore < 50
        ? "partial"
        : "unknown",
      evidence:
        audit.performanceScore !== null && audit.performanceScore < 50
          ? `Performance baixa detectada (Lighthouse ${audit.performanceScore})`
          : "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "socialLinks",
      label: "Links sociais",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
    {
      key: "internalLinks",
      label: "Links internos",
      status: "unknown",
      evidence: "Nao disponivel na entrada manual",
      confidence: "low",
    },
  );

  return evidence;
}
