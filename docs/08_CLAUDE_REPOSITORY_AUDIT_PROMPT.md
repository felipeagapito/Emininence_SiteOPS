# Claude Repository Audit Prompt

Use este prompt no Claude Code dentro do repositorio `Emininence_SiteOPS`.

```txt
Voce esta auditando o repositorio felipeagapito/Emininence_SiteOPS para transformar o projeto em SiteOps Money Engine Lite.

Contexto:
O repositorio atual ja tem uma experiencia visual/studio e uma rota backend de IA com OpenRouter em app/api/generate/route.ts. A decisao atual e manter este repositorio como cockpit comercial e motor de inteligencia, nao como builder completo de sites no MVP.

Objetivo de negocio:
Encontrar leads locais, auditar presenca digital, gerar score comercial, diagnostico, proposta e um briefing/prompt pronto para Claude/Codex construir a landing em outro repositorio.

Antes de qualquer codigo:
1. Leia CLAUDE.md.
2. Leia README.md.
3. Leia docs/SITEOPS_MONEY_ENGINE_INDEX.md.
4. Leia todos os docs listados no indice.
5. Liste quais documentos tecnicos voce encontrou.
6. Liste quais documentos esperados estao ausentes.
7. Nao edite arquivos ainda.

Auditoria obrigatoria:
- Identifique a estrutura atual do repo.
- Identifique rotas, componentes e libs principais.
- Identifique tudo que pertence ao SiteOps visual atual.
- Identifique tudo que pertence ao backend/IA atual.
- Identifique dependencias do package.json que podem atrapalhar o MVP.
- Identifique arquivos de docs existentes que conflitam ou precisam ser atualizados.
- Identifique se ha segredos, envs perigosas ou uso indevido de NEXT_PUBLIC.
- Identifique onde o Studio depende da rota app/api/generate/route.ts.
- Identifique se o app funciona sem OPENROUTER_API_KEY.
- Identifique se existe fallback local preservado.

Decisao que voce deve recomendar:
Classifique cada item como:
- manter;
- remover;
- mover;
- isolar;
- atualizar;
- baixar/instalar;
- deixar para fase 2.

Tabela obrigatoria:
| Area/arquivo | Estado atual | Acao recomendada | Prioridade | Risco | Motivo |
|---|---|---|---|---|---|

Foco da auditoria:
1. Documentacao tecnica.
2. Organizacao do repositorio.
3. Backend atual que pode atrapalhar.
4. Omniroute como provider futuro.
5. Maxun, Firecrawl e Lighthouse como adapters futuros.
6. Handoff para Claude/Codex gerar sites externos.
7. O que precisa ser baixado/instalado.
8. O que deve ser removido ou isolado.
9. O que pode ser implementado primeiro sem API real.

Regras:
- Nao misture Revenue Protect com SiteOps.
- Nao transformar isso em ERP ou CRM.
- Nao criar builder visual interno agora.
- Nao implementar scraping em massa.
- Nao enviar WhatsApp/email automaticamente.
- Nao publicar site sem aprovacao humana.
- Nao inventar metricas, clientes, depoimentos, premios ou resultados.
- Nao commitar secrets.
- Nao mexer em .git.
- Nao fazer refator grande sem plano.

Saida esperada nesta primeira rodada:
1. Resumo do estado atual.
2. Lista dos documentos tecnicos encontrados.
3. Lista do que falta documentar.
4. Mapa do que remover/isolar/organizar.
5. Lista do que precisa baixar/instalar e por que.
6. Plano de implementacao em fases pequenas.
7. Arquivos permitidos para a primeira alteracao.
8. Arquivos proibidos na primeira alteracao.
9. Comandos de validacao.
10. Criterios de aceite.
11. Riscos pendentes.

Depois da auditoria, proponha um primeiro patch pequeno com no maximo uma destas entregas:
A) reorganizar docs e links;
B) isolar backend de IA como opcional;
C) criar tipos e mocks do Lead/Audit/Scoring Engine;
D) criar gerador de briefing.json sem IA real.

Nao implemente varias fases no mesmo patch.
```
