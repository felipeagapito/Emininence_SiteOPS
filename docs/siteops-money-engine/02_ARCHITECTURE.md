# Architecture

## Visao geral

O SiteOps Money Engine deve ser dividido em modulos pequenos e testaveis:

1. Lead Engine;
2. Audit Engine;
3. Scoring Engine;
4. Proposal Engine;
5. Site Builder Handoff;
6. AI Layer;
7. Integrations Layer;
8. Audit Logs.

O sistema nao deve misturar UI, IA, scraping e scoring no mesmo arquivo.

## Fluxo ponta a ponta

```text
Lead local
-> cadastro/importacao
-> auditoria manual/mock/Firecrawl/Lighthouse
-> score comercial
-> diagnostico
-> proposta
-> briefing.json
-> prompt para Claude/Codex
-> site em repo separado
-> validacao Lighthouse
-> deploy aprovado por humano
```

## Estrutura sugerida

```text
src/
  app/
  components/
  modules/
    leads/
    audits/
    scoring/
    proposals/
    site-briefings/
    ai/
    integrations/
      firecrawl/
      lighthouse/
      maxun/
      omniroute/
  lib/
    env/
    security/
    audit/
    reports/
  types/
templates/
  prompts/
  proposals/
  site-briefings/
  landing-pages/
data/
  samples/
scripts/
  run-lighthouse.ts
  generate-proposal.ts
  test-site-briefing.ts
docs/
  siteops-money-engine/
```

## Lead Engine

Responsavel por:

- cadastro manual de leads;
- importacao CSV;
- origem do lead;
- deduplicacao;
- status comercial;
- filtros por cidade, nicho e prioridade.

Nao deve fazer scraping direto no core. Maxun entra como adapter externo.

## Audit Engine

Responsavel por avaliar a presenca digital do lead.

Entradas:

- URL do site;
- dados manuais;
- resultado Firecrawl;
- resultado Lighthouse;
- observacoes do operador.

Saidas:

- checklist tecnico-comercial;
- problemas detectados;
- evidencias;
- recomendacoes brutas para scoring.

## Scoring Engine

Responsavel por transformar auditoria em score comercial.

Dimensoes:

- presenca digital;
- performance;
- SEO local;
- conversao;
- confianca;
- urgencia de venda.

O score deve ser deterministico primeiro. IA pode explicar o score, mas nao deve ser a unica fonte do calculo.

## Proposal Engine

Responsavel por gerar:

- diagnostico em Markdown;
- resumo executivo;
- proposta de melhoria;
- escopo de entrega em 72h;
- argumentos comerciais para ligacao/WhatsApp.

## Site Builder Handoff

Responsavel por gerar artefatos para o Claude/Codex construir o site externo:

- `briefing.json`;
- prompt completo;
- checklist de aceite;
- informacoes proibidas de inventar;
- assets necessarios;
- CTAs e secoes recomendadas.

## AI Layer

Toda IA deve passar por um unico client:

```text
src/modules/ai/aiClient.ts
```

Esse client deve controlar:

- provider ativo;
- modelo;
- timeout;
- limite de tokens;
- fallback mock;
- logs de uso;
- versao do prompt;
- erros sem expor secrets.

## Integrations Layer

Integrações sao adapters opcionais:

- Firecrawl: leitura/crawl de sites;
- Lighthouse: metricas tecnicas;
- Maxun: coleta estruturada de leads;
- Omniroute: roteamento de modelos de IA.

Nenhuma integracao deve ser obrigatoria para rodar o app local.

## Decisao sobre backend atual

Se existir rota backend de IA ja criada, ela deve ser revisada e possivelmente isolada.

Regras:

- nao remover codigo util sem revisar;
- mover chamadas de IA para `aiClient.ts`;
- manter mock/fallback;
- documentar envs;
- impedir chave real no codigo;
- nao manter rota aberta que permita custo infinito.
