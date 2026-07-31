import type { Metadata } from "next";
import Link from "next/link";
import { ManualEntry } from "./manual-entry";

export const metadata: Metadata = {
  title: "Entrada manual — Money Engine",
};

// ---------------------------------------------------------------------------
// Manual entry — fill Lead + Audit in the browser and derive score, briefing,
// proposal and site-build-prompt locally. Nothing is saved or sent.
// ---------------------------------------------------------------------------

export default function MoneyManualPage() {
  return (
    <main className="money-page">
      <div className="money-nav-bar">
        <span>SITEOPS MONEY ENGINE LITE / ENTRADA MANUAL</span>
        <Link href="/money">Voltar ao cockpit</Link>
      </div>

      <section className="money-header">
        <div className="money-section-label">
          <span>MANUAL</span>
          <i />
          <span>DADOS LOCAIS / SEM PERSISTENCIA</span>
        </div>
        <h1>Entrada manual</h1>
        <p className="money-header-note">
          Preencha Lead e Auditoria para gerar score, briefing, proposta e
          prompt de site no navegador. Nenhum dado e salvo, enviado ou
          publicado.
        </p>
      </section>

      <ManualEntry />

      <footer className="money-footer">
        <p>Pipeline local deterministica — sem IA, sem APIs externas, sem banco.</p>
        <span>Dados descartados ao fechar a pagina</span>
      </footer>
    </main>
  );
}
