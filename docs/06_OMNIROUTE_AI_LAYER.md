# Omniroute AI Layer

## Decisao

Omniroute deve ser uma camada de provider, nao o centro da arquitetura.

O core do SiteOps deve funcionar com:

- provider mock;
- templates locais;
- Omniroute real quando configurado;
- possivel OpenRouter legado enquanto a migracao nao for feita.

## Objetivos da IA

A IA deve ajudar em:

- resumir achados da auditoria;
- transformar score em diagnostico comercial;
- escrever proposta;
- gerar perguntas para call;
- gerar `briefing.json`;
- gerar prompt para Claude/Codex construir landing.

A IA nao deve:

- inventar clientes, premios, resultados ou depoimentos;
- enviar mensagem;
- publicar site;
- alterar dados sensiveis;
- raspar em massa;
- decidir preco final sem aprovacao humana.

## Estrutura sugerida

```txt
app/lib/siteops/ai/
  aiClient.ts
  aiTypes.ts
  usageLogger.ts
  prompts/
    auditSummaryPrompt.ts
    proposalPrompt.ts
    siteBriefingPrompt.ts
  providers/
    mockProvider.ts
    omnirouteProvider.ts
    openrouterProvider.ts
```

## Variaveis

```env
AI_PROVIDER=mock
OMNIROUTE_BASE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=
OMNIROUTE_MODEL=auto/best-chat
SITEOPS_AI_MAX_INPUT_CHARS=12000
SITEOPS_AI_MAX_OUTPUT_TOKENS=2500
```

## Contrato de client

```ts
type AiGenerateInput = {
  task: "audit_summary" | "proposal" | "site_briefing";
  promptVersion: string;
  input: unknown;
  maxOutputTokens?: number;
};

type AiGenerateResult<T> = {
  provider: "mock" | "omniroute" | "openrouter";
  model: string;
  output: T;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  warnings: string[];
};
```

## Logs

Registrar:

- task;
- promptVersion;
- provider;
- model;
- tokens aproximados;
- leadId;
- status;
- erro resumido.

Nao registrar:

- API key;
- dados pessoais completos;
- documentos sensiveis;
- prompts enormes sem necessidade.

## Fallback

Se IA falhar:

- usar template local;
- marcar `generatedBy: "template"`;
- registrar warning;
- permitir edicao manual.

## Migracao do backend atual

Antes de trocar OpenRouter por Omniroute, Claude deve auditar:

- onde a rota `app/api/generate/route.ts` e chamada;
- se `OPENROUTER_API_KEY` esta isolada;
- se `docs/AI_SETUP.md` precisa ser atualizado;
- se existe dependencia desnecessaria no `package.json`;
- se o Studio continua funcionando sem chave.
