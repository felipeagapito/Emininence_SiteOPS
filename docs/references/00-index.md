# 00 — Índice de repositórios de referência

> Estado: **2026-08-01**. Fonte: clones rasos em `external/repos/` (git-ignorado),
> metadados via GitHub API, `README` e `LICENSE` lidos localmente. Nenhum código
> externo foi copiado para `app/`/`src/`. Antes de instalar qualquer coisa, leia
> README, LICENSE, atividade e issues recentes (regra do projeto).
>
> Legendas: ✅ **MVP** = candidato a uso real no produto · 🔎 **REF** = referência
> apenas · ⛔ **CUIDADO** = licença sensível ou pesado demais.

## Resumo executivo

**Entram no MVP (instalar/usar agora):**

| Ferramenta | Uso |
|---|---|
| `shadcn/ui` | base de componentes (Tailwind v4 + React 19) |
| `motion` | microinterações (já instalado, `motion@12.42.2`) |
| `lenis` | scroll de landing (já instalado, `lenis@1.3.25`) |
| `playwright` | captura de telas, crawling leve e acessibilidade |
| `@axe-core/playwright` | auditoria de acessibilidade (via npm, MPL) |
| `lighthouse` / `unlighthouse` | performance/SEO/acessibilidade por site |

**Já são dependências do runtime:** `motion`, `lenis`.

**Referência apenas por licença sensível:** `webstudio` (AGPL-3.0), `pa11y`/`pa11y-ci`
(LGPL-3.0), `animate-ui` e `react-bits` (MIT + Commons Clause), `awesome-claude-code`
(CC BY-NC-ND 4.0).

**Pesados ou exigem serviço:** `sitespeed.io` (Docker/Grafana), `Visual-Regression-Tracker`
(backend + Postgres), `plasmic` (~314 MB), `claude-mem` (~295 MB).

**Stack divergente (usar como ferramenta externa, não integrar):** `wappalyzergo` (Go),
`open-seo-crawler` (Python), `ccusage` (Rust CLI).

**Stale / inativos:** `BackstopJS` (última atividade 2024-09), `craft.js` (2025-02),
`originui` fork (2025-08).

## Tabela completa

