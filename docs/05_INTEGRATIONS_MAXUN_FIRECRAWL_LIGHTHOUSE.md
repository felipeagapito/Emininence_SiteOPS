# Integrations - Maxun, Firecrawl and Lighthouse

## Principio

As integracoes devem ser adapters. O core do produto deve funcionar sem elas.

## Maxun

Uso esperado:

- coleta estruturada de leads;
- extracao de fontes publicas;
- enriquecimento controlado;
- gerar dados para Lead Engine.

Nao usar no MVP para scraping agressivo ou sem limite.

Adapter sugerido:

```txt
app/lib/siteops/integrations/maxun/
  maxunClient.ts
  maxunTypes.ts
  maxunMapper.ts
```

Contrato minimo:

```ts
type MaxunLeadResult = {
  source: "maxun";
  businessName: string;
  category?: string;
  city?: string;
  phone?: string;
  websiteUrl?: string;
  mapsUrl?: string;
  raw?: unknown;
};
```

## Firecrawl

Uso esperado:

- ler o site do lead;
- converter paginas para Markdown/JSON;
- identificar CTA, WhatsApp, formularios, prova social e conteudo local.

Adapter sugerido:

```txt
app/lib/siteops/integrations/firecrawl/
  firecrawlClient.ts
  firecrawlTypes.ts
  firecrawlAuditMapper.ts
```

Saida minima:

```ts
type FirecrawlSiteSnapshot = {
  url: string;
  title?: string;
  markdown?: string;
  links: string[];
  detectedWhatsapp: boolean;
  detectedForms: boolean;
  detectedTestimonials: boolean;
  detectedAddress: boolean;
};
```

## Lighthouse

Uso esperado:

- performance;
- accessibility;
- best practices;
- SEO;
- diagnostico objetivo para proposta.

Script sugerido:

```txt
scripts/run-lighthouse.ts
```

Saida minima:

```ts
type LighthouseSummary = {
  url: string;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  diagnostics: string[];
};
```

## Fallback obrigatorio

Se qualquer integracao falhar:

- registrar erro;
- manter lead;
- permitir auditoria manual;
- gerar proposta com aviso de limitacao;
- nunca travar o fluxo inteiro.

## Variaveis esperadas

```env
MAXUN_BASE_URL=
MAXUN_API_KEY=
FIRECRAWL_API_KEY=
LIGHTHOUSE_TIMEOUT_MS=60000
```

## Riscos

- Termos de uso de fontes externas.
- Captura excessiva de dados pessoais.
- Custos de API.
- Sites com bloqueio anti-bot.
- Lighthouse instavel em ambiente limitado.

## Criterio de aceite

- O app roda sem Maxun.
- O app roda sem Firecrawl.
- O app roda sem Lighthouse.
- Cada adapter tem mock.
- Cada falha aparece no diagnostico como limitacao, nao como dado inventado.
