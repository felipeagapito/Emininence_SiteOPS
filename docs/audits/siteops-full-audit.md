# Auditoria Eminence SiteOps

**Data:** 2026-08-01
**Auditor:** Claude Code (audit-siteops skill + full manual review)
**Branch:** `main`
**Commits recentes:** cebb520 (feat/money-manual-hardening merge)

---

## Nota geral

### **5.5 / 10**

**Justificativa:** O motor de dados do Money Engine é notavelmente bem
 projetado — schemas Zod, scoring dual determinístico, pipeline sem IA,
 91 testes passando, zero secrets expostos. Mas o **build está quebrado**,
 o typecheck crasha por OOM (arquivos de `external/repos/` entram no
 tsconfig), a UI inteira mora em 3.695 linhas de CSS manual sem design
 system, e duas linhas de produto competem por espaço no mesmo repo
 sem separação clara. O produto não é vendável no estado atual sem
 corrigir o build e decidir a identidade.

---

## Está funcionando?

### Parcialmente

| Comando | Resultado | Detalhes |
|---|---|---|
| `git status --short` | ✅ OK | Branch main, 8 arquivos modificados (WIP), 6 dirs untracked |
| `npm run lint` | ⚠️ Lento | Exit 0, mas **varre `external/repos/`** (30 repos) — deve levar 5s e leva minutos |
| `npx tsc --noEmit` | ❌ CRASH | OOM (exit 134) — `tsconfig.json` inclui `external/repos/**/*.ts` |
| `npm run build` | ❌ FALHA | Exit 1 — `app/api/money/audit-url/route.ts` importa `url-audit` que não existe |
| `npm test` | ❌ FALHA | Depende de build; sem build não roda |
| `node --test tests/*` | ✅ OK | 91 testes, 91 pass, 0 falha (testes de render usam `dist/` stale) |
| `npx playwright test` | ❓ NÃO EXISTE | Sem config Playwright para e2e |

**Evidência do build quebrado:**
```
[UNRESOLVED_IMPORT] Could not resolve '../../../lib/money/url-audit'
in app/api/money/audit-url/route.ts:1:8
```

