"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Download,
  LoaderCircle,
  Orbit,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ExperienceScene } from "../components/experience-scene";
import type { SiteBlueprint, SiteBrief } from "../lib/blueprint";

const initialBrief: SiteBrief = {
  brand: "Atelier Norte",
  segment: "Arquitetura residencial contemporânea",
  objective:
    "Apresentar projetos com profundidade e transformar interesse em conversas qualificadas.",
  audience:
    "Pessoas que valorizam arquitetura autoral, precisão e acompanhamento próximo.",
  personality: ["precisa", "silenciosa", "material"],
  references: "Ritmo editorial, luz natural, engenharia de alta precisão.",
  proof: "Portfólio real, processo documentado e equipe técnica.",
  motionLevel: "expressive",
  use3d: true,
};

function localBlueprint(brief: SiteBrief, lens: string): SiteBlueprint {
  const palettes: Record<string, SiteBlueprint["palette"]> = {
    relogio: [
      { name: "Obsidian", hex: "#090a0c", role: "Fundo" },
      { name: "Mineral", hex: "#e9e4d8", role: "Texto" },
      { name: "Bronze", hex: "#b88a52", role: "Sinal" },
      { name: "Smoke", hex: "#4a4d50", role: "Estrutura" },
    ],
    performance: [
      { name: "Carbon", hex: "#07090d", role: "Fundo" },
      { name: "Signal", hex: "#ff4d20", role: "Ação" },
      { name: "Ice", hex: "#dff5ff", role: "Texto" },
      { name: "Cobalt", hex: "#0754ff", role: "Profundidade" },
    ],
    fronteira: [
      { name: "Deep Space", hex: "#040710", role: "Fundo" },
      { name: "Ion", hex: "#22b8ff", role: "Sinal" },
      { name: "Plasma", hex: "#965cff", role: "Contraste" },
      { name: "Cloud", hex: "#eef7ff", role: "Texto" },
    ],
  };
  const palette = palettes[lens] ?? palettes.fronteira;

  return {
    concept:
      lens === "relogio"
        ? "Precisão em silêncio"
        : lens === "performance"
          ? "Energia sob controle"
          : "Cartografia do impossível",
    thesis: `${brief.brand} deve ser percebida como ${brief.personality.join(
      ", ",
    )}. A experiência transforma ${brief.segment.toLowerCase()} em um sistema visual vivo, sem depender de fórmulas de landing page.`,
    palette,
    typography: {
      display: lens === "relogio" ? "Cormorant Garamond" : "Geist Sans",
      text: "Geist Sans",
      rationale:
        "Contraste entre presença editorial e leitura técnica para equilibrar emoção e precisão.",
    },
    hero: {
      eyebrow: `${brief.segment.toUpperCase()} / SISTEMA AUTORAL`,
      headline:
        lens === "relogio"
          ? "O detalhe muda tudo."
          : lens === "performance"
            ? "Forma em movimento."
            : "Construa o que ainda não existe.",
      subhead: brief.objective,
      interaction: brief.use3d
        ? "Escultura abstrata reage ao ponteiro; o conteúdo permanece legível sem WebGL."
        : "Tipografia cinética e linhas de precisão respondem ao scroll.",
    },
    sections: [
      {
        name: "Manifesto",
        purpose: "Fixar a tese da marca antes de vender serviços.",
        visual: "Grande escala, silêncio e uma frase por viewport.",
      },
      {
        name: "Matéria",
        purpose: "Transformar processo e portfólio em prova verificável.",
        visual: "Recortes, detalhes, legenda técnica e ritmo assimétrico.",
      },
      {
        name: "Sistema",
        purpose: "Explicar como a marca trabalha sem virar lista de cards.",
        visual: "Sequência numerada com transições de estado.",
      },
      {
        name: "Conversa",
        purpose: "Abrir o próximo passo com contexto suficiente.",
        visual: "CTA único, calmo e específico.",
      },
    ],
    motion: {
      language:
        brief.motionLevel === "cinematic"
          ? "Cinemática lenta, progressiva e responsiva ao scroll."
          : brief.motionLevel === "expressive"
            ? "Entradas editoriais e resposta sutil ao ponteiro."
            : "Microinterações essenciais e transições curtas.",
      rules: [
        "Conteúdo essencial nunca espera pela animação.",
        "Respeitar prefers-reduced-motion.",
        "Uma ação dominante por viewport.",
      ],
    },
    threeD: brief.use3d
      ? {
          enabled: true,
          concept: "Objeto generativo abstrato construído em Three.js.",
          fallback: "Gradiente material e imagem estática no mesmo enquadramento.",
        }
      : null,
    seo: {
      title: `${brief.brand} — ${brief.segment}`,
      description: brief.objective.slice(0, 155),
    },
    truthGuard: [
      "Usar apenas projetos e provas fornecidos pela marca.",
      "Não inventar métricas, clientes, prêmios ou garantias.",
      "Marcar todo conteúdo conceitual como demonstração.",
    ],
  };
}

