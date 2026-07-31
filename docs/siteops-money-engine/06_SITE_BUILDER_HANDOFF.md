# Site Builder Handoff

## Decisao

O SiteOps Money Engine nao deve construir o site completo dentro do app na primeira fase.

Ele deve gerar os artefatos para Claude/Codex construir o site em outro repositorio.

## Artefatos obrigatorios

Para cada lead aprovado, gerar:

1. `briefing.json`;
2. prompt completo para Claude/Codex;
3. checklist de aceite;
4. lista de assets pendentes;
5. secoes recomendadas;
6. informacoes que a IA nao pode inventar.

## Estrutura do `briefing.json`

```json
{
  "project": {
    "name": "Landing page para [nome do negocio]",
    "type": "local_service_landing",
    "targetStack": "nextjs-typescript-tailwind",
    "deliveryGoalDays": 3
  },
  "business": {
    "name": "",
    "category": "",
    "city": "",
    "state": "",
    "websiteUrl": "",
    "whatsapp": "",
    "email": "",
    "address": "",
    "googleMapsUrl": ""
  },
  "diagnosis": {
    "mainProblems": [],
    "commercialRisks": [],
    "technicalRisks": [],
    "opportunities": [],
    "score": {
      "digitalPresence": 0,
      "performance": 0,
      "localSeo": 0,
      "conversion": 0,
      "trust": 0,
      "urgency": 0,
      "overall": 0
    }
  },
  "sitePlan": {
    "primaryGoal": "Gerar contatos via WhatsApp/formulario",
    "primaryCta": "Solicitar orcamento",
    "secondaryCta": "Chamar no WhatsApp",
    "sections": [
      "hero",
      "services",
      "differentials",
      "social_proof",
      "location",
      "faq",
      "contact"
    ],
    "seoKeywords": [],
    "tone": "profissional, claro e confiavel",
    "visualDirection": "premium, local, rapido, sem visual generico"
  },
  "contentRules": {
    "mustUse": [],
    "mustNotInvent": [
      "depoimentos",
      "certificacoes",
      "anos de experiencia",
      "numero de clientes",
      "garantias de resultado",
      "informacoes juridicas"
    ],
    "missingAssets": []
  },
  "acceptanceCriteria": [
    "CTA acima da dobra",
    "WhatsApp visivel",
    "formulario simples",
    "responsivo",
    "SEO local basico",
    "Lighthouse Performance 90+ quando possivel",
    "Accessibility 90+",
    "SEO 90+",
    "sem backend complexo"
  ]
}
```

## Prompt base para gerar site

```txt
Crie uma landing page profissional para um prestador local com base no briefing abaixo.

Objetivo:
Converter visitantes em contatos via WhatsApp/formulario.

Stack:
Next.js, TypeScript e Tailwind.

Regras obrigatorias:
- Pagina rapida, responsiva e profissional.
- CTA principal acima da dobra.
- Secoes: hero, servicos, diferenciais, prova social quando houver dados reais, localizacao, FAQ e contato.
- SEO local basico.
- Lighthouse alvo: Performance 90+, Accessibility 90+, SEO 90+.
- Nao usar backend complexo.
- Nao inventar informacoes sensiveis.
- Nao inventar depoimentos, certificacoes, anos de experiencia ou garantias.
- Quando um dado estiver faltando, use texto generico seguro ou marque como pendencia.
- Evitar visual generico, poluido ou com cara de template barato.

Entregue:
- codigo completo;
- README com como rodar;
- checklist de validacao;
- o que ainda precisa de informacao real do cliente.

Briefing:
[COLE AQUI O briefing.json]
```

## Onde criar o site

Preferir repositorios separados por cliente.

Exemplos:

```text
site-clinica-nova-vida
site-oficina-centro-auto
site-barbearia-premium
```

Alternativa temporaria:

```text
generated-sites/[slug-do-cliente]
```

Mas o recomendado e separar repos quando houver cliente real.

## Checklist antes de entregar ao cliente

- copy revisada;
- dados do cliente conferidos;
- WhatsApp correto;
- formulario testado;
- Lighthouse rodado;
- mobile testado;
- pagina sem dados inventados;
- deploy aprovado manualmente;
- diagnostico antes/depois salvo.
