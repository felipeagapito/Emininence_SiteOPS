import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Maximize2,
  MoveDiagonal2,
} from "lucide-react";
import Link from "next/link";
import { ExperienceScene } from "../../components/experience-scene";
import { Reveal } from "../../components/reveal";

const quoteHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20vim%20pelo%20modelo%20Vetro%20e%20quero%20conversar%20sobre%20um%20projeto.";

export default function VetroDemo() {
  return (
    <main className="vetro-experience">
      <div className="vetro-lab-bar">
        <span>EMINENCE SITEOPS / LIVE MODEL 02</span>
        <Link href="/">
          <ArrowLeft size={14} />
          Voltar ao sistema
        </Link>
      </div>

      <header className="vetro-nav">
        <a className="vetro-identity" href="#top">
          VETRO<sup>°</sup>
        </a>
        <nav aria-label="Navegação Vetro">
          <a href="#manifesto">Manifesto</a>
          <a href="#material">Material</a>
          <a href="#processo">Processo</a>
        </nav>
        <a href={quoteHref} target="_blank" rel="noreferrer">
          Iniciar projeto
          <ArrowUpRight size={15} />
        </a>
      </header>

      <section className="vetro-hero-new" id="top">
        <div className="vetro-light" aria-hidden="true" />
        <ExperienceScene className="vetro-scene" mode="glass" />
        <div className="vetro-hero-index">
          <span>01</span>
          <i />
          <span>MATTER / LIGHT / SPACE</span>
        </div>

        <div className="vetro-hero-copy">
          <small>VIDRO ARQUITETÔNICO SOB MEDIDA</small>
          <h1>
            A luz entra.
            <em>O limite desaparece.</em>
          </h1>
          <div className="vetro-hero-bottom">
            <p>
              Soluções em vidro e esquadrias desenhadas para ampliar espaço,
              preservar leveza e terminar a arquitetura com precisão.
            </p>
            <a href={quoteHref} target="_blank" rel="noreferrer">
              Conversar sobre o espaço
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <a className="vetro-scroll" href="#manifesto">
          <span>EXPLORE</span>
          <ArrowDown size={16} />
        </a>
      </section>

      <section className="vetro-manifesto" id="manifesto">
        <Reveal className="vetro-section-index">
          <span>01 / MANIFESTO</span>
          <i />
          <span>TRANSPARENCY WITH PURPOSE</span>
        </Reveal>
        <Reveal className="vetro-manifesto-copy">
          <h2>
            O melhor vidro não chama atenção para si.
            <em>Ele muda a forma como o espaço é sentido.</em>
          </h2>
          <div>
            <p>
              Cada medida, espessura, ferragem e encontro interfere na luz, no
              conforto e no uso. Por isso, a solução começa na arquitetura — não
              no catálogo.
            </p>
            <a href="#material">
              Explorar materialidade
              <ArrowDown size={15} />
            </a>
          </div>
        </Reveal>
      </section>

      <section className="vetro-material" id="material">
        <div className="vetro-material-image">
          <span>REFRACTION STUDY / 01</span>
          <i />
        </div>
        <div className="vetro-material-copy">
          <Reveal>
            <span>02 / MATERIAL</span>
            <h2>Precisão que você quase não vê — mas sente.</h2>
            <p>
              Transparência não elimina estrutura. Ela exige que cada encontro
              seja resolvido com ainda mais cuidado.
            </p>
          </Reveal>
          <div className="material-specs">
            {[
              ["01", "Medida", "Leitura precisa do vão, prumo, nível e interferências."],
              ["02", "Matéria", "Vidro, perfis e ferragens definidos pelo uso real."],
              ["03", "Encontro", "Detalhes pensados para continuidade visual e segurança."],
            ].map(([number, title, copy], index) => (
              <Reveal delay={index * 0.06} key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="vetro-applications">
        <Reveal className="vetro-applications-head">
          <span>03 / APPLICATIONS</span>
          <h2>O material muda. A precisão permanece.</h2>
        </Reveal>
        <div className="application-grid">
          {[
            ["01", "Divisórias", "Leveza visual para separar sem encerrar."],
            ["02", "Fachadas", "Ritmo, proteção e continuidade arquitetônica."],
            ["03", "Guarda-corpos", "Segurança integrada à linguagem do espaço."],
            ["04", "Interiores", "Box, espelhos e detalhes com medida e acabamento."],
          ].map(([number, title, copy], index) => (
            <Reveal className="application-card" delay={index * 0.05} key={number}>
              <span>{number}</span>
              {index % 2 === 0 ? <Maximize2 size={21} /> : <MoveDiagonal2 size={21} />}
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="vetro-process" id="processo">
        <Reveal className="vetro-process-title">
          <span>04 / PROCESS</span>
          <h2>Do espaço existente ao detalhe instalado.</h2>
        </Reveal>
        <ol>
          {[
            ["01", "Leitura", "Entendemos arquitetura, uso e intenção."],
            ["02", "Definição", "Escolhemos sistema, vidro e acabamento."],
            ["03", "Precisão", "Conferimos medidas e detalhes de encontro."],
            ["04", "Instalação", "Executamos com proteção e revisão final."],
          ].map(([number, title, copy]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="vetro-final-new">
        <div className="vetro-final-visual" aria-hidden="true" />
        <Reveal>
          <span>VETRO / PROJECT INQUIRY</span>
          <h2>Quando o detalhe é certo, o limite quase desaparece.</h2>
          <a href={quoteHref} target="_blank" rel="noreferrer">
            Iniciar conversa
            <ArrowUpRight size={17} />
          </a>
          <small>VETRO é uma marca demonstrativa criada pela Eminence SiteOps.</small>
        </Reveal>
      </section>
    </main>
  );
}
