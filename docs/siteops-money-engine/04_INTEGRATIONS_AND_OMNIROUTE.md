# Integrations And Omniroute

## Principio

Integracoes devem acelerar o operador, nao travar o MVP.

O app precisa funcionar em modo manual/mock sem nenhuma chave externa.

## Variaveis de ambiente sugeridas

```env
AI_PROVIDER=mock
OMNIROUTE_BASE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=
OMNIROUTE_MODEL=auto/best-chat

FIRECRAWL_API_KEY=
MAXUN_BASE_URL=
MAXUN_API_KEY=

APP_URL=http://localhost:3000
```

Nunca preencher `.env.example` com secrets reais.

## Omniroute

Omniroute deve ser tratado como provider OpenAI-compatible.

Camada recomendada:

```text
src/modules/ai/
  aiClient.ts
  providers/
    mockProvider.ts
    omnirouteProvider.ts
  prompts/
    auditPrompt.ts
    proposalPrompt.ts
    siteBriefingPrompt.ts
  usageLogger.ts
```

## Regras para IA

Toda chamada de IA deve:

- passar por `aiClient.ts`;
- ter `purpose` definido;
- usar prompt versionado;
- ter timeout;
- ter limite de tokens;
- registrar provider/model/status;
- aceitar fallback mock;
- nao executar acao externa;
- nao enviar mensagem para lead;
- nao fazer deploy;
- nao alterar dados sensiveis sem aprovacao.

## Usos permitidos de IA no MVP

Permitidos:

- resumir auditoria;
- escrever diagnostico;
- melhorar proposta;
- gerar briefing de site;
- gerar prompt para Claude/Codex;
- adaptar copy por nicho.

Proibidos:

- decidir contato automaticamente;
- enviar WhatsApp/email;
- fazer scraping sem limite;
- apagar leads;
- publicar site;
- inventar dados do negocio;
- burlar termos de plataformas.

## Firecrawl

Uso previsto:

- ler site atual do lead;
- extrair conteudo em Markdown/JSON;
- identificar paginas principais;
- alimentar auditoria e proposta.

Contrato do adapter:

```ts
type FirecrawlSiteSnapshot = {
  url: string;
  title?: string;
  markdown?: string;
  links?: string[];
  extractedAt: string;
  error?: string;
};
```

Regras:

- cachear resultado quando possivel;
- registrar falhas;
- nao bloquear fluxo se Firecrawl falhar;
- limitar quantidade de paginas por lead.

## Lighthouse

Uso previsto:

- performance;
- acessibilidade;
- SEO;
- best practices;
- comparativo antes/depois.

Contrato do adapter:

```ts
type LighthouseSummary = {
  url: string;
  performance?: number;
  accessibility?: number;
  seo?: number;
  bestPractices?: number;
  diagnostics?: string[];
  capturedAt: string;
  error?: string;
};
```

Regras:

- rodar via script controlado;
- salvar resumo, nao necessariamente o JSON gigante inteiro;
- evitar rodadas repetidas sem necessidade.

## Maxun

Uso previsto:

- coletar dados estruturados de fontes publicas;
- apoiar listas de leads;
- enriquecer informacoes basicas.

Contrato do adapter:

```ts
type LeadSourceRecord = {
  businessName: string;
  category?: string;
  city?: string;
  phone?: string;
  websiteUrl?: string;
  googleMapsUrl?: string;
  source: string;
  capturedAt: string;
};
```

Regras:

- importar primeiro por CSV/manual;
- automatizar depois;
- registrar fonte;
- deduplicar;
- respeitar limites e termos das fontes.

## Sequencia de ativacao

1. Mock/local.
2. Lighthouse script.
3. Firecrawl.
4. Omniroute.
5. Maxun.

Essa ordem reduz risco tecnico e custo.
