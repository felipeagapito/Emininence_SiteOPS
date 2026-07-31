# SiteOps Money Engine Docs

Esta pasta consolida as decisoes atuais para transformar o `Emininence_SiteOPS` em um motor comercial leve.

## Decisao resumida

O repositorio atual deve virar cockpit/documentacao/studio do SiteOps Money Engine.

Na primeira fase, ele nao deve construir sites internamente. Ele deve gerar:

- lead qualificado;
- auditoria;
- score comercial;
- diagnostico;
- proposta;
- `briefing.json`;
- prompt pronto para Claude/Codex construir a landing em outro repositorio.

## Ordem de leitura

1. [00_PRODUCT_BRIEF.md](./00_PRODUCT_BRIEF.md)
2. [01_MVP_SCOPE_AND_ROADMAP.md](./01_MVP_SCOPE_AND_ROADMAP.md)
3. [02_ARCHITECTURE.md](./02_ARCHITECTURE.md)
4. [03_DATA_MODEL_AND_SCORING.md](./03_DATA_MODEL_AND_SCORING.md)
5. [04_INTEGRATIONS_AND_OMNIROUTE.md](./04_INTEGRATIONS_AND_OMNIROUTE.md)
6. [05_SECURITY_AND_OPERATING_RULES.md](./05_SECURITY_AND_OPERATING_RULES.md)
7. [06_SITE_BUILDER_HANDOFF.md](./06_SITE_BUILDER_HANDOFF.md)
8. [07_CLAUDE_IMPLEMENTATION_PROMPT.md](./07_CLAUDE_IMPLEMENTATION_PROMPT.md)
9. [08_CLAUDE_AUDIT_PROMPT.md](./08_CLAUDE_AUDIT_PROMPT.md)

## Como usar agora

1. Passe o `08_CLAUDE_AUDIT_PROMPT.md` para o Claude auditar o repo.
2. Se a auditoria confirmar que a estrutura atual pode ser reaproveitada, use o `07_CLAUDE_IMPLEMENTATION_PROMPT.md`.
3. A primeira implementacao deve ser manual/mockada.
4. Firecrawl, Lighthouse, Maxun e Omniroute entram depois por adapters.

## Regra de ouro

O SiteOps deve vender antes de automatizar tudo.

Primeiro: provar dor, gerar diagnostico e vender landing em 72h.
Depois: automatizar coleta, IA, dashboards, templates e deploy assistido.