| repo | categoria | função no Eminence SiteOps | instalar agora? | só referência? | licença | risco | motivo |
|---|---|---|---|---|---|---|---|
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | UI base | Base de componentes copy-paste (botões, inputs, cards, diálogos) | ✅ sim | não | MIT | baixo | É a base pedida no plano; CLI compatível com Tailwind v4 + React 19. Issues abertas altas (2k) são volume esperado de repo 120k★ |
| [shadcn/originui](https://github.com/shadcn/originui) | UI | Padrões premium de formulários/table/dashboard para copiar pontualmente | não | 🔎 sim | MIT | médio | É **fork stale** (12★, parado 2025-08, parent divergente). Conteúdo real do Origin UI, mas confira versão em `originui.com`/registry antes de copiar |
| [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | UI | Inspiração controlada para micro-interações decorativas | não | 🔎 sim | MIT | baixo | MIT e ativo; copiar só componentes pequenos e auditáveis após revisão |
| [imskyleen/animate-ui](https://github.com/imskyleen/animate-ui) | UI | Inspiração visual apenas | não | 🔎 sim (⛔) | MIT + Commons Clause | alto | Commons Clause proíbe uso comercial do código; **não copiar** |
| [birobirobiro/awesome-shadcn-ui](https://github.com/birobirobiro/awesome-shadcn-ui) | UI | Mapa de fontes de componentes shadcn para consulta | não | 🔎 sim | MIT | baixo | Lista curada; útil como índice, não dependência |
| [motiondivision/motion](https://github.com/motiondivision/motion) | Animação | Microinterações e entradas (feedback 120–260 ms, entradas 300–800 ms) | ✅ já instalado | não | MIT | baixo | Runtime core; repo grande (~1.6 GB com histórico), só o pacote npm entra no build |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | Animação | Scroll suave apenas em landing/campanhas | ✅ já instalado | não | MIT | baixo | Usar seletivo; dashboard operacional deve manter scroll nativo |
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | Animação | Inspiração para micro-interações | não | 🔎 sim (⛔) | MIT + Commons Clause | alto | Commons Clause; **não copiar** (já anotado em `docs/REPOSITORY_MATRIX.md`) |
| [plasmicapp/plasmic](https://github.com/plasmicapp/plasmic) | Builder | Referência de arquitetura de visual builder | não | 🔎 sim | MIT | médio | MIT mas plataforma inteira (~314 MB, multi-pacote). Fora do escopo MVP (não vamos virar builder agora) |
| [prevwong/craft.js](https://github.com/prevwong/craft.js) | Builder | Referência de editor de páginas em React | não | 🔎 sim | MIT | médio | MIT, mas stale (2025-02). Fora do escopo MVP |
| [GrapesJS/grapesjs](https://github.com/GrapesJS/grapesjs) | Builder | Referência de page builder para futuro handoff de site | não | 🔎 sim | BSD-3-Clause | médio | Licença ok, mas pesado (~114 MB) e fora do escopo MVP |
| [webstudio-is/webstudio](https://github.com/webstudio-is/webstudio) | Builder | Referência conceitual de visual builder + AI | não | 🔎 sim (⛔) | AGPL-3.0 | alto | **AGPL**: qualquer modificação distribuída obriga abrir o código. Referência conceitual apenas |
| [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Análise | Performance/SEO/acessibilidade via CLI ou `@lhci/cli` | ✅ sim | não | Apache-2.0 | baixo | Padrão de facto; ativo. Usar como CLI ou API, não como bundle |
| [harlan-zw/unlighthouse](https://github.com/harlan-zw/unlighthouse) | Análise | Varredura do site inteiro com Lighthouse, leve e com UI | ✅ sim | não | MIT | baixo | Leve (~36 MB), ativo, em cima de Chrome headless. Ótimo para auditoria em lote |
| [sitespeedio/sitespeed.io](https://github.com/sitespeedio/sitespeed.io) | Análise | Benchmark de performance profundo | não | 🔎 sim (⛔) | MIT | alto | **Pesado**: Docker, Grafana, servidor. Fere a regra de "evitar Docker/serviços pesados" |
| [microsoft/playwright](https://github.com/microsoft/playwright) | Análise | Screenshots, captura de DOM, navegação e a11y (`@axe-core/playwright`) | ✅ sim | não | Apache-2.0 | baixo | Motor de automação do pipeline de auditoria |
| [garris/BackstopJS](https://github.com/garris/BackstopJS) | Análise | Regressão visual de referência | não | 🔎 sim | MIT | médio | MIT mas **stale** (2024-09). Preferir screenshots do Playwright para regressão |
| [Visual-Regression-Tracker/Visual-Regression-Tracker](https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker) | Análise | Dashboard de regressão visual | não | 🔎 sim (⛔) | Apache-2.0 | alto | Exige backend + Postgres. Pesado para a máquina de desenvolvimento |
| [pa11y/pa11y](https://github.com/pa11y/pa11y) | Análise | Auditoria de acessibilidade via CLI | não | 🔎 sim (⛔) | LGPL-3.0 | médio | **LGPL**: usar só como CLI externa, não incorporar. Preferir `axe-core` (npm, MPL) |
| [pa11y/pa11y-ci](https://github.com/pa11y/pa11y-ci) | Análise | CI de acessibilidade (wrapper de pa11y) | não | 🔎 sim (⛔) | LGPL-3.0 | médio | Mesma restrição LGPL; usar `@axe-core/playwright` no lugar |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | Análise | Motor de regras de acessibilidade WCAG | ✅ sim | não | MPL-2.0 | baixo | MPL é copyleft de arquivo: usar como dependência npm é padrão; **não modificar** os arquivos do axe |
| [projectdiscovery/wappalyzergo](https://github.com/projectdiscovery/wappalyzergo) | Análise | Detecção de tecnologias do alvo | não | 🔎 sim | MIT | médio | É **Go**. O Lighthouse já detecta tecnologias nativamente (Technologies gatherer) — preferir isso |
| [puneetindersingh/open-seo-crawler](https://github.com/puneetindersingh/open-seo-crawler) | Análise | Crawler técnico de SEO (links, metas, H1, redirects, erros) | não | 🔎 sim | MIT | médio | É **Python** self-hosted e repo novo (17★). Manter como ferramenta externa; para o produto, um crawler Node leve com Playwright é mais alinhado |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | Workflow | Memória persistente para Claude Code | não | 🔎 sim | Apache-2.0 | médio | Ótimo, mas ~295 MB e muda a operação de memória do repo. Avaliar como piloto separado, não no MVP |
| [ccusage/ccusage](https://github.com/ccusage/ccusage) | Workflow | Medição de custo/uso do Claude Code | não | 🔎 sim | MIT | baixo | CLI **Rust**. Útil como ferramenta de dev, não como dependência |
| [github/spec-kit](https://github.com/github/spec-kit) | Workflow | Processo spec-driven para agentes de IA | não | 🔎 sim (piloto) | MIT | baixo | MIT, ativo, oficial do GitHub. Bom candidato para adotar fluxo de specs nas próximas features do SiteOps |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Workflow | Índice de ferramentas/recursos Claude Code | não | 🔎 sim (⛔) | CC BY-NC-ND 4.0 | médio | Licença de conteúdo: **não copiar** a lista; apenas referenciar/linkar |
| [obra/superpowers](https://github.com/obra/superpowers) | Workflow | Metodologia de skills/planos para agentes | não | 🔎 sim (piloto) | MIT | baixo | MIT, ativo e popular. Adaptar práticas (skills de planejamento) para o fluxo SiteOps |

## Estado atual dos clones (2026-08-01)

**Presentes em `external/repos/` (12):**

| repo | clone | uso |
|---|---|---|
| `shadcn-ui/ui` | ✅ | base de componentes (MVP) |
| `motiondivision/motion` | ✅ | microinterações (runtime) |
| `darkroomengineering/lenis` | ✅ | scroll de landing (runtime) |
| `microsoft/playwright` | ✅ | captura/crawl (Fase 2) |
| `GoogleChrome/lighthouse` | ✅ | perf/SEO/a11y (Fase 2) |
| `harlan-zw/unlighthouse` | ✅ | varredura em lote (Fase 2) |
| `dequelabs/axe-core` | ✅ | regras WCAG (Fase 2) |
| `magicuidesign/magicui` | ✅ | inspiração controlada (REF) |
| `github/spec-kit` | ✅ | processo spec-driven (REF) |
| `obra/superpowers` | ✅ | skills/planos para agentes (REF) |
| `ccusage/ccusage` | ✅ | CLI Rust de uso (ferramenta externa) |
| `thedotmack/claude-mem` | ✅ | memória de agentes (ferramenta externa) |

**Removidos do disco (16) — ver seção "Removidos em 2026-08-01":**
`plasmic`, `sitespeed.io`, `react-bits`, `webstudio`, `BackstopJS`,
`Visual-Regression-Tracker`, `animate-ui`, `craft.js`, `grapesjs`,
`wappalyzergo`, `open-seo-crawler`, `pa11y`, `pa11y-ci`, `awesome-claude-code`,
`awesome-shadcn-ui`, `originui`.

> Nenhum repo externo tem código copiado para `app/`/`src/`/componentes. Uso
> restrito a padrões, arquitetura e inspiração (regra do `CLAUDE.md`).

## Regras de uso (resumo)

1. Nada de `external/repos/` é commitado (`.gitignore`). É consulta local.
2. Copiar código para `app/`/`src/` exige auditoria prévia de licença e
   compatibilidade — mesmo em repos MIT (ver `03-ui-quality-stack.md`).
3. AGPL, GPL, LGPL, Commons Clause, CC BY-NC-ND → **referência apenas**.
4. Repos pesados (Docker, backend, Go/Rust/Python) ficam como ferramenta externa
   ou inspiração — não entram no build do produto.
5. Antes de qualquer instalação real: ler `README`, `LICENSE`, atividade e issues
   recentes; registrar decisão aqui.

## Removidos em 2026-08-01 (limpeza de peso)

| Repo | Motivo da remoção |
|---|---|
| `plasmic` (293 MB) | Builder visual completo, fora do escopo MVP |
| `sitespeed.io` (118 MB) | Requer Docker + Grafana, pesado demais |
| `react-bits` (105 MB) | MIT + Commons Clause — não pode ser usado comercialmente |
| `webstudio` (47 MB) | AGPL-3.0 — qualquer modificação obriga abrir código |
| `BackstopJS` (34 MB) | Stale (2024-09), preferir screenshots do Playwright |
| `Visual-Regression-Tracker` (26 MB) | Requer backend + Postgres |
| `animate-ui` (21 MB) | MIT + Commons Clause — não pode ser usado comercialmente |
| `craft.js` (14 MB) | Stale (2025-02), fora do escopo MVP |
| `grapesjs` (12 MB) | Page builder completo, fora do escopo MVP |
| `wappalyzergo` (4.6 MB) | Go binary, usar Lighthouse Technologies gatherer |
| `open-seo-crawler` (1.2 MB) | Python self-hosted, usar Playwright leve |
| `pa11y` (1.4 MB) | LGPL-3.0, usar @axe-core/playwright |
| `pa11y-ci` (864 KB) | LGPL wrapper de pa11y |
| `awesome-claude-code` (5.6 MB) | CC BY-NC-ND 4.0 — não copiável |
| `awesome-shadcn-ui` (2.7 MB) | Lista curada, não precisa local |
| `originui` (17 MB) | Fork stale (2025-08), usar originui.com |

**Total removido:** ~696 MB de `external/repos/`.

_Atualização de clones: `bash scripts/siteops/sync-references.sh`._
