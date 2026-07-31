# Site Builder Handoff

## Decisao

No MVP, o SiteOps nao constroi o site final dentro do mesmo produto. Ele gera um pacote de handoff para Claude Code ou Codex criar a landing em outro repositorio.

## Saidas obrigatorias

Para cada oportunidade qualificada, gerar:

1. `diagnostico.md`
2. `proposta.md`
3. `briefing.json`
4. `prompt-claude-site.md`
5. `acceptance-checklist.md`

## Estrutura do briefing JSON

```json
{
  "project": {
    "businessName": "",
    "niche": "",
    "city": "",
    "state": "",
    "objective": "converter visitantes em contatos via WhatsApp/formulario"
  },
  "leadAudit": {
    "hasWebsite": true,
    "websiteUrl": "",
    "mainProblems": [],
    "conversionGaps": [],
    "trustGaps": [],
    "seoGaps": [],
    "performanceNotes": []
  },
  "offer": {
    "primaryCta": "Chamar no WhatsApp",
    "secondaryCta": "Solicitar orcamento",
    "deliveryPromise": "landing em 72h",
    "mustNotInvent": [
      "clientes",
      "depoimentos",
      "premios",
      "certificacoes",
      "metricas de resultado"
    ]
  },
  "page": {
    "sections": [
      "hero",
      "servicos",
      "diferenciais",
      "prova_social_ou_evidencias_reais",
      "localizacao",
      "faq",
      "contato"
    ],
    "styleDirection": "",
    "contentLanguage": "pt-BR"
  },
  "technicalAcceptance": {
    "stack": "Next.js + TypeScript + Tailwind",
    "lighthouseTargets": {
      "performance": 90,
      "accessibility": 90,
      "seo": 90
    },
    "responsive": true,
    "reducedMotion": true
  }
}
```

## Prompt base para Claude/Codex criar a landing

```txt
Voce vai criar uma landing page profissional para um prestador local com base no briefing JSON abaixo.

Objetivo:
Converter visitantes em contatos via WhatsApp e formulario.

Stack:
Next.js, TypeScript e Tailwind.

Regras:
- Pagina rapida, responsiva e premium.
- CTA claro acima da dobra.
- Secoes obrigatorias: hero, servicos, diferenciais, evidencias reais/prova social, localizacao, FAQ e contato.
- SEO local basico.
- Lighthouse alvo: Performance 90+, Accessibility 90+, SEO 90+.
- Preservar prefers-reduced-motion.
- Nao inventar clientes, depoimentos, premios, certificacoes, garantias ou metricas.
- Se faltar informacao, usar texto honesto e editavel.
- Nao criar backend complexo.
- Nao salvar secrets.
- Rodar lint/build e reportar validacoes.

Briefing JSON:
[COLE O briefing.json AQUI]
```

## Validacao da landing

Antes de entregar:

- abrir desktop e mobile;
- verificar CTA;
- verificar WhatsApp/formulario;
- rodar Lighthouse;
- revisar copy;
- confirmar que nada sensivel foi inventado;
- gerar resumo de alteracoes;
- listar proximos ajustes.
