# SiteOps Money Engine - Product Brief

## Decisao principal

O repositorio `Emininence_SiteOPS` deve ser usado inicialmente como cockpit e motor de inteligencia comercial, nao como construtor completo de sites.

O produto encontra leads locais, audita presenca digital, gera score comercial, produz diagnostico/proposta e entrega um `briefing.json` + prompt para Claude/Codex construir o site ou landing page em outro repositorio.

## Objetivo em uma frase

Transformar negocios locais com site ruim, sem site ou baixa conversao digital em oportunidades qualificadas para venda de landing/site em ate 72 horas.

## Problema que resolve

Prestadores locais perdem clientes por problemas simples e visiveis:

- nao tem site;
- site lento;
- site sem WhatsApp claro;
- falta botao de orcamento;
- SEO local fraco;
- nao existe agenda ou formulario;
- falta prova social;
- design transmite baixa confianca;
- negocio aparece no Google Maps, mas nao converte bem.

## Usuario principal

Inicialmente o usuario principal e o proprio Agapito operando a ferramenta para vender SiteOps como servico.

Depois, o usuario pode ser um operador comercial ou agencia pequena usando o painel para:

- buscar leads;
- priorizar oportunidades;
- gerar diagnostico;
- gerar proposta;
- criar briefing de site;
- acompanhar status comercial.

## Oferta inicial

Oferta recomendada:

> Seu site atual esta perdendo clientes por X, Y e Z. Eu entrego uma landing nova em 72h com WhatsApp, formulario, SEO local basico, tracking e estrutura para conversao.

## Produto vendavel

O MVP vende principalmente:

1. diagnostico de presenca digital;
2. landing page/site de alta conversao;
3. melhoria rapida de captacao via WhatsApp/formulario;
4. relatorio tecnico-comercial antes/depois;
5. acompanhamento simples de oportunidades.

## O que o sistema deve gerar

Para cada lead qualificado:

- resumo do negocio;
- problemas encontrados;
- score comercial;
- prioridade de venda;
- diagnostico em Markdown/PDF;
- proposta comercial;
- `briefing.json`;
- prompt pronto para Claude/Codex construir o site.

## Fora do escopo inicial

Nao construir agora:

- Webflow/Framer proprio;
- builder visual interno completo;
- agente autonomo;
- envio automatico de mensagens;
- scraping em massa sem controle;
- CRM completo;
- multi-tenant publico;
- cobranca/pagamento;
- deploy automatico sem aprovacao humana.

## Decisao de arquitetura

Manter este repositorio como `SiteOps Money Engine Lite`.

Sites de clientes devem ser gerados em repositorios separados, por exemplo:

- `site-clinica-x`;
- `site-oficina-y`;
- `site-barbearia-z`.

Este repositorio gera o briefing e o prompt. Claude/Codex cria o site externo. Depois, o SiteOps pode evoluir para gerar PRs e previews automaticamente, mas somente com logs, limites e aprovacao humana.
