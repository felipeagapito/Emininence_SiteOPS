# CSS Cleanup Plan

**Data:** 2026-08-01 (atualizado)
**Arquivo:** `app/globals.css` (3.703 linhas)
**Status:** Plano — parcialmente documentado; CSS para evidence chips foi adicionado em 2026-08-01

---

## Diagnóstico

`globals.css` é um monolito com 3.703 linhas contendo estilos para **5 páginas distintas**:

| Seção | Linhas | Página |
|---|---|---|
| Tokens + Reset | 1–101 | Global |
| SITEOPS | 102–996 (895 linhas) | `/` (landing) |
| STUDIO | 997–1436 (440 linhas) | `/studio` |
| PRIME | 1437–2065 (629 linhas) | `/modelos/prime-calhas` |
| VETRO | 2066–2539 (474 linhas) | `/modelos/vetro` |
| MONEY ENGINE | 2540–2895 (356 linhas) | `/money` |
| MONEY MANUAL | 2896–3175 (280 linhas) | `/money/manual`, `/money/audit` |
| MOTION | 3176–3194 (19 linhas) | Global |
| RESPONSIVE | 3195–3703 (509 linhas) | Global (media queries) |

---

## Problemas identificados

### 1. CSS ausente para componentes ativos (urgente)
- **`app/money/audit/url-audit-form.tsx`** usa classes que não existem em `globals.css`:
  - `.money-evidence-grid`, `.money-evidence-chip`, `.money-evidence-label`,
    `.money-evidence-status`, `.money-evidence-status--yes/--partial/--no/--unknown`,
    `.money-evidence-confidence`
- **Efeito:** o grid de evidências da página de auditoria por URL renderiza
  **completamente sem estilo** (plain HTML). Corpo do achado em 2026-08-01; adicionar
  esses estilos é o primeiro passo seguro antes de qualquer refactor.
- **CSS adicionado em sessão atual:** linhas de `.money-evidence-*` no bloco MONEY
  ENGINE (já commitadas). Verificar que aparecem no arquivo.

### 2. Acoplamento entre páginas
- Alterar `.experience-hero` (landing) pode afetar `.roof-hero-new` (Prime).
- Media queries (509 linhas) misturam overrides de todas as páginas em um único bloco.

### 3. Sem design system reutilizável
- Tokens mínimos (`--ink`, `--paper`, `--muted`, `--line`, `--blue`, `--orange`, `--ease`).
- Nenhum componente CSS reutilizável (Button, Card, Input, Badge, Tabs).
- Cada página redefine estilos de botão e input do zero.

### 4. CSS duplicado funcional
- `.money-kv` aparece **4 vezes**; `.money-score-dim` **4 vezes**;
  `.money-flag` **6 vezes**; `.money-export` **8 vezes**; `.money-footer` **4 vezes**;
  `.money-nav-bar` **3 vezes**.
- Muitas são declarações em `@media` (esperado), mas pelo menos 3 pares são
  declarações idênticas em MONEY ENGINE e MONEY MANUAL sections.

### 5. Responsividade monolítica
- 509 linhas `@media` misturam overrides de todas as páginas.
- Impossível sem inspecionar saber qual breakpoint afeta qual página.

---

## O que pode virar componente

| Componente CSS | Ocorrências | Critério |
|---|---|---|
| `.money-section-label` | 2 | Duplicado entre cockpit/audit |
| `.money-kv` / `.money-kv-grid` | 4 | Duplicado entre cockpit/manual/audit |
| `.money-score-bar` / `.money-score-grid` / `.money-score-dim` | 8 | Duplicado entre cockpit/audit |
| `.money-flag` + variantes | 6 | Duplicado + parcialmente ausente |
| `.money-tab` / `.money-tabs` | 4 | Duplicado entre manual/audit |
| `.money-evidence-*` (NOVO) | 6 | CSS recém-adicionado — consolidar |
| `.money-export` / `.money-export-btns` | 12 | Duplicado entre cockpit/manual/audit |
| `.money-footer` | 4 | Duplicado entre cockpit/manual/audit |
| `.money-nav-bar` | 3 | Duplicado entre cockpit/manual/audit |
| `.experience-hero` layout | — | Complexo, manter isolado (landing) |

---

## O que pode ser removido

| Seção | Justificativa |
|---|---|
| `app/chatgpt-auth.ts` styles (se existirem) | **Removido em 2026-08-01** — código morto confirmado |
| `.next-env` references (se houver) | Vinext não gera esse arquivo |
| Seletores de `.money-flag--ok/--no` se consolidar em `.money-evidence-status--yes/--no` | Parcial — verificar equivalência antes de unificar |

---

## Ordem segura de refator

### Fase 0 — Correção imediata (feito em 2026-08-01)
1. ✅ Adicionar CSS para `.money-evidence-*` (evidence grid da auditoria).
2. Verificar visualmente: `/money/audit` → evidence chips estilizados.

### Fase 1 — Extrair Money Engine CSS (baixo risco)
1. Criar `app/money/money.css` com seções MONEY ENGINE + MONEY MANUAL + evidence.
2. Remover essas seções de `globals.css`.
3. Importar `money.css` em `app/money/page.tsx`, `app/money/manual/page.tsx`, `app/money/audit/page.tsx`.
4. Validar: todas as páginas Money mantêm aparência idêntica.

### Fase 2 — Extrair Modelo CSS (baixo risco)
1. Criar `app/modelos/modelos.css` com seções PRIME + VETRO.
2. Remover de `globals.css`.
3. Importar em `app/modelos/prime-calhas/page.tsx` e `app/modelos/vetro/page.tsx`.
4. Validar.

### Fase 3 — Extrair Studio CSS (médio risco)
1. Criar `app/studio/studio.css` com seção STUDIO.
2. Remover de `globals.css`.
3. Importar em `app/studio/page.tsx`.
4. Validar.

### Fase 4 — Separar media queries (alto risco)
1. Mover cada bloco `@media` para o arquivo CSS da página correspondente.
2. Manter apenas overrides globais (body, a, button, focus-visible) em `globals.css`.
3. Validar responsividade em todas as páginas.

### Fase 5 — Design system (futuro)
1. Instalar shadcn/ui CLI (decisão separada — ver `docs/references/03-ui-quality-stack.md`).
2. Migrar botões, inputs, cards, badges para componentes reutilizáveis.
3. Substituir CSS manual por classes shadcn.

---

## Validação pós-refator

- [ ] Todas as páginas mantêm aparência idêntica (desktop + mobile)
- [ ] `npm run lint` passa
- [ ] `npm run build` passa
- [ ] 115 testes continuam passando
- [ ] Nenhum seletor CSS foi perdido
- [ ] Media queries continuam funcionando

---

## Riscos

- **Alto:** Separar media queries pode quebrar responsividade se um override for movido para o arquivo errado.
- **Médio:** Importar CSS em componentes React pode mudar a ordem de cascata.
- **Baixo:** Extrair seções isoladas (Money, Modelos) é seguro porque são páginas independentes.
