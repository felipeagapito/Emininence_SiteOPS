import type { Metadata } from "next";
import Link from "next/link";
import { UrlAuditForm } from "./url-audit-form";

export const metadata: Metadata = {
  title: "Auditoria por URL — Money Engine",
};

// ---------------------------------------------------------------------------
// URL audit — automated deterministic signal extraction from a public website.
// The server-side fetch + extraction happens in the API route; this page
// provides the client form and renders the results.
// ---------------------------------------------------------------------------

export default function MoneyAuditPage() {
  return (
    <main className="money-page">
      <div className="money-nav-bar">
        <span>SITEOPS MONEY ENGINE LITE / AUDITORIA POR URL</span>
        <Link href="/money">Voltar ao cockpit</Link>
      </div>

      <section className="money-header">
        <div className="money-section-label">
          <span>AUDITORIA</span>
          <i />
          <span>EXTRACAO DETERMINISTICA DE SINAIS</span>
        </div>
        <h1>Auditoria por URL</h1>
        <p className="money-header-note">
          Informe a URL do site para coleta de sinais publicos via servidor.
          O sistema extrai evidencias deterministicas (telefone, email, WhatsApp,
          formulario, erros tecnicos, etc.) e gera score, briefing, proposta e
          prompt. Sem IA, sem persistencia, sem scraping em massa.
        </p>
      </section>

      <UrlAuditForm />

      <footer className="money-footer">
        <p>
          Diagnostico automatico requer revisao humana antes de abordagem
          comercial. Nenhum dado e salvo, enviado ou publicado.
        </p>
        <span>Pipeline local deterministica — sem IA, sem APIs externas, sem banco.</span>
      </footer>
    </main>
  );
}
