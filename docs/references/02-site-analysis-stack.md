# 02 — Stack e arquitetura de análise de sites

> Alvo: o Eminence SiteOps como cockpit de inteligência comercial — auditamos a
> presença digital de um lead e geramos score/urgência/proposta. A análise roda
> **server-side** (fora do bundle do navegador), em Chrome headless gerenciado
> pelo Node — sem Docker, sem serviços pesados.

## Visão geral do pipeline

```
Lead URL
  │
  ├─ 1. Crawler leve (Playwright) ────→ links, título, metas, H1, redirects, erros
  ├─ 2. Screenshot + captura (Playwright) → viewport desktop/mobile + DOM/DOMSnapshot
  ├─ 3. Performance/SEO (Lighthouse CLI ou Unlighthouse) → scores + auditors
  ├─ 4. Acessibilidade (@axe-core/playwright) → violações WCAG
  ├─ 5. Detecção de tecnologias (Lighthouse Technologies / WappalyzerGo externo)
  └─ 6. Regressão visual (screenshots do Playwright, comparados em CI) → diffs
        │
        └─ Evidências persistidas (sem secrets) → score + briefing (app/lib/money/)
```

## Camadas e ferramentas

### 1. Captura e crawling — **Playwright** (Apache-2.0) ✅ MVP

- Motor principal: `playwright` + Chromium headless, com fallback de canal
  (`--with-deps` não necessário na imagem base já provisionada).
- **Screenshots**: viewport desktop (1440×900) e mobile (390×844) por lead;
  salvar em `reports/tmp/` (git-ignorado) e nunca expor via rota pública sem
  autenticação.
- **Crawling leve**: percorrer home + páginas internas (limite de profundidade,
  ex.: 25 URLs) coletando título, meta description, H1, links, redirects
  (follow) e status HTTP por página.
- Rodar com timeout global e política de navegação conservadora para não travar
  máquina fraca. Uma auditoria por vez.

### 2. Performance / SEO / acessibilidade — **Lighthouse** (Apache-2.0) ✅ MVP

- **CLI do Lighthouse** para auditoria pontual (uma URL). Flag `--chrome-flags`
  com `--headless` e `--no-sandbox` em CI.
- **Unlighthouse** (MIT, leve) ✅ quando quiser **o site inteiro**: varre todas
  as URLs com smart sampling e UI de resultado. Ideal para o cockpit "auditar
  presença digital" de um lead com várias páginas.
- Extrair em JSON: `performance`, `seo`, `accessibility`, `best-practices`,
  `categories`, e auditors-chave (LCP, CLS, INP, `document-title`,
  `meta-description`, `h1`, `image-alt`). Esses viram inputs do score do Money Engine.
- **Nunca** rodar no bundle do navegador; sempre em worker/CLI server-side.

### 3. Acessibilidade — **axe-core** (MPL-2.0) ✅ MVP, via `@axe-core/playwright`

- `@axe-core/playwright` injeta as regras WCAG do axe no contexto do Playwright
  e retorna violações estruturadas (id, impact, nodes).
- Preferido a pa11y por licença (MPL vs LGPL) e integração direta com Playwright.
- **pa11y / pa11y-ci (LGPL-3.0)** → referência apenas; se um dia precisarmos,
  usar como CLI externa, sem incorporar código.
- Regra: MPL é copyleft de arquivo — usar o pacote como dependência, **não
  modificar** os arquivos do axe-core.

### 4. Regressão visual — screenshots do Playwright ✅ MVP (BackstopJS só como ref)

- Comparar screenshots de duas auditorias (ex.: baseline vs atual) com
  `pixelmatch` (lightweight) dentro do próprio pipeline — sem serviço extra.
- **BackstopJS** (MIT) → referência apenas: funcional e bom, mas **stale**
  (última atividade 2024-09) e adiciona uma camada de Puppeteer. Se a regressão
  visual virar requisito central, reavaliar.
- **Visual-Regression-Tracker** → referência apenas: exige backend + Postgres,
  pesado para o MVP.

### 5. Detecção de tecnologias — **Lighthouse Technologies** ✅ MVP

- O gatherer `technologies` do Lighthouse já detecta framework, CMS, analytics,
  etc., sem dependência extra.
- **WappalyzerGo** (MIT, Go) → referência apenas por stack. Alternativa JS:
  o pacote `wappalyzer` recente é **GPL** — evitar. Usar o gatherer do
  Lighthouse; se precisar de mais fingerprints, rodar WappalyzerGo como binário
  externo.

### 6. Crawler SEO (técnico) — **Node/Playwright leve** ✅ MVP (open-seo-crawler só ref)

- Construir um crawler pequeno em Node com Playwright (links, títulos, metas,
  H1, redirects, status, `robots.txt`, `sitemap.xml`) — cabe em ~200 linhas e
  fica sob nosso controle de licença (código próprio).
- **open-seo-crawler** (MIT, Python self-hosted) → referência apenas / ferramenta
  externa opcional: é Python, roda como serviço com auto-update e foge do nosso
  runtime. Como é repo novo (17★), não é base confiável para o MVP.

## Regras operacionais

- **Server-side sempre**: nunca chamar Chrome/Lighthouse/axe do cliente.
- **Sem secrets**: URLs e resultados de auditoria não contêm tokens; persistir
  evidências em `reports/tmp/` (ignorado) e no DB com dados mínimos.
- **Máquina fraca**: uma auditoria por vez, limite de URLs por lead, timeout
  global (ex.: 120 s), `chromium` headless com `--disable-dev-shm-usage`.
- **Fallback**: se a análise falhar (site fora do ar, bloqueio), gravar o erro e
  seguir com score parcial — nunca travar o fluxo de proposta.
- **Licenças**: MPL/LGPL/AGPL nunca entram no bundle; Apache/MIT/BSD são
  auditados caso a caso antes de copiar qualquer trecho.

## Candidatos finais por camada (MVP)

| Camada | Escolha | Licença | Nota |
|---|---|---|---|
| Automação/captura | Playwright | Apache-2.0 | motor único |
| Acessibilidade | @axe-core/playwright | MPL-2.0 | uso como dep |
| Perf/SEO | Lighthouse CLI + Unlighthouse | Apache-2.0 / MIT | CLI/worker |
| Tech detection | Lighthouse Technologies | Apache-2.0 | sem dep extra |
| Crawler SEO | Node/Playwright próprio | MIT (nosso) | controle total |
| Regressão visual | Playwright + pixelmatch | Apache-2.0 / MIT | leve |

## Referência apenas (não instalar agora)

- sitespeed.io (Docker/Grafana), Visual-Regression-Tracker (Postgres),
  pa11y/pa11y-ci (LGPL), wappalyzergo (Go), open-seo-crawler (Python),
  BackstopJS (stale).
