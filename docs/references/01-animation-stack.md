# 01 — Stack de animação do Eminence SiteOps

> Alinhado com `brain/04_MOTION_3D.md` e o orçamento de motion do `CLAUDE.md`:
> entradas 300–800 ms, feedback 120–260 ms, cap de DPR, `prefers-reduced-motion`
> preservado, 3D decorativo e progressivo.

## Decisão

| Camada | Ferramenta | Status |
|---|---|---|
| Microinterações e entradas | **Motion** (`motion@12.42.2`) | ✅ já no runtime |
| Scroll de landing/campanhas | **Lenis** (`lenis@1.3.25`) | ✅ já no runtime, uso seletivo |
| Componentes decorativos animados | Magic UI (MIT) | 🔎 referência controlada |
| Animate UI / React Bits | — | ⛔ **não copiar** (Commons Clause) |

**Princípio:** animação serve ao conceito e à hierarquia — não ao efeito. O
dashboard operacional (auditoria, scores, propostas) é ferramenta de trabalho:
**sem excesso de animação**.

## Motion — microinterações (sempre)

Usar `motion/react` para:

- **Entradas** de seções/cards em landing e páginas de marketing: 300–800 ms,
  com easing suave (ex.: `[0.22, 1, 0.36, 1]`), sem dependência de scroll.
- **Feedback** em ações do produto (hover em cards, foco, estados de botão):
  120–260 ms. Nada mais rápido que 120 ms parece "grátis"; nada mais lento que
  260 ms em feedback parece travado.
- **Estado** (presença/ausência): `AnimatePresence` para modais, toasts,
  expansão de painéis no cockpit.

Regras de uso:

- Cap de DPR (renderize em `dpr <= 1.5`) e evite múltiplos cenários 3D pesados
  na mesma viewport.
- Reduzir animação automaticamente quando `prefers-reduced-motion: reduce` —
  Motion tem `useReducedMotion`; garantir fallback CSS visível.
- Preferir `transform`/`opacity` (compositor GPU) sobre `width`/`height`/`top`.

## Lenis — scroll suave (só landing)

- Aplicar **apenas** onde a página é narrativa: landing, campanha, página de
  proposta.
- **Não** ativar no dashboard operacional (listas, tabelas, auditorias) — scroll
  nativo é mais previsível e rápido para trabalho.
- Integrar com o `useReducedMotion`: desligar Lenis quando `reduce`.
- Cuidado com incompatibilidade com scroll interno de componentes (modais,
  selects) — sincronizar `data-lenis-prevent`.

## O que evitar

- **Empilhamento de efeitos** (parallax + blur + glow + marquee no mesmo bloco).
  Premium é contenção.
- **Animate UI / React Bits**: licença MIT + Commons Clause proíbe uso comercial
  do código — servir apenas de inspiração visual.
- **Bibliotecas novas de animação** sem necessidade: já temos Motion e Lenis.
  Antes de adicionar GSAP ou outras, justificar com requisito real.
- **Repos pesos** para "ver como anima": consulta é local em `external/repos/`.

## Fallback sem JS

- Conteúdo essencial legível e funcional sem WebGL/JS de animação.
- Animações decorativas com `@media (prefers-reduced-motion: reduce)` zeradas.
- 3D decorativo e progressivo — nunca depende de WebGL para o essencial.

## Validação

- `npm run lint`.
- Checar `prefers-reduced-motion` em devtools (emulated) e navegação real.
- Revisar mobile antes de fechar (largura 360–430 px).
