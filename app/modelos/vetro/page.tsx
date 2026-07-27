import Link from "next/link";

const quoteHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Vetro%20e%20quero%20um%20or%C3%A7amento.";

export default function VetroDemo() {
  return (
    <main className="demo glass-demo">
      <div className="demo-ribbon glass-ribbon">
        <span>MODELO DEMONSTRATIVO • EMINENCE SITEOPS</span>
        <Link href="/">Voltar para SiteOps ↗</Link>
      </div>
      <header className="glass-nav">
        <a className="glass-brand" href="#inicio" aria-label="Vetro — início">VETRO<span>°</span></a>
        <nav aria-label="Navegação Vetro">
          <a href="#solucoes">Soluções</a>
          <a href="#projetos">Projetos</a>
          <a href="#processo">Processo</a>
        </nav>
        <a className="glass-cta" href={quoteHref} target="_blank" rel="noreferrer">
          Iniciar projeto ↗
        </a>
      </header>

      <section className="glass-hero" id="inicio">
        <div className="glass-hero-image" aria-hidden="true" />
        <div className="glass-overlay" aria-hidden="true" />
        <div className="glass-copy">
          <p>Vidros e esquadrias sob medida</p>
          <h1>Mais luz.<br />Menos limites.</h1>
          <div className="glass-copy-bottom">
            <p>
              Projetos que combinam precisão, transparência e acabamento para
              transformar a relação entre interior e arquitetura.
            </p>
            <a href={quoteHref} target="_blank" rel="noreferrer">Solicitar orçamento <span>↗</span></a>
          </div>
        </div>
        <div className="glass-index"><span>01</span><i /><small>RESIDENCIAL</small></div>
      </section>

      <section className="glass-statement">
        <p>Do primeiro traço à instalação</p>
        <h2>O vidro certo não ocupa o espaço. Ele revela.</h2>
        <div>
          <p>
            Medimos, especificamos e instalamos cada peça para que estrutura,
            transparência e movimento funcionem como um único elemento.
          </p>
          <a href="#solucoes">Explorar soluções ↓</a>
        </div>
      </section>

      <section className="glass-solutions" id="solucoes">
        {[
          ["01", "Box & banho", "Leveza visual, ferragens selecionadas e instalação precisa."],
          ["02", "Esquadrias", "Grandes vãos, vedação e desempenho para projetos contemporâneos."],
          ["03", "Guarda-corpos", "Segurança normatizada com interferência visual mínima."],
          ["04", "Espelhos", "Recortes, iluminação e composição sob medida para cada ambiente."],
        ].map(([n, title, text]) => (
          <article key={n}>
            <span>{n}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
            <a href={quoteHref} aria-label={`Solicitar orçamento de ${title}`}>↗</a>
          </article>
        ))}
      </section>

      <section className="glass-project" id="projetos">
        <div className="glass-project-visual" aria-hidden="true"><span>PROJETO 01 / RESIDENCIAL</span></div>
        <div className="glass-project-copy">
          <p>Um projeto, três decisões certas</p>
          <h2>Medida exata. Material adequado. Instalação limpa.</h2>
          <div className="glass-metrics">
            <span><strong>10 mm</strong>vidro temperado</span>
            <span><strong>32 m²</strong>área instalada</span>
            <span><strong>2 dias</strong>instalação</span>
          </div>
          <a href={quoteHref} target="_blank" rel="noreferrer">Quero avaliar meu projeto ↗</a>
        </div>
      </section>

      <section className="glass-process" id="processo">
        <div><p>Nosso processo</p><h2>Clareza em cada etapa.</h2></div>
        <ol>
          <li><span>01</span><strong>Conversa e referências</strong></li>
          <li><span>02</span><strong>Medição técnica</strong></li>
          <li><span>03</span><strong>Produção sob medida</strong></li>
          <li><span>04</span><strong>Instalação e revisão</strong></li>
        </ol>
      </section>

      <section className="glass-final">
        <p>Seu espaço pede outra perspectiva.</p>
        <h2>Vamos desenhar a solução certa?</h2>
        <a href={quoteHref} target="_blank" rel="noreferrer">Iniciar conversa ↗</a>
      </section>

      <footer className="glass-footer">
        <span className="glass-brand">VETRO<span>°</span></span>
        <p>Modelo demonstrativo. Informações e indicadores são fictícios.</p>
      </footer>
    </main>
  );
}
