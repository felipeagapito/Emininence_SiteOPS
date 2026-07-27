const whatsappHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20quero%20entender%20como%20a%20Eminence%20SiteOps%20pode%20gerar%20mais%20pedidos%20de%20or%C3%A7amento.";

const Arrow = () => <span aria-hidden="true">↗</span>;

const Check = () => (
  <span className="check" aria-hidden="true">
    ✓
  </span>
);

export default function Home() {
  return (
    <main className="siteops">
      <header className="nav-shell">
        <a className="brand" href="#inicio" aria-label="Eminence SiteOps — início">
          <strong>EMINENCE</strong>
          <span>/</span>
          <em>SITEOPS</em>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#modelos">Modelos</a>
          <a href="#inclui">O que inclui</a>
        </nav>
        <a className="nav-cta" href={whatsappHref} target="_blank" rel="noreferrer">
          Falar sobre meu site <Arrow />
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Sites que transformam cliques em orçamentos</p>
          <h1>
            Seu serviço merece vender antes mesmo da{" "}
            <span>primeira conversa.</span>
          </h1>
          <p className="hero-lead">
            Sites premium para prestadores locais, conectados ao WhatsApp e
            construídos para transformar confiança em pedidos de orçamento.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappHref} target="_blank" rel="noreferrer">
              Quero receber mais orçamentos <Arrow />
            </a>
            <a className="button button-secondary" href="#modelos">
              Ver modelos
            </a>
          </div>
          <div className="founder-note">
            <span className="founder-star" aria-hidden="true">✦</span>
            <strong>3 vagas fundadoras</strong>
            <span>•</span>
            <span>a partir de R$ 597</span>
          </div>
        </div>

        <aside className="signal-card" aria-label="Exemplo de resultado operacional">
          <div className="signal-head">
            <div>
              <span>Novos orçamentos</span>
              <small>Últimos 7 dias</small>
            </div>
            <div className="signal-total">
              32 <small>↑ 40%</small>
            </div>
          </div>
          <div className="signal-row">
            <span className="signal-icon">W</span>
            <span>Solicitações via WhatsApp</span>
            <strong>28</strong>
          </div>
          <div className="signal-row">
            <span className="signal-icon">✓</span>
            <span>Orçamentos enviados</span>
            <strong>21</strong>
          </div>
          <div className="signal-row">
            <span className="signal-icon">↗</span>
            <span>Visitas qualificadas</span>
            <strong>146</strong>
          </div>
          <p>Dados demonstrativos para visualizar o potencial da operação.</p>
        </aside>
      </section>

      <section className="trust-strip" aria-label="Benefícios principais">
        <span>Estratégia local</span>
        <span>Entrega em até 72h</span>
        <span>Mobile primeiro</span>
        <span>WhatsApp integrado</span>
      </section>

      <section className="problem section" id="como-funciona">
        <div className="section-kicker">01 / O problema</div>
        <div className="problem-grid">
          <h2>O cliente já está procurando. A pergunta é: ele escolhe você?</h2>
          <div className="problem-copy">
            <p>
              Um perfil no Instagram mostra atividade. Um site bem construído
              transforma essa atividade em confiança, contexto e ação.
            </p>
            <p>
              A SiteOps organiza sua oferta para que o cliente entenda o
              serviço, veja provas e peça orçamento sem depender de uma longa
              conversa inicial.
            </p>
          </div>
        </div>
        <div className="loss-grid">
          <article>
            <span>01</span>
            <h3>Presença fragmentada</h3>
            <p>Fotos, serviços e contato espalhados entre redes e mensagens.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Confiança insuficiente</h3>
            <p>O cliente compara três empresas e escolhe quem parece mais preparado.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Orçamento sem contexto</h3>
            <p>“Quanto custa?” chega sem fotos, local, urgência ou tipo de serviço.</p>
          </article>
        </div>
      </section>

      <section className="models section" id="modelos">
        <div className="section-head">
          <div>
            <div className="section-kicker">02 / Modelos vivos</div>
            <h2>Não imagine. Entre e veja como o seu negócio pode ser percebido.</h2>
          </div>
          <p>
            Dois nichos, duas linguagens visuais e a mesma engenharia de
            conversão: clareza, prova e um próximo passo impossível de ignorar.
          </p>
        </div>

        <div className="model-grid">
          <a className="model-card model-roof" href="/modelos/prime-calhas">
            <div className="model-image">
              <span className="model-tag">Demonstração 01</span>
              <span className="model-open">Abrir site <Arrow /></span>
            </div>
            <div className="model-info">
              <div>
                <small>Telhados • Calhas • Impermeabilização</small>
                <h3>Prime Calhas</h3>
              </div>
              <p>Urgência, segurança e prova técnica para serviços de alto ticket.</p>
            </div>
          </a>

          <a className="model-card model-glass" href="/modelos/vetro">
            <div className="model-image">
              <span className="model-tag">Demonstração 02</span>
              <span className="model-open">Abrir site <Arrow /></span>
            </div>
            <div className="model-info">
              <div>
                <small>Vidraçaria • Box • Esquadrias</small>
                <h3>Vetro</h3>
              </div>
              <p>Acabamento, luz e sofisticação para tornar o portfólio vendável.</p>
            </div>
          </a>
        </div>
        <p className="demo-disclaimer">
          Marcas, números e depoimentos dos modelos são demonstrativos e foram
          criados exclusivamente para apresentar a solução.
        </p>
      </section>

      <section className="process section">
        <div className="section-kicker">03 / Processo</div>
        <div className="process-intro">
          <h2>Da conversa à página no ar. Sem projeto interminável.</h2>
          <p>
            Você conhece o seu serviço. Nós organizamos esse conhecimento em
            uma experiência comercial clara e pronta para ser compartilhada.
          </p>
        </div>
        <ol className="steps">
          <li>
            <span>01</span>
            <div><h3>Diagnóstico</h3><p>Entendemos oferta, cliente ideal, região e principais objeções.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><h3>Direção</h3><p>Definimos mensagem, visual, provas e caminho para o orçamento.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><h3>Construção</h3><p>Montamos a página rápida, responsiva e conectada ao WhatsApp.</p></div>
          </li>
          <li>
            <span>04</span>
            <div><h3>Operação</h3><p>Você recebe a estrutura pronta para divulgar e evoluir.</p></div>
          </li>
        </ol>
      </section>

      <section className="included section" id="inclui">
        <div className="included-top">
          <div>
            <div className="section-kicker">04 / O que inclui</div>
            <h2>Uma base comercial completa — não apenas uma página bonita.</h2>
          </div>
          <div className="included-list">
            {[
              "Copy comercial adaptada ao seu nicho",
              "Design premium e responsivo",
              "Botões e mensagens para WhatsApp",
              "Portfólio e provas de confiança",
              "Estrutura local para Google",
              "Métricas básicas de acesso e clique",
            ].map((item) => (
              <div key={item}><Check /> {item}</div>
            ))}
          </div>
        </div>
        <div className="offer-card">
          <div>
            <span className="offer-label">Condição fundadora</span>
            <h3>Site de orçamento entregue em até 72 horas.</h3>
            <p>
              Para os três primeiros negócios selecionados. Escopo fechado,
              implantação rápida e acompanhamento no primeiro mês.
            </p>
          </div>
          <div className="price">
            <small>a partir de</small>
            <strong>R$ 597</strong>
            <span>ou 2 etapas de R$ 297 + R$ 300</span>
          </div>
          <a className="button button-light" href={whatsappHref} target="_blank" rel="noreferrer">
            Quero uma análise do meu negócio <Arrow />
          </a>
        </div>
      </section>

      <section className="final-cta">
        <p className="eyebrow">Seu próximo cliente pode estar pesquisando agora</p>
        <h2>Vamos construir o site que faz ele parar, confiar e chamar.</h2>
        <a className="button button-primary" href={whatsappHref} target="_blank" rel="noreferrer">
          Falar com a Eminence SiteOps <Arrow />
        </a>
      </section>

      <footer>
        <a className="brand" href="#inicio">
          <strong>EMINENCE</strong><span>/</span><em>SITEOPS</em>
        </a>
        <p>Sites de alta conversão para negócios locais.</p>
        <span>Joinville • Santa Catarina</span>
      </footer>
    </main>
  );
}
