"use client";

import { useState, type FormEvent } from "react";
import { ExportButtons } from "../export-buttons";

// ---------------------------------------------------------------------------
// URL Audit form — client component. Submits to /api/money/audit-url
// for server-side fetch + deterministic extraction. Nothing is persisted.
// ---------------------------------------------------------------------------

type AuditMode = "url" | "html";

type ArtifactTab = "briefing" | "proposal" | "prompt";
const TABS: { key: ArtifactTab; label: string }[] = [
  { key: "briefing", label: "briefing.json" },
  { key: "proposal", label: "proposal.md" },
  { key: "prompt", label: "site-build-prompt.md" },
];

type EvidenceItem = {
  key: string;
  label: string;
  status: "yes" | "partial" | "no" | "unknown";
  evidence: string;
  confidence: string;
};

type CategoryScore = {
  category: string;
  score: number;
  summary: string;
  signals: string[];
};

type AuditReport = {
  url: string;
  categories: CategoryScore[];
  overall: number;
};

type AuditResult = {
  lead: { businessName: string; category: string; city: string; state: string; websiteUrl?: string; email?: string };
  evidence: EvidenceItem[];
  scores: { digitalMaturity: number; commercialOpportunity: number; urgency: number; overallPriority: number; priorityLabel: string };
  briefingJson: string;
  proposalMd: string;
  siteBuildPromptMd: string;
  report?: AuditReport;
};

const STATUS_LABEL: Record<string, string> = {
  yes: "Sim",
  partial: "Parcial",
  no: "Nao",
  unknown: "?",
};

const CATEGORY_LABEL: Record<string, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Acessibilidade",
  conversion: "Conversao",
  stack: "Stack / tecnologia",
  technicalRisk: "Saude tecnica",
};

