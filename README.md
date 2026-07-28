# Eminence SiteOps

Sistema de direção e produção de experiências digitais premium. Estratégia,
identidade, motion, 3D em tempo real, geração assistida por IA e gates de
qualidade em um único repositório.

Não é um clone de Rolex, Patek Philippe, Ferrari ou NASA. O SiteOps traduz os
princípios de experiências desse nível — originalidade, precisão, materialidade,
ritmo e performance — para marcas reais.

## Experiências incluídas

- `/` — manifesto e apresentação do sistema;
- `/studio` — briefing → blueprint com IA ou motor local;
- `/modelos/prime-calhas` — experiência industrial para coberturas;
- `/modelos/vetro` — experiência arquitetônica para vidro;
- `/api/generate` — geração estruturada com OpenRouter e AI SDK.

## Rodar

Requer Node.js `>=22.13.0`.

```bash
git clone https://github.com/felipeagapito/Emininence_SiteOPS.git
cd Emininence_SiteOPS
npm install
npm run dev
```

Abra a URL mostrada pelo terminal.

## Ligar a IA

O Studio funciona sem chave. Para usar um modelo:

```bash
cp .env.example .env.local
```

Preencha `OPENROUTER_API_KEY` e reinicie `npm run dev`. O padrão
`openrouter/free` é útil para avaliação, mas não oferece capacidade garantida
para produção. Leia [docs/AI_SETUP.md](docs/AI_SETUP.md).

## Claude + Obsidian

Execute `claude` na raiz. O agente recebe as regras de [CLAUDE.md](CLAUDE.md).
Abra `brain/` diretamente como vault no Obsidian; são notas Markdown puras,
portáteis e sem plugin obrigatório.

Prompt inicial:

```text
Leia CLAUDE.md e brain/00_INDEX.md. Preserve originalidade, truth guard,
reduced motion, fallback sem WebGL e gates de qualidade.
```

## Stack

| Camada | Tecnologia |
|---|---|
| App | Next.js + Vinext + Cloudflare |
| UI | React + CSS autoral |
| Motion | Motion + Lenis |
| 3D | Three.js + React Three Fiber + Drei |
| IA | AI SDK + OpenRouter |
| Contratos | Zod |

Decisões de repositórios: [docs/REPOSITORY_MATRIX.md](docs/REPOSITORY_MATRIX.md).

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm test
```

## Segurança

- tokens ficam no servidor;
- nenhum segredo usa prefixo `NEXT_PUBLIC_`;
- saída da IA passa por schema;
- prompts proíbem métricas, clientes e prova social inventados;
- 3D é progressivo e o conteúdo continua no DOM;
- os modelos de nicho são marcados como demonstrativos.
