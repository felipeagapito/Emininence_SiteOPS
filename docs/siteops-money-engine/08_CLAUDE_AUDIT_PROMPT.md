# Claude Audit Prompt

Use este prompt para o Claude auditar o repositorio antes de implementar ou limpar backend.

```txt
Voce vai auditar o repositorio felipeagapito/Emininence_SiteOPS com foco em transformar o projeto em SiteOps Money Engine Lite.

Contexto do produto:
O objetivo nao e criar um Webflow/Framer proprio agora. O objetivo e criar um motor comercial que:
1. cadastra/importa leads locais;
2. identifica negocios sem site, com site ruim ou baixa conversao;
3. audita presenca digital;
4. calcula score comercial;
5. gera diagnostico/proposta;
6. gera briefing.json;
7. gera prompt pronto para Claude/Codex construir uma landing/site em outro repositorio.

Leia obrigatoriamente:
- README.md
- CLAUDE.md
- package.json
- app/api/generate/route.ts se existir
- docs/AI_SETUP.md se existir
- docs/siteops-money-engine/00_PRODUCT_BRIEF.md
- docs/siteops-money-engine/01_MVP_SCOPE_AND_ROADMAP.md
- docs/siteops-money-engine/02_ARCHITECTURE.md
- docs/siteops-money-engine/03_DATA_MODEL_AND_SCORING.md
- docs/siteops-money-engine/04_INTEGRATIONS_AND_OMNIROUTE.md
- docs/siteops-money-engine/05_SECURITY_AND_OPERATING_RULES.md
- docs/siteops-money-engine/06_SITE_BUILDER_HANDOFF.md
- docs/siteops-money-engine/07_CLAUDE_IMPLEMENTATION_PROMPT.md

Audite e responda em portugues, com postura critica.

Parte 1 - Inventario tecnico
Liste:
- stack real detectada;
- estrutura atual de pastas;
- rotas importantes;
- componentes principais;
- backends/API routes existentes;
- dependencias de IA;
- dependencias de 3D/visual;
- docs tecnicos existentes;
- lacunas de documentacao.

Parte 2 - O que atrapalha o novo plano
Identifique:
- backend que pode gerar custo, travar MVP ou ficar inseguro;
- codigo de IA espalhado fora de uma camada central;
- acoplamento entre UI, IA, scoring e geracao;
- partes 3D/experience studio que confundem o produto comercial;
- arquivos redundantes;
- docs antigas que contradizem o novo plano;
- dependencias desnecessarias para o MVP;
- riscos de secrets, envs e exposicao de API.

Parte 3 - O que deve ser mantido
Liste o que deve ser preservado:
- UI aproveitavel;
- componentes bons;
- docs uteis;
- setup de IA aproveitavel;
- estrutura que pode virar Studio;
- templates ou prompts bons;
- qualquer recurso que acelere o MVP.

Parte 4 - O que remover, isolar ou adiar
Classifique cada item em uma tabela:

| Item | Acao | Motivo | Risco | Como validar |
|---|---|---|---|---|

Acoes permitidas na classificacao:
- manter;
- remover;
- mover para modulo opcional;
- adiar;
- refatorar;
- documentar melhor.

Nao execute remocoes ainda. Apenas recomende.

Parte 5 - Documentos tecnicos
Verifique se os documentos em docs/siteops-money-engine cobrem:
- objetivo do produto;
- escopo MVP;
- arquitetura;
- modelo de dados;
- scoring;
- integracoes;
- Omniroute;
- seguranca;
- workflow;
- handoff para construcao externa de site;
- criterio de aceite;
- prompt de implementacao.

Diga:
- o que esta bom;
- o que esta duplicado;
- o que esta faltando;
- o que deve virar README;
- o que deve ficar somente em docs;
- o que deve ser removido ou reescrito.

Parte 6 - O que precisa baixar ou instalar
Liste apenas o necessario para o proximo ciclo:
- dependencias npm necessarias;
- ferramentas CLI necessarias;
- libs que ja existem e nao devem ser duplicadas;
- integracoes que podem ficar mockadas;
- chaves externas que so entram depois.

Nao recomende Docker se nao for indispensavel.
Nao recomende banco local pesado.
Nao recomende clonar Maxun/Firecrawl dentro deste repo.

Parte 7 - Plano de implementacao seguro
Monte um plano em fases pequenas:
1. documentacao/limpeza;
2. tipos e schemas;
3. scoring deterministico;
4. diagnostico/proposta;
5. briefing.json;
6. mock UI;
7. AI provider abstraction;
8. Firecrawl/Lighthouse;
9. Maxun.

Para cada fase, inclua:
- arquivos provaveis;
- validacao;
- criterio de aceite;
- rollback.

Parte 8 - Prompt final para implementar
Depois da auditoria, gere um prompt curto e preciso para um novo ciclo do Claude Code implementar apenas a Fase 1.

Regras de seguranca:
- nao adicione secrets;
- nao apague arquivos sem justificar;
- nao implemente envio externo;
- nao implemente deploy automatico;
- nao torne Omniroute obrigatorio;
- mantenha AI_PROVIDER=mock funcionando;
- revise git diff antes de finalizar;
- rode lint/build/test se existirem.

Formato da resposta:
1. Veredito curto.
2. Inventario tecnico.
3. Riscos e bloqueios.
4. Documentos encontrados e faltantes.
5. Tabela manter/remover/isolar/adiar.
6. Plano de implementacao.
7. Prompt final para proximo ciclo.
```
