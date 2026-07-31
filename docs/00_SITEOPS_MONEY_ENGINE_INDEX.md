# SiteOps Money Engine - Indice Tecnico

Este pacote de documentacao redefine o papel inicial do Eminence SiteOps.

Decisao central: o repositorio atual deve funcionar primeiro como cockpit comercial e motor de inteligencia, nao como builder completo de sites. Ele encontra leads, audita presenca digital, gera score, diagnostico, proposta e um briefing pronto para Claude/Codex construir a landing em um repositorio separado.

## Ordem de leitura para agentes

1. `docs/00_SITEOPS_MONEY_ENGINE_INDEX.md`
2. `docs/00_PRODUCT_BRIEF.md`
3. `docs/01_MVP_SCOPE.md`
4. `docs/02_ARCHITECTURE.md`
5. `docs/03_REPOSITORY_ORGANIZATION.md`
6. `docs/04_BACKEND_CLEANUP_DECISION.md`
7. `docs/05_INTEGRATIONS_MAXUN_FIRECRAWL_LIGHTHOUSE.md`
8. `docs/06_OMNIROUTE_AI_LAYER.md`
9. `docs/07_SITE_BUILDER_HANDOFF.md`
10. `docs/08_CLAUDE_REPOSITORY_AUDIT_PROMPT.md`

## Principios

- Vender diagnostico e clareza antes de construir plataforma grande.
- Usar IA como camada assistida, com logs e fallback.
- Nao enviar mensagens, raspar em massa, deletar dados ou publicar site sem confirmacao humana.
- O primeiro MVP deve funcionar com entrada manual ou CSV antes de Maxun/Firecrawl reais.
- O site do cliente deve ser gerado em outro repositorio ou pasta isolada, usando briefing versionado.
- Backend atual de IA deve ser auditado e tornado opcional antes de novas integracoes.

## Saida esperada do MVP

Um lead local entra no sistema e sai com:

- score comercial;
- diagnostico tecnico/comercial;
- proposta em Markdown;
- briefing JSON para criacao de landing;
- prompt pronto para Claude/Codex criar o site;
- checklist de validacao Lighthouse e deploy.
