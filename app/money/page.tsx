import Link from "next/link";
import { mockLead } from "../lib/money/lead";
import { mockAudit } from "../lib/money/audit";
import {
  computeCommercialScore,
  mockAuditForScoring,
} from "../lib/money/score";
import { generateBriefing } from "../lib/money/briefing-generator";
import {
  generateProposalFromBriefing,
  renderProposalMarkdown,
  HUMAN_APPROVAL_NOTE,
} from "../lib/money/proposal";

// ---------------------------------------------------------------------------
// Deterministic pipeline — mock data flows through score → briefing → proposal
// ---------------------------------------------------------------------------

const score = computeCommercialScore(mockAuditForScoring);
const briefing = generateBriefing(mockLead, mockAudit, score);
const proposal = generateProposalFromBriefing(briefing);
const proposalMarkdown = renderProposalMarkdown(proposal);

const auditFlags: [string, boolean][] = [
  ["Site existente", mockAudit.websiteExists],
  ["WhatsApp", mockAudit.hasWhatsapp],
  ["CTA principal", mockAudit.hasPrimaryCta],
  ["Formulario", mockAudit.hasContactForm],
  ["Agendamento", mockAudit.hasBookingOrSchedule],
  ["Prova social", mockAudit.hasSocialProof],
  ["SEO local", mockAudit.hasLocalSeoSignals],
  ["Google Maps", mockAudit.hasGoogleMapsEmbed],
];

const scoreDimensions: [string, number][] = [
  ["Presenca digital", score.digitalPresence],
  ["Performance", score.performance],
  ["SEO local", score.localSeo],
  ["Conversao", score.conversion],
  ["Confianca", score.trust],
  ["Urgencia", score.urgency],
];

// ---------------------------------------------------------------------------
// Page — read-only cockpit view using mock data
// ---------------------------------------------------------------------------

export default function MoneyPage() {
  return (
    <main className="money-page">
      <div className="money-nav-bar">
        <span>SITEOPS MONEY ENGINE LITE / COCKPIT</span>
        <Link href="/">Voltar ao sistema</Link>
      </div>

      {/* ── Lead ──────────────────────────────────────────────────────── */}
      <section className="money-header">
        <div className="money-section-label">
          <span>01 / LEAD</span>
          <i />
          <span>DADOS DO NEGOCIO</span>
        </div>
        <h1>{mockLead.businessName}</h1>
        <div className="money-kv-grid">
          {(
            [
              ["Categoria", mockLead.category],
              ["Cidade/UF", `${mockLead.city}/${mockLead.state}`],
              ["WhatsApp", mockLead.whatsapp ?? "—"],
              ["Telefone", mockLead.phone ?? "—"],
              ["Website", mockLead.websiteUrl ?? "—"],
              ["Origem", mockLead.source],
            ] as const
          ).map(([label, value]) => (
            <div className="money-kv" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audit + Score ─────────────────────────────────────────────── */}
      <section className="money-dash">
        <div className="money-audit">
          <div className="money-section-label">
            <span>02 / AUDITORIA</span>
            <i />
            <span>PRESENCA DIGITAL</span>
          </div>

          <div className="money-flag-grid">
            {auditFlags.map(([label, value]) => (
              <div
                className={`money-flag ${value ? "money-flag--ok" : "money-flag--no"}`}
                key={label}
              >
                <span>{label}</span>
                <strong>{value ? "Sim" : "Nao"}</strong>
              </div>
            ))}
          </div>

          <div className="money-lighthouse">
            <span>LIGHTHOUSE</span>
            <div className="money-lighthouse-grid">
              {(
                [
                  ["Performance", mockAudit.performanceScore],
                  ["Acessibilidade", mockAudit.accessibilityScore],
                  ["SEO", mockAudit.seoScore],
                  ["Boas praticas", mockAudit.bestPracticesScore],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value !== null ? value : "—"}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="money-score-panel">
          <div className="money-section-label">
            <span>03 / SCORE</span>
            <i />
            <span>OPORTUNIDADE COMERCIAL</span>
          </div>

          <div className="money-score-hero">
            <strong>{score.overall}</strong>
            <span>/100</span>
            <p className="money-priority-badge">{score.priorityLabel}</p>
          </div>

          <div className="money-score-grid">
            {scoreDimensions.map(([label, value]) => (
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
      </section>

      {/* ── Briefing ──────────────────────────────────────────────────── */}
      <section className="money-section">
        <div className="money-section-label">
          <span>04 / BRIEFING</span>
          <i />
          <span>ARTEFACTO PARA CLAUDE/CODEX</span>
        </div>

        <div className="money-kv-grid">
          <div className="money-kv">
            <span>Projeto</span>
            <strong>{briefing.project.name}</strong>
          </div>
          <div className="money-kv">
            <span>Stack</span>
            <strong>{briefing.project.targetStack}</strong>
          </div>
          <div className="money-kv">
            <span>Entrega</span>
            <strong>{briefing.project.deliveryGoalDays} dias</strong>
          </div>
        </div>

        <h3>Secoes do site</h3>
        <ul className="money-list">
          {briefing.sitePlan.sections.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h3>Problemas identificados</h3>
        <ul className="money-list">
          {briefing.diagnosis.mainProblems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <h3>Oportunidades</h3>
        <ul className="money-list">
          {briefing.diagnosis.opportunities.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      {/* ── Proposal ──────────────────────────────────────────────────── */}
      <section className="money-section">
        <div className="money-section-label">
          <span>05 / PROPOSTA</span>
          <i />
          <span>DIAGNOSTICO COMERCIAL</span>
        </div>
        <pre className="money-markdown">{proposalMarkdown}</pre>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="money-footer">
        <p>{HUMAN_APPROVAL_NOTE}</p>
        <span>Mock data / Pipeline deterministica / Sem IA</span>
      </footer>
    </main>
  );
}
