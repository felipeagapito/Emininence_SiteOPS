import Link from "next/link";

const quoteHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Prime%20Calhas%20e%20quero%20um%20or%C3%A7amento.";

export default function PrimeCalhasDemo() {
  return (
    <main className="demo roof-demo">
      <div className="demo-ribbon">
        <span>MODELO DEMONSTRATIVO • EMINENCE SITEOPS</span>
        <Link href="/">Voltar para SiteOps ↗</Link>
      </div>
      <header className="demo-nav">
        <a className="roof-brand" href="#inicio">
          <span className="roof-mark">P</span>
          <div><strong>PRIME</strong><small>CALHAS &amp; TELHADOS</small></div>
        </a>
        <nav aria-label="Navegação Prime Calhas">
          <a href="#servicos">Serviços</a>
          <a href="#diferenciais">Por que a Prime</a>
          <a href="#regioes">Atendimento</a>
        </nav>
        <a className="roof-cta" href={quoteHref} target="_blank" rel="noreferrer">
          Solicitar orçamento
        </a>
      </header>

      <section className="roof-hero" id="inicio">
        <div className="roof-hero-image" aria-hidden="true" />
        <div className="roof-overlay" aria-hidden="true" />
        <div className="roof-copy">
          <p className="roof-eyebrow">Proteção que começa antes da próxima chuva</p>
          <h1>Seu telhado seguro. Sua casa sem infiltração.</h1>
          <p>
            Calhas, rufos, reparos e impermeabilização com diagnóstico claro,
            execução profissional e garantia por escrito.
          </p>
          <div className="roof-actions">
            <a className="roof-button" href={quoteHref} target="_blank" rel="noreferrer">
              Pedir avaliação pelo WhatsApp ↗
            </a>
            <a className="roof-link" href="#servicos">Conhecer serviços ↓</a>
          </div>
          <div className="roof-proofs">
            <span><strong>+12</strong> anos de experiência</span>
            <span><strong>48h</strong> para primeira vistoria*</span>
            <span><strong>100%</strong> equipe própria</span>
          </div>
        </div>
      </section>

      <section className="roof-alert">
        <span>⚠</span>
        <div><strong>Viu uma mancha no teto?</strong><p>Pequenas infiltrações podem indicar falhas maiores. Envie fotos para uma avaliação inicial.</p></div>
        <a href={quoteHref} target="_blank" rel="noreferrer">Enviar fotos ↗</a>
      </section>

      <section className="roof-section" id="servicos">
        <div className="roof-section-head">
          <p>Serviços essenciais</p>
          <h2>Da causa ao reparo, sem solução improvisada.</h2>
        </div>
        <div className="roof-services">
          {[
            ["01", "Calhas e rufos", "Fabricação sob medida, instalação e correção de caimento."],
            ["02", "Reparo de telhados", "Troca de telhas, vedação, cumeeiras e revisão estrutural."],
            ["03", "Impermeabilização", "Tratamento de lajes, paredes, terraços e pontos críticos."],
            ["04", "Limpeza preventiva", "Remoção de resíduos e revisão antes dos períodos de chuva."],
          ].map(([n, title, text]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p><a href={quoteHref}>Orçar serviço ↗</a></article>
          ))}
        </div>
      </section>

      <section className="roof-difference" id="diferenciais">
        <div className="roof-difference-copy">
          <p>O padrão Prime</p>
          <h2>Você entende o problema antes de aprovar o serviço.</h2>
          <ul>
            <li><span>✓</span> Registro fotográfico dos pontos críticos</li>
            <li><span>✓</span> Orçamento detalhado, sem item escondido</li>
            <li><span>✓</span> Materiais adequados para cada aplicação</li>
            <li><span>✓</span> Limpeza e entrega técnica ao final</li>
          </ul>
        </div>
        <div className="roof-report">
          <span>RELATÓRIO DE VISTORIA</span>
          <div className="report-visual"><i /><i /><i /></div>
          <h3>Diagnóstico do telhado</h3>
          <p>4 pontos avaliados • 2 ações prioritárias</p>
          <div className="report-line"><span>Calhas</span><strong>Revisar</strong></div>
          <div className="report-line"><span>Rufos</span><strong>Regular</strong></div>
          <div className="report-line"><span>Estrutura</span><em>Estável</em></div>
        </div>
      </section>

      <section className="roof-regions" id="regioes">
        <div><p>Atendimento regional</p><h2>Joinville e cidades próximas.</h2></div>
        <p>Atendimento residencial e comercial com agendamento. Consulte disponibilidade para sua região.</p>
        <a className="roof-button" href={quoteHref} target="_blank" rel="noreferrer">Consultar minha região ↗</a>
      </section>

      <footer className="roof-footer">
        <div className="roof-brand"><span className="roof-mark">P</span><div><strong>PRIME</strong><small>CALHAS &amp; TELHADOS</small></div></div>
        <p>Modelo demonstrativo. Informações e indicadores são fictícios.</p>
      </footer>
    </main>
  );
}
