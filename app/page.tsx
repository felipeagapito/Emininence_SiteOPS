import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  Braces,
  Gauge,
  Layers3,
  Orbit,
  ScanLine,
} from "lucide-react";
import Link from "next/link";
import { ExperienceScene } from "./components/experience-scene";
import { Reveal } from "./components/reveal";

const whatsappHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20quero%20conversar%20sobre%20uma%20experi%C3%AAncia%20digital%20com%20a%20Eminence%20SiteOps.";

const systems = [
  {
    index: "01",
    title: "Prime / Weather System",
    description:
      "Uma experiência técnica para telhados e impermeabilização, com diagnóstico visual, urgência controlada e profundidade 3D.",
    href: "/modelos/prime-calhas",
    className: "case-roof",
    category: "INDUSTRIAL / LOCAL SERVICE",
  },
  {
    index: "02",
    title: "Vetro / Spatial Light",
    description:
      "Portfólio arquitetônico onde vidro, luz e precisão viram linguagem digital — sem aparência de template.",
    href: "/modelos/vetro",
    className: "case-glass",
    category: "ARCHITECTURE / MATERIAL",
  },
];

export default function Home() {
  return (
    <main className="siteops-home">
      <header className="experience-nav">
        <a className="experience-brand" href="#top" aria-label="Eminence SiteOps">
          <span className="brand-orbit" aria-hidden="true">
            <i />
          </span>
          <span>
            <strong>EMINENCE</strong>
            <small>SITEOPS / EXPERIENCE ENGINEERING</small>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#system">Sistema</a>
          <a href="#work">Experiências</a>
          <a href="#stack">Arquitetura</a>
        </nav>
        <Link className="nav-lab-link" href="/studio">
          Abrir Studio
          <ArrowUpRight size={15} />
        </Link>
      </header>

      <section className="experience-hero" id="top">
        <ExperienceScene className="home-scene" mode="siteops" />
        <div className="experience-grid" aria-hidden="true" />
        <div className="hero-noise" aria-hidden="true" />

        <div className="experience-hero-copy">
          <div className="hero-system-label">
            <span>01 / DIGITAL EXPERIENCE SYSTEM</span>
            <span>JOINVILLE — BR</span>
          </div>
          <h1>
            Sites não precisam
            <span>ficar parados.</span>
          </h1>
          <p>
            Estratégia, direção de arte, motion, 3D e IA organizados em um
            sistema para construir experiências digitais que não parecem
            páginas de venda.
          </p>
          <div className="experience-actions">
            <Link href="/studio" className="experience-button">
              Criar uma direção
              <ArrowUpRight size={17} />
            </Link>
            <a href="#work" className="experience-text-link">
              Explorar sistemas <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <aside className="hero-instrument">
          <div className="instrument-head">
            <Orbit size={17} />
            <span>LIVE EXPERIENCE ENGINE</span>
            <i />
          </div>
          <div className="instrument-readout">
            <span>
              <small>MOTION</small>
              <strong>12.42</strong>
            </span>
            <span>
              <small>R3F</small>
              <strong>09.06</strong>
            </span>
            <span>
              <small>MODE</small>
              <strong>ADAPT</strong>
            </span>
          </div>
          <p>Toque na escultura. Mova o ponteiro. A interface responde.</p>
        </aside>

        <div className="hero-coordinate" aria-hidden="true">
          <span>SCENE / 001</span>
          <i />
          <span>27°36&apos;S 48°50&apos;W</span>
        </div>
      </section>

      <div className="kinetic-rail" aria-label="Capacidades da plataforma">
        <div>
          {[...Array(2)].flatMap((_, copy) =>
            ["STRATEGY", "ART DIRECTION", "MOTION SYSTEMS", "REAL-TIME 3D", "AI BLUEPRINTS"].map(
              (item) => (
                <span key={`${copy}-${item}`}>
                  {item}
                  <i>✦</i>
                </span>
              ),
            ),
          )}
        </div>
      </div>

      <section className="system-section" id="system">
        <Reveal className="section-signal">
          <span>01 / THE SYSTEM</span>
          <p>Da ideia à experiência operacional.</p>
        </Reveal>

        <div className="system-manifesto">
          <Reveal>
            <p className="manifesto-mark">“</p>
            <h2>
              Luxo digital não é excesso de efeito. É controle sobre{" "}
              <em>tempo, matéria e atenção.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="manifesto-side">
            <p>
              A SiteOps opera como um atelier técnico: briefing estruturado,
              sistema visual, movimento com função, 3D adaptativo, geração por
              IA e validação antes da publicação.
            </p>
            <div className="manifesto-rule">
              <span>ORIGINAL BY DESIGN</span>
              <i />
              <span>PERFORMANCE BY DEFAULT</span>
            </div>
          </Reveal>
        </div>

        <div className="system-modules">
          {[
            [ScanLine, "01", "Diagnóstico", "Objetivo, público, prova e decisão que a experiência precisa provocar."],
            [Layers3, "02", "Direção", "Composição, tipografia, material e ritmo próprios para cada marca."],
            [Orbit, "03", "Movimento", "Motion e 3D respondem à hierarquia, ao scroll e ao dispositivo."],
            [Gauge, "04", "Gate", "Responsividade, acessibilidade, reduced motion, build e performance."],
          ].map(([Icon, number, title, body], index) => {
            const ModuleIcon = Icon as typeof ScanLine;
            return (
              <Reveal className="system-module" delay={index * 0.06} key={String(number)}>
                <div>
                  <ModuleIcon size={20} strokeWidth={1.4} />
                  <span>{String(number)}</span>
                </div>
                <h3>{String(title)}</h3>
                <p>{String(body)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="work-section" id="work">
        <Reveal className="work-heading">
          <div>
            <span>02 / SELECTED SYSTEMS</span>
            <h2>Duas marcas. Dois mundos.</h2>
          </div>
          <p>
            Não são skins do mesmo template. Cada demonstração muda composição,
            material, ritmo e comportamento sem perder a engenharia comum.
          </p>
        </Reveal>

        <div className="experience-cases">
          {systems.map((system, index) => (
            <Reveal key={system.href} delay={index * 0.08}>
              <Link
                className={`experience-case ${system.className}`}
                href={system.href}
              >
                <div className="case-image" aria-hidden="true">
                  <span>{system.category}</span>
                  <i />
                </div>
                <div className="case-copy">
                  <span>{system.index}</span>
                  <div>
                    <h3>{system.title}</h3>
                    <p>{system.description}</p>
                  </div>
                  <ArrowUpRight size={27} strokeWidth={1.2} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="studio-teaser">
        <div className="studio-teaser-grid" aria-hidden="true" />
        <Reveal className="studio-teaser-copy">
          <span>03 / DIRECTION STUDIO</span>
          <h2>
            Transforme um briefing em um sistema de direção{" "}
            <em>implementável.</em>
          </h2>
          <p>
            Um laboratório que organiza conceito, paleta, hero, mapa de
            experiência, motion, 3D, SEO e truth guard. Funciona localmente e
            ganha geração por IA quando você adiciona um token.
          </p>
          <Link href="/studio">
            Entrar no Studio
            <ArrowUpRight size={17} />
          </Link>
        </Reveal>
        <Reveal className="studio-terminal" delay={0.1}>
          <div>
            <span>BLUEPRINT / 001</span>
            <i />
            <span>STRUCTURED OUTPUT</span>
          </div>
          <pre>
            <code>{`{
  "concept": "Material intelligence",
  "motion": "expressive",
  "threeD": { "enabled": true },
  "truthGuard": ["no fake proof"]
}`}</code>
          </pre>
          <div className="terminal-status">
            <span />
            LOCAL ENGINE READY
          </div>
        </Reveal>
      </section>

      <section className="architecture-section" id="stack">
        <Reveal className="architecture-heading">
          <span>04 / OPEN ARCHITECTURE</span>
          <h2>Ferramentas fortes. Dependência consciente.</h2>
        </Reveal>
        <div className="architecture-grid">
          {[
            [Boxes, "REAL-TIME", "Three.js / React Three Fiber / Drei", "Cenas declarativas, adaptativas e progressivas."],
            [Orbit, "MOTION", "Motion / Lenis / CSS", "Ritmo editorial e feedback com reduced motion."],
            [Braces, "AI", "AI SDK / OpenRouter / Zod", "Provider substituível, saída estruturada e fallback local."],
            [Gauge, "RUNTIME", "Next / Vinext / Cloudflare", "Build validado e deploy na borda."],
          ].map(([Icon, label, title, copy]) => {
            const StackIcon = Icon as typeof Boxes;
            return (
              <Reveal className="architecture-card" key={String(label)}>
                <StackIcon size={22} strokeWidth={1.25} />
                <small>{String(label)}</small>
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal>
          <span>05 / NEXT EXPERIENCE</span>
          <h2>Uma marca memorável merece um sistema que se move com ela.</h2>
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            Iniciar conversa
            <ArrowUpRight size={18} />
          </a>
        </Reveal>
      </section>

      <footer className="experience-footer">
        <a className="experience-brand" href="#top">
          <span className="brand-orbit"><i /></span>
          <span><strong>EMINENCE</strong><small>SITEOPS</small></span>
        </a>
        <p>Experience engineering / Joinville — Brasil</p>
        <span>© 2026 / ORIGINAL BY DESIGN</span>
      </footer>
    </main>
  );
}