**Evidência do OOM:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit
Allocation failed - JavaScript heap out of memory
Aborted (core dumped)
```

**Evidência do lint lento:**
ESLint imprime warnings de `external/repos/BackstopJS`, `external/repos/lighthouse/`
etc. — arquivos que não fazem parte do produto.

---

## Principais problemas

### Crítico

1. **Build quebrado** — `app/lib/money/url-audit.ts` não existe mas é importado
   por `app/api/money/audit-url/route.ts`. A URL audit page e form existem,
   o backend não. Impossível fazer deploy.

2. **`dist/` contém build stale** de 31/Jul que mascara falhas nos testes de
   render (`rendered-html.test.mjs` importa `dist/server/index.js`). Se o
   `dist/` for limpo, 3 testes falham.

### Alto

3. **`tsconfig.json` inclui `external/repos/`** — O padrão `"**/*.ts"` na
   seção `include` pega todos os .ts dos 30 repos de referência (~milhões
   de linhas). `tsc --noEmit` estoura memória. **Impacto:** impossível
   typecheck localmente.

4. **ESLint varre `external/repos/`** — `eslint.config.mjs` define
   `globalIgnores` mas não inclui `external`. O lint leva minutos em vez
   de segundos e gera centenas de warnings irrelevantes.

5. **CSS monolítico** — `app/globals.css` tem 3.695 linhas contendo todos
   os estilos das 5 páginas (home, studio, modelos, money cockpit,
   money manual, money audit). Sem design system, sem componentização
   CSS, sem tokens reutilizáveis. Qualquer mudança pode quebrar outra
   página.

6. **Duas linhas de produto sem separação** — O repo mescla:
   - Eminence SiteOps (portfolio/experiência criativa com 3D, motion, studio)
   - SiteOps Money Engine (cockpit comercial com scoring, diagnóstico, propostas)

   O `/studio` e os `/modelos` são a identidade "Eminence".
   O `/money` é a identidade "Money Engine".
   Não está claro qual é o produto principal.

### Médio

7. **`chatgpt-auth.ts` é código morto** — Import de `next/navigation` e
   `next/headers` que não são usados em nenhum outro arquivo. Artefato
   do starter Vinext/Sites.

8. **`next.config.ts` é placeholder** — Arquivo formatado para Next.js mas
   o app usa Vite+Vinext. Config real está em `vite.config.ts`.

9. **Sem persistência** — Nenhum dado é salvo (lead, auditoria, proposta).
   Tudo é in-memory e descartado ao fechar a aba. Impossível ter
   histórico, pipeline de vendas ou multi-usuário sem banco.

10. **Sem autenticação** — A API `/api/generate` e `/api/money/audit-url`
    são públicas. Sem rate limiting. Qualquer um pode gerar blueprints
    ou analisar sites.

11. **`api/ai/status` expõe configuração do modelo** — Retorna
    `configured: true/false` e o nome do modelo. Não é secret, mas
    desnecessário para o público.

12. **`SmoothScroll` ativo em todas as páginas** — Lenis é instalado no
    layout raiz e ativo inclusive no dashboard Money Engine, onde scroll
    nativo é mais adequado (ver `docs/references/01-animation-stack.md`).

13. **Nenhum estado de loading/error/empty na página principal Money** —
    `/money` renderiza dados mock no servidor. Não há loading skeleton,
    empty state ou error boundary.

### Baixo

14. **`NEXT_PUBLIC_SITE_URL` em `.env.example`** — Não é secret, mas o
    prefixo `NEXT_PUBLIC_` é um padrão Next.js que o Vinext pode não
    suportar da mesma forma.

15. **Sem Playwright e2e** — Os testes de render carregam o `dist/`
    compilado, não testam o app real no navegador. Não há teste de
    navegação, interação ou responsividade.

16. **Testes de render dependem de dist/** — `rendered-html.test.mjs`
    importa `../dist/server/index.js`. Se dist/ não existe ou está
    desatualizado, os testes falham silenciosamente ou passam com
    código antigo.

---

## O que manter

- **Money Engine lib** (`app/lib/money/`) — schemas, scoring, briefing,
  proposal, prompt, export. Excelente arquitetura: determinística,
  sem IA, testável, bem tipada.

- **Evidence model** — Muito superior ao booleano original. Status
  (yes/partial/no/unknown) + confidence + evidence text. Perfeito
  para scoring e diagnóstico.

- **Dual score** — Separar maturidade digital de oportunidade
  comercial é uma decisão inteligente. Um site bom não é
  necessariamente uma oportunidade perdida.

- **Testes unitários** — 91 testes cobrindo schemas, scoring,
  briefing, proposal, prompt. Bem escritos, determinísticos.

- **Documentação** — `brain/`, `docs/siteops-money-engine/`,
  `docs/references/` são completos e alinhados. O `00-index.md`
  de referências é um trabalho exemplar.

- **Security patterns** — API key server-side, `.gitignore`
  correto, zero secrets expostos, human approval gates.

- **3D scenes com fallback** — CSS fallback, reduced-motion,
  DPR cap, frameloop demand. Segue as non-negotiables do
  CLAUDE.md.

- **`ExperienceScene`** — 3 modos (siteops/roof/glass) com
  geometria abstrata, sem modelos pesados, sem dependência
  de assets externos.

- **`ExportButtons`** — Clipboard com fallback legacy para
  non-secure contexts. Robusto.

- **Briefing generator** — Determinístico, com variants para
  evidence-aware e manual. Bom example de lógica
  condicional baseada em dados reais.

- **`proposal.ts` e `prompt.ts`** — Geração portuguesa
  profissional com regras claras, sem inventar dados.

- **Zod em todos os schemas** — Validação robusta, tipos
  derivados, coleta de erros. Padrão correto.

- **`.gitignore` bem configurado** — Exclui env, dist,
  external/repos, .wrangler, .sites-runtime.

- **Scripts de build com validação** — `build-verified.sh`
  roda vinext build + validate-artifact. Bom padrão.

---

## O que remover

| Arquivo/Pasta | Motivo |
|---|---|
| `app/chatgpt-auth.ts` | Código morto do starter Vinext/Sites. Não importado por ninguém. |
| `next.config.ts` | Placeholder Next.js. Config real é `vite.config.ts`. |
| `dist/` (se commitado) | Build stale de 31/Jul. Deve ser regenerado, não commitado. Verificar se `.gitignore` cobre. |
| Testes em `dist/` | `rendered-html.test.mjs` depende de `dist/server/index.js`. Refatorar para não depender de build prévio. |
| `tsconfig.json` → `next-env.d.ts` | Referência a plugin `next` que não existe no Vite setup. |

---

## O que modificar

| Alvo | Mudança | Prioridade |
|---|---|---|
| `app/lib/money/url-audit.ts` | **Criar o módulo faltante** com `urlAuditRequestSchema`, `fetchUrlHtml`, `buildUrlAuditArtifacts`. Usar `fetch()` server-side + regex/DOM parsing para extrair sinais do HTML. | Crítica |
| `tsconfig.json` | Adicionar `"external"` ao `exclude` para parar de incluir `external/repos/`. | Crítica |
| `eslint.config.mjs` | Adicionar `external/**` ao `globalIgnores` para o lint ignorar repos de referência. | Alta |
| `app/layout.tsx` | Mover `SmoothScroll` para ser condicional: ativo em landing/modelos, desativo em /money, /studio, /money/audit, /money/manual. | Média |
| `app/globals.css` | Quebrar em módulos: `globals.css` (tokens + reset), `home.css`, `studio.css`, `money.css`, `modelos.css`. | Alta |
| `app/components/` | Criar design system com componentes reutilizáveis (Button, Card, Input, Badge, Tabs). Considerar shadcn/ui. | Alta |
| `.env.example` | Remover `NEXT_PUBLIC_` prefix se Vinext não suporta. Documentar variáveis reais do Vinext. | Baixa |

---

## O que criar no MVP

| Entrega | Arquivos prováveis | Critério de aceite |
|---|---|---|
| `url-audit.ts` completo | `app/lib/money/url-audit.ts` | `POST /api/money/audit-url` com URL válida retorna JSON com evidence, scores, briefing. |
| Database schema | `db/schema.ts` (D1) | Leads, audits e briefings persistidos. Query por lead retorna pipeline completo. |
| CRUD leads | `app/api/money/leads/` | Criar, listar, filtrar por cidade/nicho/status. Validação server-side. |
| Lead list dashboard | `app/money/page.tsx` (refatorado) | Mostra leads reais (não mock), com status, score, prioridade. |
| CSV import | Script + validação | CSV de leads importa com validação Zod, deduplicação por nome+cidade. |
| Auth básica | Middleware ou query param | Pelo menos proteção por token/cookie para APIs e páginas internas. |

---

## O que deixar para fase 2

- Playwright screenshots + Lighthouse CLI integration
- Unlighthouse para varredura em lote
- axe-core/@axe-core/playwright para acessibilidade
- PDF export de propostas
- Pipeline de status (novo → analisado → proposta → contato → fechado)
- Rate limiting nas APIs
- Autenticação completa (OAuth ou magic link)
- shadcn/ui migration completa
- Multi-tenant
- Histórico de auditorias (comparativo antes/depois)
- Maxun/Firecrawl adapters
- Geração assistida de sites via PR/preview automático

---

## Repositórios de referência mais úteis

| Repo | Uso recomendado | Risco | Prioridade |
|---|---|---|---|
| `microsoft/playwright` | Motor de automação: screenshots, crawling, navegação para URL audit | Baixo | ✅ MVP |
| `GoogleChrome/lighthouse` | Performance/SEO/acessibilidade via CLI para scoring real | Baixo | ✅ MVP |
| `harlan-zw/unlighthouse` | Varredura completa do site com Lighthouse (sampling inteligente) | Baixo | ✅ MVP |
| `dequelabs/axe-core` | Motor de regras WCAG via `@axe-core/playwright` | Baixo | ✅ MVP |
| `shadcn-ui/ui` | Base de componentes (copy-paste, Tailwind v4, React 19) | Baixo | ✅ MVP |
| `motiondivision/motion` | Já instalado. Microinterações e entradas. | Baixo | ✅ Já ativo |
| `darkroomengineering/lenis` | Já instalado. Scroll de landing (uso seletivo). | Baixo | ✅ Já ativo |
| `magicuidesign/magicui` | Inspiração controlada para micro-interações decorativas | Baixo | 🔎 Ref |
| `github/spec-kit` | Processo spec-driven para features do Money Engine | Baixo | 🔎 Ref |
| `obra/superpowers` | Metodologia de skills/planos para agentes | Baixo | 🔎 Ref |
| `garris/BackstopJS` | Regressão visual (stale, usar Playwright screenshots) | Médio | 🔎 Ref |
| `pa11y/pa11y` | Acessibilidade CLI — usar axe-core no lugar (LGPL) | Médio | ⛔ Ref apenas |
| `sitespeedio/sitespeed.io` | Benchmark profundo (Docker, pesado) | Alto | ⛔ Ref apenas |

---

## Plano de ação em 7 passos

### Passo 1 — Restaurar o build

**Objetivo:** `npm run build` passa sem erros.

**Arquivos prováveis:**
- `app/lib/money/url-audit.ts` (criar — módulo faltante)
- `app/api/money/audit-url/route.ts` (verificar se imports batem)

**Validação:**
```
npm run build  →  exit 0
node --test tests/*.test.mjs tests/*.test.ts  →  91 pass
```

**Critério de aceite:** Build completo, rotas /money, /money/manual e
/money/audit renderizam sem erros de import.

---

### Passo 2 — Corrigir tsconfig + eslint

**Objetivo:** `tsc --noEmit` e `npm run lint` rodam em <10 segundos.

**Arquivos prováveis:**
- `tsconfig.json` (adicionar `"external"` e `"dist"` ao `exclude`)
- `eslint.config.mjs` (adicionar `external/**` ao `globalIgnores`)

**Validação:**
```
npx tsc --noEmit  →  exit 0, <10s
npm run lint  →  exit 0, <10s
```

**Critério de aceite:** Nenhum arquivo de `external/repos/` é
processado por tsc ou eslint.

---

### Passo 3 — Separar CSS

**Objetivo:** Quebrar `globals.css` (3.695 linhas) em módulos por página.

**Arquivos prováveis:**
- `app/globals.css` (tokens + reset global)
- `app/money/money.css` (cockpit, manual, audit)
- `app/studio/studio.css`
- `app/modelos/modelos.css`

**Validação:** Todas as páginas mantêm aparência idêntica. Inspeção
visual desktop + mobile.

**Critério de aceite:** Nenhuma página perde estilo. CSS duplicado
eliminado. Tokens compartilhados via `:root`.

---

### Passo 4 — SmoothScroll condicional

**Objetivo:** Lenis ativo apenas em landing e modelos, desativado
em /money, /studio, /money/audit, /money/manual.

**Arquivos prováveis:**
- `app/components/smooth-scroll.tsx` (adicionar lógica de rota)
- `app/layout.tsx` (manter import mas com condição)

**Validação:** Dashboard Money Engine usa scroll nativo. Landing
usa Lenis suave. `prefers-reduced-motion` mantém nativo.

**Critério de aceite:** Lenis não ativa em rotas operacionais.

---

### Passo 5 — Criar url-audit.ts funcional

**Objetivo:** URL audit real com fetch server-side + extração
determinística de sinais do HTML.

**Arquivos prováveis:**
- `app/lib/money/url-audit.ts` (schema, fetch, parse, build artifacts)

**Validação:**
```
POST /api/money/audit-url  { url: "https://example.com" }
→ { ok: true, data: { lead, evidence, scores, briefingJson, ... } }
```

**Critério de aceite:** URL pública retorna evidence com status,
confidence e texto. Coleta: WhatsApp, CTA, formulário, mapa,
título, meta description, links internos, erros técnicos.

---

### Passo 6 — Database + persistência

**Objetivo:** Leads e audits persistidos em D1. CRUD básico funcional.

**Arquivos prováveis:**
- `db/schema.ts` (tabelas leads, audits, briefings)
- `app/api/money/leads/route.ts` (CRUD)
- `app/lib/money/store.ts` (camada de dados)

**Validação:** Lead criado via formulário aparece na listagem.
Refresh da página mantém os dados.

**Critério de aceite:** CRUD completo, validação server-side,
sem SQL injection (Drizzle ORM).

---

### Passo 7 — Dashboard com dados reais

**Objetivo:** `/money` mostra leads reais do banco, não mocks.

**Arquivos prováveis:**
- `app/money/page.tsx` (refatorado para server component + fetch)

**Validação:** Dashboard mostra lista de leads com nome, cidade,
score, status. Filtro por status funciona. Empty state quando
não há leads.

**Critério de aceite:** Zero dados mock. Loading state. Empty state.
Score real. Link para criar novo lead.

---

## Próxima tarefa recomendada para o Claude

```
Crie o módulo faltante app/lib/money/url-audit.ts com:
- urlAuditRequestSchema (zod) aceitando { url?, html?, businessName?, category?, city?, state? }
- fetchUrlHtml(url) que faz fetch server-side e retorna { html, finalUrl, fetchedAt }
- buildUrlAuditArtifacts(targetFields, html, finalUrl, fetchedAt) que:
  1. Faz parse do HTML (regex + DOM parsing, sem dependência externa)
  2. Extrai: title, metaDescription, h1, phone, email, whatsapp, links internos, forms, socialProof, erros técnicos, Google Maps embed
  3. Converte para Evidence[] usando o modelo existente
  4. Gera dual score via computeDualScore
  5. Gera briefing via generateBriefing
  6. Gera proposal via generateProposalMarkdown
  7. Gera prompt via generateSiteBuildPrompt
  8. Retorna tudo como { lead, evidence, scores, briefingJson, proposalMd, siteBuildPromptMd }

Valide com um teste em tests/url-audit.test.ts usando HTML fixture.
Confirme que npm run build passa depois.
```

---

## Validações finais

### git status --short (após escrita do relatório)

```
A  docs/audits/siteops-full-audit.md   ← único arquivo criado
M  .gitignore                           ← já modificado antes
M  app/lib/money/audit.ts               ← já modificado antes
M  app/lib/money/briefing-generator.ts  ← já modificado antes
M  app/lib/money/briefing.ts            ← já modificado antes
M  app/lib/money/index.ts               ← já modificado antes
M  app/lib/money/lead.ts                ← já modificado antes
M  app/lib/money/manual-input.ts        ← já modificado antes
M  app/lib/money/score.ts               ← já modificado antes
?? .claude/                             ← já untracked antes
?? app/api/money/                       ← já untracked antes
?? app/lib/money/evidence.ts            ← já untracked antes
?? app/money/audit/                     ← já untracked antes
?? docs/references/                     ← já untracked antes
?? docs/siteops/                        ← já untracked antes
?? scripts/siteops/                     ← já untracked antes
```

**Confirmado:** Apenas o arquivo de auditoria (`docs/audits/siteops-full-audit.md`)
foi criado por esta sessão. Todos os outros arquivos modificados/untracked
existiam antes.

### Arquivos alterados por esta sessão

| Arquivo | Ação |
|---|---|
| `docs/audits/siteops-full-audit.md` | **Criado** — este relatório |