export function UrlAuditForm() {
  const [mode, setMode] = useState<AuditMode>("url");
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<ArtifactTab>("briefing");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const body: Record<string, string> = {};
    if (mode === "url") body.url = url.trim();
    else body.html = html;
    if (businessName.trim()) body.businessName = businessName.trim();
    if (category.trim()) body.category = category.trim();
    if (city.trim()) body.city = city.trim();
    if (state.trim()) body.state = state.trim();

    try {
      const res = await fetch("/api/money/audit-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error || "Falha ao analisar o site.");
        return;
      }
      setResult(json.data);
    } catch {
      setError("Falha de conexao com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setUrl("");
    setBusinessName("");
    setCategory("");
    setCity("");
    setState("");
    setHtml("");
    setError(null);
    setResult(null);
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
        ["Maturidade digital", result.scores.digitalMaturity],
        ["Oportunidade comercial", result.scores.commercialOpportunity],
        ["Urgencia", result.scores.urgency],
        ["Prioridade final", result.scores.overallPriority],
      ]
    : [];

  return (
    <form className="money-form" onSubmit={handleSubmit}>
      {/* ── Input ───────────────────────────────────────────── */}
      <section className="money-form-col">
        <div className="money-section-label">
          <span>01 / ENTRADA</span>
          <i />
          <span>URL OU HTML</span>
        </div>

        <div className="money-audit-mode-toggle">
          <button
            type="button"
            className={`money-mode-btn ${mode === "url" ? "is-active" : ""}`}
            onClick={() => setMode("url")}
          >
            Buscar por URL
          </button>
          <button
            type="button"
            className={`money-mode-btn ${mode === "html" ? "is-active" : ""}`}
            onClick={() => setMode("html")}
          >
            Colar HTML
          </button>
        </div>

        {mode === "url" ? (
          <div className="money-field">
            <label htmlFor="audit-url">URL do site *</label>
            <input
              id="audit-url"
              name="audit-url"
              type="url"
              placeholder="https://exemplo.com.br"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        ) : (
          <div className="money-field">
            <label htmlFor="audit-html">
              HTML do site (colar codigo fonte completo)
            </label>
            <textarea
              id="audit-html"
              name="audit-html"
              placeholder="<html>...</html>"
              rows={12}
              required
              value={html}
              onChange={(e) => setHtml(e.target.value)}
            />
          </div>
        )}

        <span className="money-lighthouse-title">DADOS OPCIONAIS</span>

        <div className="money-field">
          <label htmlFor="audit-bn">Nome do negocio</label>
          <input
            id="audit-bn"
            name="audit-bn"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="money-field">
          <label htmlFor="audit-cat">Categoria / segmento</label>
          <input
            id="audit-cat"
            name="audit-cat"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="money-lh-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
          <div className="money-field">
            <label htmlFor="audit-city">Cidade</label>
            <input
              id="audit-city"
              name="audit-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="money-field">
            <label htmlFor="audit-state">UF</label>
            <input
              id="audit-state"
              name="audit-state"
              type="text"
              maxLength={2}
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="money-form-actions">
          <button
            className="money-generate"
            type="submit"
            disabled={loading}
          >
            {loading ? "Analisando..." : "Analisar site"}
          </button>
          <button className="money-reset" type="button" onClick={handleReset}>
            Limpar
          </button>
        </div>
      </section>

      {/* ── Results ─────────────────────────────────────────── */}
      {error && (
        <div className="money-form-error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="money-result" aria-label="Resultados da auditoria">
          {/* Lead info */}
          <div className="money-result-score">
            <div>
              <div className="money-kv-grid">
                <div className="money-kv">
                  <span>Negocio</span>
                  <strong>{result.lead.businessName}</strong>
                </div>
                <div className="money-kv">
                  <span>Categoria</span>
                  <strong>{result.lead.category || "—"}</strong>
                </div>
                <div className="money-kv">
                  <span>Cidade/UF</span>
                  <strong>
                    {result.lead.city && result.lead.state
                      ? `${result.lead.city}/${result.lead.state}`
                      : result.lead.city || "—"}
                  </strong>
                </div>
                <div className="money-kv">
                  <span>Site</span>
                  <strong className="money-ellipsis">
                    {result.lead.websiteUrl || "—"}
                  </strong>
                </div>
              </div>

              {/* Dual Score */}
              <div className="money-score-hero">
                <strong>{result.scores.overallPriority}</strong>
                <span>/100</span>
                <p className="money-priority-badge">{result.scores.priorityLabel}</p>
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
          </div>

          {/* Evidence grid */}
          <div className="money-section" style={{ padding: "36px clamp(18px, 5vw, 95px)" }}>
            <div className="money-section-label">
              <span>EVIDENCIAS</span>
              <i />
              <span>SINAIS EXTRAIDOS DO HTML</span>
            </div>
            <div className="money-evidence-grid">
              {result.evidence.map((ev) => (
                <div
                  className={`money-evidence-chip money-evidence-chip--${ev.status}`}
                  key={ev.key}
                  title={ev.evidence}
                >
                  <span className="money-evidence-label">{ev.label}</span>
                  <span className={`money-evidence-status money-evidence-status--${ev.status}`}>
                    {STATUS_LABEL[ev.status]}
                  </span>
                  <span className="money-evidence-confidence">{ev.confidence}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category report */}
          {result.report && (
            <div
              className="money-section"
              style={{ padding: "36px clamp(18px, 5vw, 95px)" }}
            >
              <div className="money-section-label">
                <span>RELATORIO EXECUTIVO</span>
                <i />
                <span>SCORE POR CATEGORIA</span>
              </div>
              <div className="money-score-hero">
                <strong>{result.report.overall}</strong>
                <span>/100</span>
                <p className="money-priority-badge">Nota geral do site</p>
              </div>
              <div className="money-score-grid">
                {result.report.categories.map((cat) => (
                  <div className="money-score-dim" key={cat.category}>
                    <span>{CATEGORY_LABEL[cat.category] || cat.category}</span>
                    <strong>{cat.score}</strong>
                    <div className="money-score-bar">
                      <div style={{ width: `${cat.score}%` }} />
                    </div>
                    <small className="money-category-summary">
                      {cat.summary}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artifacts */}
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