export function StudioClient() {
  const [brief, setBrief] = useState(initialBrief);
  const [lens, setLens] = useState("fronteira");
  const [blueprint, setBlueprint] = useState<SiteBlueprint>(() =>
    localBlueprint(initialBrief, "fronteira"),
  );
  const [aiConfigured, setAiConfigured] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("LOCAL ENGINE / READY");

  useEffect(() => {
    fetch("/api/ai/status")
      .then((response) => response.json())
      .then((data) => {
        setAiConfigured(Boolean(data.configured));
        setMessage(data.configured ? "OPENROUTER / ONLINE" : "LOCAL ENGINE / READY");
      })
      .catch(() => setMessage("LOCAL ENGINE / READY"));
  }, []);

  const accent = useMemo(
    () => blueprint.palette.find((color) => color.role !== "Fundo")?.hex ?? "#22b8ff",
    [blueprint],
  );

  const update = <K extends keyof SiteBrief>(key: K, value: SiteBrief[K]) =>
    setBrief((current) => ({ ...current, [key]: value }));

  async function generate(event: FormEvent) {
    event.preventDefault();
    setWorking(true);
    setMessage(aiConfigured ? "GENERATING / REMOTE" : "GENERATING / LOCAL");

    try {
      if (aiConfigured) {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(brief),
        });
        if (!response.ok) throw new Error("remote generation failed");
        const data = (await response.json()) as { blueprint: SiteBlueprint };
        setBlueprint(data.blueprint);
        setMessage("BLUEPRINT / AI GENERATED");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 420));
        setBlueprint(localBlueprint(brief, lens));
        setMessage("BLUEPRINT / LOCAL GENERATED");
      }
    } catch {
      setBlueprint(localBlueprint(brief, lens));
      setMessage("REMOTE FAILED / LOCAL FALLBACK");
    } finally {
      setWorking(false);
    }
  }

  function downloadBlueprint() {
    const blob = new Blob([JSON.stringify({ brief, blueprint }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${brief.brand.toLowerCase().replace(/\s+/g, "-")}-blueprint.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyHandoff() {
    await navigator.clipboard.writeText(
      `Leia CLAUDE.md e brain/00_INDEX.md. Implemente este blueprint sem copiar as referências. Preserve truth guard, reduced motion, fallback sem WebGL e gates de qualidade.\n\n${JSON.stringify(
        { brief, blueprint },
        null,
        2,
      )}`,
    );
    setMessage("CLAUDE HANDOFF / COPIED");
  }

  return (
    <main className="studio-page">
      <header className="studio-nav">
        <Link href="/" aria-label="Voltar à Eminence SiteOps">
          <ArrowLeft size={15} />
          EMINENCE / SITEOPS
        </Link>
        <div>
          <span className={aiConfigured ? "online" : ""} />
          {message}
        </div>
        <button onClick={downloadBlueprint} type="button">
          <Download size={15} />
          Blueprint
        </button>
      </header>

      <div className="studio-shell">
        <form className="studio-controls" onSubmit={generate}>
          <div className="studio-panel-head">
            <span>01 / BRIEF</span>
            <strong>DIRECTION INPUT</strong>
          </div>

          <label>
            Marca
            <input
              value={brief.brand}
              onChange={(event) => update("brand", event.target.value)}
              required
            />
          </label>
          <label>
            Segmento
            <input
              value={brief.segment}
              onChange={(event) => update("segment", event.target.value)}
              required
            />
          </label>
          <label>
            Objetivo
            <textarea
              value={brief.objective}
              onChange={(event) => update("objective", event.target.value)}
              required
            />
          </label>
          <label>
            Público
            <textarea
              value={brief.audience}
              onChange={(event) => update("audience", event.target.value)}
              required
            />
          </label>

          <fieldset>
            <legend>Quality lens</legend>
            <div className="lens-grid">
              {[
                ["relogio", "Relojoaria"],
                ["performance", "Performance"],
                ["fronteira", "Fronteira"],
              ].map(([value, label]) => (
                <button
                  className={lens === value ? "active" : ""}
                  key={value}
                  onClick={() => setLens(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Motion</legend>
            <div className="motion-grid">
              {[
                ["essential", "Essencial"],
                ["expressive", "Expressivo"],
                ["cinematic", "Cinemático"],
              ].map(([value, label]) => (
                <button
                  className={brief.motionLevel === value ? "active" : ""}
                  key={value}
                  onClick={() =>
                    update("motionLevel", value as SiteBrief["motionLevel"])
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="switch-row">
            <span>
              <Orbit size={16} />
              Cena 3D adaptativa
            </span>
            <input
              checked={brief.use3d}
              onChange={(event) => update("use3d", event.target.checked)}
              type="checkbox"
            />
          </label>

          <button className="studio-generate" disabled={working} type="submit">
            {working ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Sparkles size={17} />
            )}
            Gerar direção
            <ArrowUpRight size={16} />
          </button>
          <p className="studio-provider-note">
            {aiConfigured
              ? "IA ativa. A saída passa por schema e truth guard."
              : "Sem token: motor local ativo. Adicione OpenRouter no .env para IA."}
          </p>
        </form>

        <section className="studio-canvas" style={{ "--studio-accent": accent } as React.CSSProperties}>
          <div className="canvas-toolbar">
            <span>02 / LIVE ARTBOARD</span>
            <div>
              <Play size={12} fill="currentColor" />
              INTERACTIVE
            </div>
          </div>
          <div
            className="artboard"
            style={{ backgroundColor: blueprint.palette[0]?.hex ?? "#040710" }}
          >
            {brief.use3d && <ExperienceScene mode="siteops" className="studio-scene" />}
            <div className="artboard-grid" aria-hidden="true" />
            <div className="artboard-brand">{brief.brand.toUpperCase()}</div>
            <div className="artboard-copy">
              <span>{blueprint.hero.eyebrow}</span>
              <h1>{blueprint.hero.headline}</h1>
              <p>{blueprint.hero.subhead}</p>
              <button type="button">
                Explorar sistema
                <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="artboard-meta">
              <span>{blueprint.concept}</span>
              <span>SCENE / 001</span>
            </div>
          </div>
        </section>

        <aside className="studio-output">
          <div className="studio-panel-head">
            <span>03 / BLUEPRINT</span>
            <strong>STRUCTURED OUTPUT</strong>
          </div>
          <section>
            <small>CONCEPT</small>
            <h2>{blueprint.concept}</h2>
            <p>{blueprint.thesis}</p>
          </section>
          <section>
            <small>PALETTE</small>
            <div className="palette-row">
              {blueprint.palette.map((color) => (
                <span
                  key={color.hex}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} ${color.hex}`}
                />
              ))}
            </div>
          </section>
          <section>
            <small>EXPERIENCE MAP</small>
            <ol className="blueprint-map">
              {blueprint.sections.map((section, index) => (
                <li key={section.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{section.name}</strong>
                    <p>{section.purpose}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="truth-card">
            <small>
              <Check size={13} /> TRUTH GUARD
            </small>
            {blueprint.truthGuard.map((rule) => (
              <p key={rule}>{rule}</p>
            ))}
          </section>
          <button className="handoff-button" onClick={copyHandoff} type="button">
            <Bot size={16} />
            Copiar handoff para Claude
            <Copy size={14} />
          </button>
        </aside>
      </div>
    </main>
  );
}
