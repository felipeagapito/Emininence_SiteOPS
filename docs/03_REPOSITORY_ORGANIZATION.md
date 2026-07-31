# Repository Organization

## Papel do repositorio atual

Este repositorio deve ser o cockpit do SiteOps Money Engine:

- organizar leads;
- gerar auditorias;
- criar diagnosticos;
- preparar propostas;
- gerar briefing/prompt para sites externos;
- manter documentacao, templates e contratos.

Ele nao deve guardar todos os sites de clientes na raiz do produto principal.

## Sites de clientes

Sites gerados para clientes devem ir para:

1. repositorios separados, preferencial; ou
2. pasta isolada `generated-sites/`, apenas para rascunho local; ou
3. branch separada por cliente, se for necessario.

Padrao de nome:

```txt
site-cliente-nicho-cidade
site-prime-calhas-joinville
site-clinica-x-curitiba
```

## Pastas recomendadas

```txt
docs/
  00_SITEOPS_MONEY_ENGINE_INDEX.md
  00_PRODUCT_BRIEF.md
  01_MVP_SCOPE.md
  02_ARCHITECTURE.md
  03_REPOSITORY_ORGANIZATION.md
  04_BACKEND_CLEANUP_DECISION.md
  05_INTEGRATIONS_MAXUN_FIRECRAWL_LIGHTHOUSE.md
  06_OMNIROUTE_AI_LAYER.md
  07_SITE_BUILDER_HANDOFF.md
  08_CLAUDE_REPOSITORY_AUDIT_PROMPT.md

templates/
  prompts/
  proposals/
  site-briefings/
  landing-acceptance/

data/
  samples/
    leads-example.csv
    audit-example.json
    briefing-example.json

scripts/
  run-lighthouse.ts
  generate-proposal.ts
  generate-site-briefing.ts
```

## Documentos que o Claude deve reconhecer

Ao iniciar uma tarefa, Claude deve listar se encontrou:

- `CLAUDE.md`;
- `README.md`;
- `docs/00_00_SITEOPS_MONEY_ENGINE_INDEX.md`;
- docs de arquitetura e escopo;
- docs de backend cleanup;
- docs de Omniroute;
- docs de handoff para site externo;
- prompts versionados.

Se algum documento estiver ausente, ele deve reportar antes de codar.

## Criterio de organizacao

Cada nova feature deve responder:

- qual modulo toca;
- quais dados recebe;
- quais dados devolve;
- qual arquivo de prompt usa, se usar IA;
- como funciona sem IA;
- como audita;
- como valida;
- como reverter.
