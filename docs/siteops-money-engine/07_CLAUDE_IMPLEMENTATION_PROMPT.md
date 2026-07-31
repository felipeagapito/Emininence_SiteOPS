# Claude Implementation Prompt

Use este prompt para pedir ao Claude Code para implementar a nova fase do SiteOps sem baguncar o repositorio.

```txt
Voce esta trabalhando no repositorio felipeagapito/Emininence_SiteOPS.

Contexto:
O projeto deve evoluir para SiteOps Money Engine Lite. Ele nao deve ser um builder visual completo no MVP. Ele deve ser um cockpit/motor comercial que cadastra ou importa leads locais, audita presenca digital, calcula score comercial, gera diagnostico/proposta e produz um briefing.json + prompt para Claude/Codex construir o site do cliente em outro repositorio.

Antes de codar:
1. Leia estes documentos na integra:
   - docs/siteops-money-engine/00_PRODUCT_BRIEF.md
   - docs/siteops-money-engine/01_MVP_SCOPE_AND_ROADMAP.md
   - docs/siteops-money-engine/02_ARCHITECTURE.md
   - docs/siteops-money-engine/03_DATA_MODEL_AND_SCORING.md
   - docs/siteops-money-engine/04_INTEGRATIONS_AND_OMNIROUTE.md
   - docs/siteops-money-engine/05_SECURITY_AND_OPERATING_RULES.md
   - docs/siteops-money-engine/06_SITE_BUILDER_HANDOFF.md
2. Leia o README, CLAUDE.md, package.json e a estrutura atual do app.
3. Identifique se existe backend de IA em app/api/generate/route.ts ou similar.
4. Nao remova codigo antes de entender o que ele faz.

Objetivo da primeira implementacao:
Criar a base funcional manual/mockada do SiteOps Money Engine.

Escopo permitido:
- ajustar documentacao se encontrar incoerencia;
- criar tipos/schemas para leads, audits, scores, proposals e site briefings;
- criar modulo de scoring deterministico;
- criar exemplo de lead e auditoria mockada;
- gerar diagnostico Markdown;
- gerar proposal Markdown;
- gerar briefing.json;
- gerar prompt final para construcao externa do site;
- criar pagina ou fluxo simples para demonstrar o resultado;
- criar testes unitarios para scoring;
- manter IA real opcional.

Escopo proibido:
- nao criar agente autonomo;
- nao enviar WhatsApp/email;
- nao fazer deploy automatico;
- nao integrar scraping em massa;
- nao inserir secrets reais;
- nao usar service_role no frontend;
- nao tornar OpenRouter/Omniroute obrigatorio para o app rodar;
- nao clonar Maxun, Firecrawl ou Lighthouse dentro do repo;
- nao criar builder visual completo.

Regra para backend de IA existente:
Se houver rota /api/generate ou equivalente, audite e proponha uma das opcoes:
A) manter como opcional e colocar limites/fallback;
B) mover logica para src/modules/ai/aiClient.ts;
C) desativar temporariamente se estiver atrapalhando o MVP.
Nao apague sem explicar o impacto.

Arquitetura esperada:
- src/modules/leads
- src/modules/audits
- src/modules/scoring
- src/modules/proposals
- src/modules/site-briefings
- src/modules/ai
- src/modules/integrations
- templates/prompts
- data/samples

Criterios de aceite:
- npm install funciona;
- npm run lint funciona;
- npm run build funciona;
- testes de scoring passam;
- app roda localmente;
- um lead de exemplo gera score, diagnostico, proposta, briefing.json e prompt de site;
- app funciona com AI_PROVIDER=mock;
- nenhuma chave real foi adicionada;
- nenhum envio externo foi implementado;
- README ou docs indicam como validar.

Saida esperada:
Ao final, entregue:
- resumo do que foi alterado;
- arquivos criados/editados;
- comandos executados;
- resultado de lint/build/test;
- riscos pendentes;
- recomendacao do proximo passo;
- diff revisado por voce antes de finalizar.
```
