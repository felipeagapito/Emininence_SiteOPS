import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Camera,
  CloudRain,
  FileCheck2,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { ExperienceScene } from "../../components/experience-scene";
import { Reveal } from "../../components/reveal";

const quoteHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20vim%20pelo%20modelo%20Prime%20e%20quero%20avaliar%20meu%20telhado.";

export default function PrimeCalhasDemo() {
  return (
    <main className="roof-experience">
      <div className="demo-lab-bar">
        <span>EMINENCE SITEOPS / LIVE MODEL 01</span>
        <Link href="/">
          <ArrowLeft size={14} />
          Voltar ao sistema
        </Link>
      </div>

      <header className="roof-nav">
        <a className="prime-identity" href="#top">
          <span>P</span>
          <div>
            <strong>PRIME</strong>
            <small>PROTEÇÃO DE COBERTURAS</small>
          </div>
        </a>
        <nav aria-label="Navegação Prime">
          <a href="#diagnostico">Diagnóstico</a>
          <a href="#sistema">Sistema</a>
          <a href="#processo">Processo</a>
        </nav>
        <a className="roof-nav-cta" href={quoteHref} target="_blank" rel="noreferrer">
          Solicitar avaliação
          <ArrowUpRight size={15} />
        </a>
      </header>

      <section className="roof-hero-new" id="top">
        <div className="roof-atmosphere" aria-hidden="true" />
        <div className="roof-blueprint-grid" aria-hidden="true" />
        <ExperienceScene className="roof-scene" mode="roof" />

        <div className="roof-hero-copy">
          <div className="roof-hero-label">
            <CloudRain size={17} />
            <span>PREVENÇÃO / DIAGNÓSTICO / EXECUÇÃO</span>
          </div>
          <h1>
            A chuva mostra o problema.
            <span>A engenharia encontra a causa.</span>
          </h1>
          <p>
            Inspeção visual, registro dos pontos críticos e uma solução
            explicada antes de qualquer serviço em telhados, calhas e
            impermeabilização.
          </p>
          <div className="roof-hero-actions">
            <a href={quoteHref} target="_blank" rel="noreferrer">
              Enviar fotos para avaliação
              <ArrowUpRight size={17} />
            </a>
            <a href="#diagnostico">
              Ver como funciona
              <ArrowDown size={16} />
            </a>
          </div>
        </div>

        <aside className="weather-instrument">
          <div>
            <CloudRain size={16} />
            <span>WEATHER READINESS</span>
            <i />
          </div>
          <strong>INSPECIONE ANTES</strong>
          <p>
            Mancha, goteira ou calha transbordando são sintomas. O orçamento
            correto começa pela causa.
          </p>
          <div className="weather-scale">
            {[...Array(8)].map((_, index) => <i key={index} />)}
          </div>
          <small>CONTEÚDO DEMONSTRATIVO / SEM DADOS REAIS</small>
        </aside>
      </section>

      <section className="roof-diagnostic" id="diagnostico">
        <Reveal className="roof-section-index">
          <span>01 / DIAGNÓSTICO</span>
          <i />
          <span>CAUSE BEFORE COST</span>
        </Reveal>
        <div className="roof-diagnostic-grid">
          <Reveal>
            <h2>Orçamento sem diagnóstico é apenas um palpite.</h2>
          </Reveal>
          <Reveal className="roof-diagnostic-copy" delay={0.08}>
            <p>
              A cobertura funciona como um sistema. Telha, inclinação, rufo,
              calha, vedação e escoamento interferem uns nos outros. Trocar só o
              ponto visível pode esconder a causa e fazer a infiltração voltar.
            </p>
            <a href="#sistema">
              Ler o sistema
              <ArrowDown size={15} />
            </a>
          </Reveal>
        </div>

        <div className="scan-console">
          <div className="scan-image">
            <div className="scan-line" />
            <span>VISUAL SCAN / DEMO</span>
            <i className="scan-point scan-point-a" />
            <i className="scan-point scan-point-b" />
            <i className="scan-point scan-point-c" />
          </div>
          <div className="scan-readout">
            <span>INSPECTION MAP / 001</span>
            {[
              ["A", "Entrada de água", "Verificar encontro e vedação"],
              ["B", "Fluxo de calha", "Conferir seção e inclinação"],
              ["C", "Ponto de descarga", "Avaliar capacidade e destino"],
            ].map(([code, title, copy]) => (
              <div key={code}>
                <strong>{code}</strong>
                <span><b>{title}</b><small>{copy}</small></span>
              </div>
            ))}
            <p>Mapa ilustrativo. Toda avaliação real exige evidência do local.</p>
          </div>
        </div>
      </section>

      <section className="roof-system" id="sistema">
        <Reveal className="roof-system-heading">
          <span>02 / PROTECTION SYSTEM</span>
          <h2>Uma cobertura protegida é uma sequência de decisões certas.</h2>
        </Reveal>
        <div className="roof-service-grid">
          {[
            [ScanLine, "01", "Inspeção", "Leitura dos sintomas, registro e identificação dos pontos críticos."],
            [CloudRain, "02", "Escoamento", "Dimensionamento e correção de calhas, condutores e descargas."],
            [ShieldCheck, "03", "Vedação", "Rufos, encontros e impermeabilização tratados como sistema."],
            [FileCheck2, "04", "Registro", "Escopo explicado com fotos, prioridade e limites do serviço."],
          ].map(([Icon, number, title, copy], index) => {
            const ServiceIcon = Icon as typeof ScanLine;
            return (
              <Reveal className="roof-service" delay={index * 0.06} key={String(number)}>
                <ServiceIcon size={23} strokeWidth={1.35} />
                <span>{String(number)}</span>
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="roof-process" id="processo">
        <Reveal className="roof-process-intro">
          <span>03 / FIELD PROCESS</span>
          <h2>Do primeiro registro à solução explicada.</h2>
        </Reveal>
        <ol>
          {[
            ["01", "Envie o contexto", "Fotos, local, urgência e quando o problema aparece."],
            ["02", "Triagem técnica", "Organizamos sintomas e definimos o que precisa ser visto no local."],
            ["03", "Inspeção", "Os pontos críticos são avaliados e documentados."],
            ["04", "Plano de ação", "Você recebe escopo, prioridade e próximos passos."],
          ].map(([number, title, copy]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="roof-final-new">
        <div className="roof-final-image" aria-hidden="true" />
        <Reveal>
          <Camera size={24} strokeWidth={1.25} />
          <span>COMECE PELA EVIDÊNCIA</span>
          <h2>Registre o problema antes que a próxima chuva mude a cena.</h2>
          <a href={quoteHref} target="_blank" rel="noreferrer">
            Enviar fotos para avaliação
            <ArrowUpRight size={17} />
          </a>
          <small>
            PRIME é uma marca demonstrativa criada pela Eminence SiteOps.
          </small>
        </Reveal>
      </section>
    </main>
  );
}
