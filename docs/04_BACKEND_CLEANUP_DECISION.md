# Backend Cleanup Decision

## Situacao atual conhecida

O repositorio possui uma rota backend em:

```txt
app/api/generate/route.ts
```

Ela usa:

- AI SDK;
- OpenRouter;
- `OPENROUTER_API_KEY`;
- schema de blueprint;
- fallback local no Studio.

Isso nao precisa ser removido automaticamente. Precisa ser auditado e isolado para nao travar o MVP.

## Decisao

No MVP do SiteOps Money Engine, backend de IA nao pode ser dependencia obrigatoria.

A rota existente deve seguir uma das opcoes depois da auditoria:

### Opcao A - Manter, mas isolar

Manter `app/api/generate/route.ts`, mas deixar claro que ela atende o Studio criativo atual, nao o Money Engine.

Quando usar:

- a rota esta segura;
- nao expoe segredo;
- nao bloqueia build;
- fallback local continua funcionando.

### Opcao B - Migrar para provider unico

Mover chamadas de IA para:

```txt
app/lib/siteops/ai/
  aiClient.ts
  providers/openrouterProvider.ts
  providers/omnirouteProvider.ts
  providers/mockProvider.ts
  usageLogger.ts
```

Quando usar:

- Money Engine comeca a usar IA real;
- Omniroute vira provider principal;
- prompts precisam de versao e log.

### Opcao C - Desativar temporariamente

Desativar rota ou remover dependencias quando:

- quebra build;
- cria risco de segredo;
- mistura blueprint criativo com diagnostico comercial;
- aumenta escopo do MVP;
- torna o app inutil sem API key.

## Regras

- Nao deletar backend sem diff revisado.
- Nao trocar OpenRouter por Omniroute em todo lugar de uma vez.
- Nao espalhar chamadas IA no frontend.
- Nao usar `NEXT_PUBLIC_*` para chaves privadas.
- Nao registrar prompt com dados sensiveis completos.
- Todo uso de IA deve ter fallback mock/template.

## Saida esperada da auditoria

Claude deve entregar uma tabela:

| Arquivo | Manter | Remover | Migrar | Motivo | Risco |
|---|---|---|---|---|---|

Arquivos minimos a revisar:

- `app/api/generate/route.ts`;
- `app/lib/blueprint.ts`;
- `docs/AI_SETUP.md`;
- `.env.example`;
- `package.json`;
- `CLAUDE.md`;
- rotas do `/studio`.
