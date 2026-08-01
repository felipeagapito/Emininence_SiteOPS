---
description: Audita o projeto SiteOps (segredos, gitignore, código externo, lint, build) e reporta honestamente.
argument-hint: [--no-build]
allowed-tools: Bash, Read, Grep
---

# Auditoria interna do Eminence SiteOps

Rode uma auditoria de integridade e qualidade do repositório. **Não** corrija
nada automaticamente: liste achados e, se aplicar, pergunte antes de mudar.
Reporte compromissos honestamente — nunca invente métricas de qualidade.

## 1. Estado do repositório

- `git status --short` e `git log --oneline -5`.
- Liste arquivos modificados/criados; identifique se algo fora do esperado está
  prestes a ser commitado (arquivos `.env*`, `dist/`, `external/repos/`,
  `node_modules/`).

## 2. Segredos e dados sensíveis

- Confirmar que `.env`, `.env.local` e `external/repos/` estão no `.gitignore`
  (`git check-ignore -v`), e que `.env.example` continua versionado.
- Rodar varredura de segredos nos arquivos rastreados (ex.: padrões de API key,
  `sk-...`, `BEGIN PRIVATE KEY`, `NEXT_PUBLIC_` com valor real):
  `git grep -nE "(api[_-]?key|secret|password|token|NEXT_PUBLIC.*=.+|sk-[A-Za-z0-9]{16,}|BEGIN (RSA|OPENSSH|PRIVATE))" -- . ':!package-lock.json' ':!external/repos' ':!dist' ':!node_modules'`
- Se encontrar algo suspeito, **não** imprima o valor completo; reporte arquivo
  e linha e marque como bloqueio.

## 3. Código externo no produto

- Verificar se algum conteúdo de `external/repos/` foi copiado para `app/`,
  `src/`, `components/` ou `lib/` (buscar assinaturas/imports incomuns).
- Confirmar que `external/repos/` está ignorado e que não há `components.json`
  apontando para repositórios externos não auditados.
- Conferir `THIRD_PARTY_NOTICES.md` se algo novo foi adicionado.

## 4. Qualidade de UI e acessibilidade (inspeção)

- Conferir mobile CSS e navegação primária do cockpit Money Engine
  (`app/money/**`, `app/lib/money/**`).
- Verificar `prefers-reduced-motion` e fallback sem JS/WebGL em telas
  afetadas.
- Confirmar headings semânticos, `focus-visible` e controles com label.

## 5. Lint e build

- `npm run lint`
- Build de release (`npm run build`) — a menos que `--no-build` seja passado.
- Reportar exit codes reais e falhas de forma literal, sem resumo inventado.

## 6. Relatório final

Saída em PT-BR, compacta:

- **Aprovado / Reprovado / Pendências** com lista curta.
- **Achados** numerados (arquivo:linha quando houver).
- **Bloqueios** de segurança/licença separados dos ajustes de qualidade.
- Próximos passos recomendados (1–3 itens).
