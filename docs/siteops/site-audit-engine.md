# Site Audit Engine — Arquitetura

**Estado:** Fase 1 (motor determinístico sem IA) implementada. Fase 2 (Playwright/Lighthouse/axe-core) documentada, **não implementada**.

---

## Visão geral

O SiteOps Money Engine audita a presença digital de um lead e produz um
relatório executivo + briefing + proposta + prompt de site. O pipeline roda
**server-side**, é determinístico e **não depende de IA** no MVP.

```
URL do lead
  │
  ├─ Fase 1 (agora)  ──  fetch HTML + extração por regex ──→ report JSON
  │                     (app/lib/money/url-audit.ts + scoring.ts)
  │
  └─ Fase 2 (futuro) ──  Playwright (screenshot/crawl)  ──→ evidências
                        Lighthouse / Unlighthouse (perf/SEO/a11y)
                        axe-core (WCAG)
                        ──→ report JSON salvo em reports/tmp/
```

## Fase 1 — Determinístico (implementada)

### Fluxo

1. **Entrada:** `POST /api/money/audit-url` recebe `{ url?, html?, businessName?, category?, city?, state? }`.
2. **Normalização:** `normalizeUrl()` em `app/lib/money/url-audit.ts` — adiciona `https://`, valida protocolo, remove fragmento. Lança erro claro → 400/422.
3. **Coleta:** `fetchUrlHtml()` — `fetch` server-side com timeout de 15s, redirects seguidos, `User-Agent` identificável.
4. **Extração:** `extractSignals()` — regex determinística sobre o HTML.
5. **Evidências:** sinais convertidos em `Evidence[]` (status `yes/partial/no/unknown` + confidence).
6. **Scoring:** `scoreCategoriesFromEvidence()` → 6 categorias (0–100).
7. **Report:** `buildSiteAuditReport()` → JSON tipado validado por `siteAuditReportSchema`.
8. **Derivados:** briefing, proposta e site-build-prompt (pipeline existente).

### Sinais extraídos (Fase 1)

| Grupo | Sinais |
|---|---|
| SEO | `title`, `metaDescription`, `h1`, `canonical`, `localSeo` |
| Conversão | `whatsapp`, `cta`, `contactForm`, `booking`, `socialProof`, `phone`, `email` |
| Acessibilidade | `viewport`, `imagesAlt`, `h1` (estrutura) |
| Técnico | `charset`, `technicalErrors`, `bodyShort`, `https` |
| Stack | `techStack` (moderno/CMS/legado) |
| Presença | `siteExists`, `internalLinks`, `socialLinks`, `address` |

### Categorias de score

| Categoria | Peso overall | Fonte principal |
|---|---|---|
| `performance` | 0.20 | erros técnicos, Lighthouse (futuro) |
| `seo` | 0.20 | title/meta/h1/canonical/local |
| `accessibility` | 0.15 | viewport, alt, Lighthouse a11y (futuro) |
| `conversion` | 0.25 | whatsapp/CTA/form/booking/prova social |
| `stack` | 0.10 | detecção de tecnologia |
| `technicalRisk` | 0.10 | erros, HTTPS, JS-rendered |

Maior = melhor. `technicalRisk` é a "saúde" (alto score = baixo risco); a UI
inverte o rótulo para exibição.

## Fase 2 — Playwright / Lighthouse / axe-core (planejada)

### Princípios

- **Server-side**, Chrome headless gerenciado pelo Node — **sem Docker**.
- Uma auditoria por vez; timeout global; sem scraping agressivo.
- Resultados em `reports/tmp/` (git-ignorado), nunca expostos via rota
  pública sem autenticação.

### Camadas

| Camada | Ferramenta | Licença | Uso |
|---|---|---|---|
| Navegação + screenshots + crawl leve | `playwright` | Apache-2.0 | viewport desktop 1440×900 e mobile 390×844; crawler de home + internas (limite ~25 URLs) |
| Performance / SEO | `lighthouse` CLI ou `unlighthouse` | Apache-2.0 / MIT | scores + auditors por URL |
| Acessibilidade | `@axe-core/playwright` | MPL-2.0 | violações WCAG como evidência |
| Detecção de stack | Lighthouse `Technologies` gatherer | Apache-2.0 | substitui heurística regex da Fase 1 |
| Regressão visual | screenshots Playwright comparados | — | diffs em CI (não BackstopJS — stale) |

### Instalação (quando aprovada)

```bash
npm install -D playwright @axe-core/playwright
npx playwright install chromium          # ou canal --with-deps se a imagem exigir
npm install -D lighthouse                # CLI pontual
# unlighthouse (opcional, varredura em lote)
```

### Arquitetura futura do worker

```ts
// app/lib/money/audit-worker.ts (futuro — NÃO implementado)
interface AuditWorkerInput { url: string; leadId: string; }
interface AuditWorkerOutput {
  screenshots: string[];        // caminhos em reports/tmp/
  lighthouse: LighthouseResult; // ou null em modo mock
  axeViolations: AxeViolation[];
  evidence: Evidence[];         // pipeline Fase 1 reutilizado
}
```

Ordem sugerida:
1. Crawler leve → lista de URLs.
2. Para cada URL (limite): screenshot + Lighthouse (ou Unlighthouse).
3. axe-core na home.
4. Merge das evidências com o `scoring.ts` existente (reuso total).

### Modo mock / fallback

- Se Playwright/Lighthouse não estiverem instalados ou a API falhar,
  cair no pipeline da Fase 1 (regex) — nunca quebrar o fluxo comercial.
- Todo score de origem externa marcado na evidência (ex.: `performance`)
  para o briefing/prompt reportarem honestamente a fonte.

## Segurança e limites

- `reports/tmp/` no `.gitignore`; sem expor screenshots publicamente.
- Timeouts em todas as camadas; cancelamento via `AbortController`.
- `User-Agent` identificável; sem login, sem pagamento, sem autenticação em
  sites de terceiros.
- Nenhum dado sensível de lead persistido em logs.
- Aprovação humana obrigatória antes de qualquer abordagem comercial
  (padrão existente do Money Engine).
