"use client";

import { useState, type FormEvent } from "react";
import {
  buildManualArtifacts,
  type ManualArtifacts,
  type ManualAuditInput,
  type ManualLeadInput,
} from "../../lib/money/manual-input";
import { ExportButtons } from "../export-buttons";

// ---------------------------------------------------------------------------
// Manual entry form — Lead + Audit → local deterministic pipeline. All state
// lives in the browser; nothing is persisted or sent anywhere.
// ---------------------------------------------------------------------------

const EMPTY_LEAD: ManualLeadInput = {
  businessName: "",
  category: "",
  city: "",
  state: "",
  phone: "",
  whatsapp: "",
  email: "",
  websiteUrl: "",
  googleMapsUrl: "",
  notes: "",
};

const EMPTY_AUDIT: ManualAuditInput = {
  websiteExists: true,
  hasWhatsapp: false,
  hasPrimaryCta: false,
  hasContactForm: false,
  hasBookingOrSchedule: false,
  hasSocialProof: false,
  hasLocalSeoSignals: false,
  hasGoogleMapsEmbed: false,
  performanceScore: "",
  accessibilityScore: "",
  seoScore: "",
  bestPracticesScore: "",
  mobileUsabilityNotes: "",
};

const LEAD_FIELDS: {
  key: keyof ManualLeadInput;
  label: string;
  required?: boolean;
  type?: string;
}[] = [
  { key: "businessName", label: "Nome do negocio", required: true },
  { key: "category", label: "Categoria / segmento", required: true },
  { key: "city", label: "Cidade", required: true },
  { key: "state", label: "UF", required: true },
  { key: "phone", label: "Telefone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email", type: "email" },
  { key: "websiteUrl", label: "Website", type: "url" },
  { key: "googleMapsUrl", label: "Link do Google Maps", type: "url" },
];

const AUDIT_CHECKS: { key: keyof ManualAuditInput; label: string }[] = [
  { key: "websiteExists", label: "Site existente" },
  { key: "hasWhatsapp", label: "WhatsApp visivel" },
  { key: "hasPrimaryCta", label: "CTA principal" },
  { key: "hasContactForm", label: "Formulario de contato" },
  { key: "hasBookingOrSchedule", label: "Agendamento / orcamento online" },
  { key: "hasSocialProof", label: "Prova social" },
  { key: "hasLocalSeoSignals", label: "Sinais de SEO local" },
  { key: "hasGoogleMapsEmbed", label: "Embed do Google Maps" },
];

const LIGHTHOUSE_FIELDS: {
  key:
    | "performanceScore"
    | "accessibilityScore"
    | "seoScore"
    | "bestPracticesScore";
  label: string;
}[] = [
  { key: "performanceScore", label: "Performance" },
  { key: "accessibilityScore", label: "Acessibilidade" },
  { key: "seoScore", label: "SEO" },
  { key: "bestPracticesScore", label: "Boas praticas" },
];

type ArtifactTab = "briefing" | "proposal" | "prompt";

const TABS: { key: ArtifactTab; label: string }[] = [
  { key: "briefing", label: "briefing.json" },
  { key: "proposal", label: "proposal.md" },
  { key: "prompt", label: "site-build-prompt.md" },
];

