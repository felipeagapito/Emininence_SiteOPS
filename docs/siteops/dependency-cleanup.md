# Dependency Cleanup

**Data:** 2026-08-01
**Base:** `package.json` (runtime + dev), varredura de imports em `app/ worker/ build/ db/`.
**Regra:** nenhuma dependência removida sem evidência de uso ou decisão explícita.

---

## Dependências de runtime

| Dependência | Onde é usada | Veredicto | Risco |
|---|---|---|---|
| `react` / `react-dom` | Core do app | **Manter** | — |
| `next` | `next/link`, `next/font/google`, `Metadata`, `next/headers` | **Manter** — camada de compat Vinext | Baixo |
| `zod` | Schemas do Money Engine (9 imports) | **Manter** | — |
| `ai` + `@openrouter/ai-sdk-provider` | `app/api/generate/route.ts` (blueprint via IA) | **Manter** — rota `/studio` | Baixo |
| `three` + `@react-three/fiber` + `@react-three/drei` | `app/components/experience-scene.tsx` (3D landing/modelos) | **Manter** | — |
| `motion` | `Reveal` + `experience-scene` via `motion/react` | **Manter** — entradas/microinterações | — |
| `lenis` | `app/components/smooth-scroll.tsx` | **Manter** — scroll de landing | Baixo |
| `lucide-react` | Ícones em todas as páginas | **Manter** | — |
| `drizzle-orm` | `db/index.ts` (D1), schema **vazio** | **Manter (dormente)** — infra planejada | Baixo |

**Nenhum pacote de runtime está sem uso.** Não há nada a remover nesta camada.

---

## Dependências de desenvolvimento

| Dependência | Onde é usada | Veredicto | Risco |
|---|---|---|---|
| `vinext` + `@vitejs/plugin-rsc` + `react-server-dom-webpack` | Framework RSC (vite.config, worker) | **Manter** | — |
| `vite` + `@vitejs/plugin-react` | Build | **Manter** | — |
| `tailwindcss` + `@tailwindcss/postcss` | CSS (globals.css) | **Manter** | — |
| `wrangler` + `@cloudflare/vite-plugin` | Deploy Cloudflare | **Manter** | — |
| `typescript` | tsc | **Manter** | — |
| `eslint` + `eslint-config-next` | Lint | **Manter** | — |
| `@types/*` | Tipos | **Manter** | — |
| `drizzle-kit` + `drizzle.config.ts` | Migrações D1 (schema vazio) | **Manter (dormente)** | Baixo |

---

## Código morto candidato a remoção

| Arquivo | Evidência | Decisão | Risco |
|---|---|---|---|
| `app/chatgpt-auth.ts` | Nenhum outro arquivo importa `getChatGPTUser`/`requireChatGPTUser` (grep confirmado). Artefato do starter OpenAI/Vinext. | **Remover** (requer OK do dono — auth ChatGPT pode voltar em fase 2) | Médio |
| `next.config.ts` | Placeholder Next.js; config real é `vite.config.ts` | **Remover** (baixo valor) | Baixo |
| `examples/` | Material de referência do starter | Avaliar separadamente | Baixo |

> **Executado em 2026-08-01:** `app/chatgpt-auth.ts` removido (código morto
> confirmado por `rg` — nenhum import fora de si mesmo). `next.config.ts`
> removido (placeholder vazio; Vinext `detectMDX` só lê se existir e o
> conteúdo não tem padrões MDX). Build passou (exit0) sem ambos. `rg`
> confirmou que a única referência a `next.config` era um comentário em
> `worker/index.ts` (não é uso).

---

## Dependências NÃO instaladas (planejadas para Fase 2 — ver `site-audit-engine.md`)

| Pacote | Licença | Status | Por que ainda não instalado |
|---|---|---|---|
| `playwright` | Apache-2.0 | **Não instalado** | Sem worker de auditoria na Fase 1; instalar junto com o script |
| `@axe-core/playwright` | MPL-2.0 | **Não instalado** | Idem |
| `lighthouse` | Apache-2.0 | **Não instalado** | CLI; instalar com o worker |
| `unlighthouse` | MIT | **Não instalado** | Varredura em lote — opcional |

> `axe-core@4.11.4` aparece no lock apenas **transitivamente** via
> `eslint-plugin-jsx-a11y` (eslint-config-next). Não é importado no produto.

---

## Recomendações

1. **Agora:** remover `app/chatgpt-auth.ts` e `next.config.ts` (após OK) —
   baixo valor, sem dependência de terceiros.
2. **Fase 2:** adicionar `playwright`/`lighthouse`/`@axe-core/playwright` junto
   com o worker — nunca antes.
3. **Não adicionar:** `clsx`, `tailwind-merge`, `class-variance-authority`,
   Radix primitives até migrar para shadcn/ui (decisão separada, ver
   `docs/references/03-ui-quality-stack.md`).
4. **Monitorar:** `drizzle-orm`/`drizzle-kit` quando o banco D1 for ativado.
