# Architecture - SiteOps Money Engine

## Visao modular

O repositorio deve ser organizado em modulos independentes. Cada modulo recebe dados estruturados e devolve dados estruturados.

Fluxo:

```txt
Lead local
-> Lead Engine
-> Audit Engine
-> Scoring Engine
-> Proposal Engine
-> Site Builder Handoff
-> Claude/Codex em repo externo
-> Validacao Lighthouse
-> Deploy humano
```

## Modulos

### Lead Engine

Responsavel por cadastrar, importar e organizar empresas.

Entradas:

- dados manuais;
- CSV;
- futuramente Maxun;
- futuramente Google Maps/export externo, respeitando termos e limites.

Saidas:

- `Lead`;
- `BusinessProfile`;
- flags de completude.

### Audit Engine

Responsavel por avaliar o site/presenca digital.

Entradas:

- `Lead`;
- URL do site;
- dados manuais;
- resultado Firecrawl;
- resultado Lighthouse.

Saidas:

- `WebsiteAudit`;
- `ConversionAudit`;
- `TrustAudit`;
- `LocalSeoAudit`.

### Scoring Engine

Responsavel por transformar auditoria em score comercial.

Saidas:

- score geral;
- subnotas;
- motivo das notas;
- urgencia;
- prioridade de venda.

### Proposal Engine

Responsavel por gerar argumento comercial.

Saidas:

- diagnostico Markdown;
- proposta curta;
- lista de dores;
- plano de entrega 72h;
- perguntas para call.

### Site Builder Handoff

Responsavel por gerar material para Claude/Codex construir a landing.

Saidas:

- `briefing.json`;
- prompt completo;
- criterios de aceite da landing;
- checklist Lighthouse;
- sugestao de stack;
- conteudo que nao pode ser inventado.

### AI Layer

Toda IA deve passar por uma camada unica:

- provider Omniroute;
- provider mock;
- logs de uso;
- limite de tokens;
- prompts versionados;
- fallback manual.

## Organizacao sugerida de codigo

```txt
app/
  studio/
  leads/
  audits/
  proposals/

app/api/
  generate/               # existente: auditar e tornar opcional

app/lib/
  blueprint.ts            # existente
  siteops/
    leads/
    audits/
    scoring/
    proposals/
    handoff/
    ai/
    integrations/
      maxun/
      firecrawl/
      lighthouse/
      omniroute/
```

## Regra de dependencia

A UI nao deve chamar APIs externas diretamente. Ela chama servicos internos. Os servicos internos chamam adapters.

## Estado sem backend

O app deve continuar util mesmo sem IA e sem APIs externas:

- lead manual;
- auditoria manual/mock;
- scoring local;
- diagnostico template;
- briefing JSON;
- prompt pronto.