export function ManualEntry() {
  const [lead, setLead] = useState<ManualLeadInput>(EMPTY_LEAD);
  const [audit, setAudit] = useState<ManualAuditInput>(EMPTY_AUDIT);
  const [result, setResult] = useState<ManualArtifacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ArtifactTab>("briefing");

  function updateLead(field: keyof ManualLeadInput, value: string) {
    setLead((prev) => ({ ...prev, [field]: value }));
  }

  function updateAudit(field: keyof ManualAuditInput, value: string | boolean) {
    setAudit((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      setResult(buildManualArtifacts(lead, audit));
    } catch (cause) {
      setResult(null);
      setError(
        cause instanceof Error
          ? cause.message
          : "Falha ao validar os dados preenchidos.",
      );
    }
  }

  function handleReset() {
    setLead({ ...EMPTY_LEAD });
    setAudit({ ...EMPTY_AUDIT });
    setResult(null);
    setError(null);
    setActiveTab("briefing");
  }

  const activeContent =
    result &&
    (activeTab === "briefing"
      ? result.briefingJson
      : activeTab === "proposal"
        ? result.proposalMd
        : result.siteBuildPromptMd);

  const scoreDims: [string, number][] = result
    ? [
        ["Presenca digital", result.score.digitalPresence],
        ["Performance", result.score.performance],
        ["SEO local", result.score.localSeo],
        ["Conversao", result.score.conversion],
        ["Confianca", result.score.trust],
        ["Urgencia", result.score.urgency],
      ]
    : [];

  return (
    <form className="money-form" onSubmit={handleSubmit}>
      <section className="money-form-col">
        <div className="money-section-label">
          <span>01 / LEAD</span>
          <i />
          <span>DADOS DO NEGOCIO</span>
        </div>

        {LEAD_FIELDS.map((field) => (
          <div className="money-field" key={field.key}>
            <label htmlFor={`lead-${field.key}`}>
              {field.label}
              {field.required && <em> *</em>}
            </label>
            <input
              id={`lead-${field.key}`}
              name={`lead-${field.key}`}
              type={field.type ?? "text"}
              required={field.required}
              value={lead[field.key]}
              onChange={(event) => updateLead(field.key, event.target.value)}
            />
          </div>
        ))}

        <div className="money-field">
          <label htmlFor="lead-notes">Observacoes</label>
          <textarea
            id="lead-notes"
            name="lead-notes"
            value={lead.notes}
            onChange={(event) => updateLead("notes", event.target.value)}
          />
        </div>
      </section>

      <section className="money-form-col">
        <div className="money-section-label">
          <span>02 / AUDITORIA</span>
          <i />
          <span>PRESENCA DIGITAL</span>
        </div>

        <div className="money-check-grid">
          {AUDIT_CHECKS.map((check) => (
            <label className="money-check" key={check.key}>
              <input
                type="checkbox"
                checked={audit[check.key] as boolean}
                onChange={(event) =>
                  updateAudit(check.key, event.target.checked)
                }
              />
              <span>{check.label}</span>
            </label>
          ))}
        </div>

        <span className="money-lighthouse-title">LIGHTHOUSE (0–100, opcional)</span>
        <div className="money-lh-grid">
          {LIGHTHOUSE_FIELDS.map((field) => (
            <div className="money-field" key={field.key}>
              <label htmlFor={`audit-${field.key}`}>{field.label}</label>
              <input
                id={`audit-${field.key}`}
                name={`audit-${field.key}`}
                type="number"
                min={0}
                max={100}
                inputMode="numeric"
                value={audit[field.key]}
                onChange={(event) => updateAudit(field.key, event.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="money-field">
          <label htmlFor="audit-notes">Observacoes de usabilidade</label>
          <textarea
            id="audit-notes"
            name="audit-notes"
            value={audit.mobileUsabilityNotes}
            onChange={(event) =>
              updateAudit("mobileUsabilityNotes", event.target.value)
            }
          />
        </div>

        <div className="money-form-actions">
          <button className="money-generate" type="submit">
            Gerar score + artefatos
          </button>
          <button className="money-reset" type="button" onClick={handleReset}>
            Limpar
          </button>
        </div>
      </section>

      {error && (
        <div className="money-form-error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="money-result" aria-label="Artefatos gerados">
          <div className="money-result-score">
            <div className="money-score-hero">
              <strong>{result.score.overall}</strong>
              <span>/100</span>
              <p className="money-priority-badge">{result.score.priorityLabel}</p>
            </div>
            <div className="money-score-grid">
              {scoreDims.map(([label, value]) => (
                <div className="money-score-dim" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <div className="money-score-bar">
                    <div style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="money-tabs" role="tablist" aria-label="Artefatos">
            {TABS.map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`money-tab ${activeTab === tab.key ? "is-active" : ""}`}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="money-artifact" role="tabpanel">
            <pre className="money-markdown">{activeContent}</pre>
          </div>

          <ExportButtons
            briefingJson={result.briefingJson}
            proposalMd={result.proposalMd}
            siteBuildPromptMd={result.siteBuildPromptMd}
          />
        </section>
      )}
    </form>
  );
}
