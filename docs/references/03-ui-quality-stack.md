# 03 — Padrões de UI do Eminence SiteOps

> Alvo: UI premium (conceito, hierarquia, contenção, ritmo, detalhe) com
> Next.js/React/TypeScript/Tailwind v4, sem virar fábrica de landing pages e sem
> copiar marca de terceiros.

## Decisão

| Camada | Fonte | Status |
|---|---|---|
| Base de componentes | **shadcn/ui** | ✅ instalar agora (CLI) |
| Inspiração controlada | **Origin UI / Magic UI** | 🔎 referência |
| Componentes para copiar | shadcn/ui (MIT) e Magic UI (MIT), **pequenos e auditados** | condicional |
| Animate UI / React Bits | — | ⛔ **não copiar** (Commons Clause) |

## shadcn/ui como base

- Instalar com a CLI do shadcn (`npx shadcn@latest init`) usando **Tailwind v4** e
  React 19 (versão atual do produto). Manter apenas os componentes que a UI do
  produto realmente usa — nada de instalar o pacote inteiro.
- Diretório padrão: `components/ui/` com `lib/utils.ts` (`cn`). A CLI registra
  `components.json` e instala `clsx` + `tailwind-merge` + Radix primitives.
- Preferir **copy-paste** (registro) em vez de `@shadcn/ui` como dependência de
  runtime — assim cada componente é auditado, versionado e não cria lock-in.
- Respeitar as non-negotiables do `CLAUDE.md`: headings semânticos,
  `focus-visible`, controles com `aria-label`, reduzir motion.

## Origin UI / Magic UI como inspiração controlada

- **Origin UI** (`shadcn/originui`, MIT): referência de padrões premium de
  formulários, tabelas, sidebars e dashboards. **Atenção**: o clone é um fork
  stale (2025-08); confirmar a versão atual em `originui.com`/registry antes de
  copiar qualquer componente.
- **Magic UI** (MIT, ativo): micro-interações decorativas (beams, particles,
  marquee, border glow). Usar com contenção — animação é tempero, não prato.
- Regra de cópia: **só componentes pequenos, auditáveis e compatíveis** — sem
  layout inteiro, sem lógica de negócio de terceiros, sem dependências novas sem
  justificativa.

## Nunca copiar

- **Animate UI** e **React Bits**: MIT + Commons Clause — o código não pode ser
  usado comercialmente. Inspiração visual apenas.
- **awesome-claude-code**: CC BY-NC-ND — conteúdo não copiável; apenas linkar.
- Nada de branding de NASA, Rolex, Patek, Ferrari, etc. — conceito original.
- Não substituir o starter Vinext/Sites; adicionar componentes sobre ele.

## Checklist de auditoria antes de copiar (aplicar sempre)

1. Licença no arquivo do componente + repo-fonte (MIT/Apache/BSD ✓; GPL/LGPL/
   AGPL/Commons Clause ✗).
2. Compatibilidade com React 19 + Tailwind v4 (estilo, tokens, `cn`).
3. Acessibilidade: markup semântico, foco visível, labels, contraste.
4. Motion: respeita `prefers-reduced-motion`, durações dentro do orçamento.
5. Peso: sem trazer Radix/utilitários duplicados em excesso.
6. Registrar a decisão (fonte, licença, data) — evita re-auditar depois.

## Design tokens e ritmo

- Tokens de cor/espaço/typography via CSS do Tailwind v4 (`@theme`), centralizado.
- Ritmo: hierarquia tipográfica clara, densidade de informação no dashboard
  operacional (tabelas e scores) — sem decoração que atrapalhe leitura.
- Conteúdo essencial legível sem WebGL; 3D decorativo e progressivo.

## Validação de qualidade

- `npm run lint` e build de release antes de fechar feature de UI.
- Inspecionar desktop e mobile (360–430 px) + navegação + ações primárias.
- Verificar reduced-motion e fallback sem JS.
- Reportar compromissos honestamente (sem inventar métricas de "premium").
