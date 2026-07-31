# MVP Scope And Roadmap

## Principio do MVP

O primeiro MVP deve provar venda, nao provar tecnologia.

A entrega inicial precisa funcionar mesmo sem IA real, sem Maxun real, sem Firecrawl real e sem backend pesado. As integracoes entram por adapters quando o fluxo manual/mockado estiver validado.

## MVP seguro

A primeira versao deve permitir:

1. cadastrar ou importar leads locais manualmente;
2. registrar dados basicos do negocio;
3. registrar site atual ou marcar `sem_site`;
4. rodar auditoria mockada ou manual;
5. calcular score comercial;
6. gerar diagnostico em Markdown;
7. gerar proposta simples;
8. gerar `briefing.json`;
9. gerar prompt pronto para Claude/Codex criar a landing externa;
10. exportar diagnostico/briefing.

## Fase 1 - Engine manual vendavel

Objetivo: vender os primeiros diagnosticos/sites sem depender de automacao pesada.

Entregas:

- modelo de dados local;
- formulario de lead;
- importacao CSV simples;
- score comercial deterministicamente calculado;
- diagnostico Markdown;
- proposta comercial;
- briefing de site;
- prompt de site generation;
- exemplos em `data/samples` ou `templates`.

Criterio de aceite:

- um lead de exemplo gera diagnostico e briefing completo;
- o briefing pode ser colado no Claude/Codex e virar landing;
- o app roda sem chave externa;
- nenhuma action destrutiva ou envio automatico existe.

## Fase 2 - Integracoes controladas

Objetivo: automatizar coleta e auditoria sem perder controle.

Entregas:

- adapter Firecrawl;
- script Lighthouse;
- adapter Omniroute;
- logs de uso de IA;
- modo mock/fallback;
- historico de auditorias;
- export PDF opcional.

Criterio de aceite:

- falha de API nao quebra o fluxo;
- usuario consegue rodar em modo mock;
- custos e tokens sao registrados;
- prompts estao versionados.

## Fase 3 - Lead Engine

Objetivo: acelerar prospeccao.

Entregas:

- adapter Maxun;
- importacao CSV de leads extraidos;
- deduplicacao;
- filtros por cidade, nicho e status;
- ranking por oportunidade;
- pipeline simples: novo, analisado, proposta gerada, contato feito, fechado, perdido.

Criterio de aceite:

- nao existe scraping em massa sem limite;
- fontes ficam registradas;
- dados pessoais sao minimizados;
- existe revisao humana antes de contato externo.

## Fase 4 - SiteOps operacional

Objetivo: reduzir retrabalho na entrega de sites.

Entregas:

- geracao de pasta/repo de site via template;
- PR/previews;
- checklist Lighthouse antes/depois;
- biblioteca de templates por nicho;
- comparativo de site atual vs novo.

Criterio de aceite:

- nenhum deploy automatico sem aprovacao;
- cada site gerado tem briefing rastreavel;
- cada proposta tem origem, data e lead.

## Ordem de implementacao recomendada

1. Documentacao e contratos.
2. Tipos e schemas.
3. CRUD/importacao manual de leads.
4. Auditoria mockada.
5. Scoring.
6. Diagnostico/proposta.
7. Briefing JSON.
8. Prompt de site externo.
9. Firecrawl.
10. Lighthouse.
11. Omniroute.
12. Maxun.
