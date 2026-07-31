# MVP Scope - SiteOps Money Engine

## Decisao de escopo

Usar o repositorio atual como cockpit e engine de inteligencia. Criar sites de clientes fora deste repo, a partir de briefing e prompt gerados aqui.

## Fase 1 - Obrigatoria

### Entrada de leads

- Cadastro manual de lead.
- Importacao simples via CSV opcional.
- Campos minimos:
  - nome da empresa;
  - categoria;
  - cidade;
  - estado;
  - telefone;
  - WhatsApp;
  - site;
  - Google Maps URL;
  - fonte;
  - observacoes.

### Auditoria inicial

A primeira versao pode usar dados manuais e mocks controlados. Depois pluga Firecrawl/Lighthouse.

Avaliar:

- empresa tem site;
- site abre;
- tem CTA claro;
- tem WhatsApp visivel;
- tem formulario;
- tem agenda/orcamento;
- tem prova social;
- tem localizacao;
- parece confiavel;
- performance estimada ou real;
- SEO local basico.

### Scoring

Gerar score comercial de 0 a 100 com subnotas:

- presenca digital;
- performance;
- SEO local;
- conversao;
- confianca;
- urgencia de venda.

### Saidas

Para cada lead qualificado:

- diagnostico Markdown;
- proposta curta;
- `briefing.json`;
- prompt para Claude/Codex gerar landing externa;
- checklist de validacao.

## Fase 1 - Proibido

- Scraping em massa sem limite.
- Envio automatico de mensagem.
- Publicacao automatica de site.
- Chaves reais commitadas.
- Dependencia obrigatoria de Omniroute, OpenRouter, Maxun ou Firecrawl para rodar localmente.
- Agente autonomo com permissao de editar/deletar/publicar sem confirmacao.
- Banco complexo ou RLS apressado se ainda nao houver autenticacao bem definida.

## Fase 2

- Firecrawl real para leitura de site.
- Lighthouse real via script.
- Omniroute como provider de IA.
- Maxun para coleta estruturada de leads.
- Export PDF.
- Historico por lead.
- Pipeline comercial simples.
- Templates por nicho.

## Fase 3

- Integracao com CRM.
- Criacao automatica de repositorios de cliente.
- PR automatizado para site gerado.
- Deploy assistido.
- Relatorio mensal.
- Automacoes recorrentes com aprovacao humana.

## Criterios de aceite do MVP

- O app roda localmente sem chave de IA.
- Um lead manual gera diagnostico, score, proposta e briefing.
- O prompt gerado e suficiente para Claude criar uma landing sem depender do historico da conversa.
- `npm run lint` passa.
- `npm run build` passa antes de merge.
- Nenhum segredo real no codigo.
