# Security And Operating Rules

## Regra central

Seguranca antes de automacao.

O SiteOps mexe com dados de leads, sites publicos, IA e possiveis integracoes externas. A primeira versao deve ser assistida, rastreavel e reversivel.

## Nunca salvar

- senhas reais;
- tokens reais;
- chaves de API;
- cookies de sessao;
- dados bancarios;
- documentos pessoais completos;
- prompts com informacao sensivel desnecessaria;
- arquivos gigantes de crawl sem necessidade.

## Sempre usar

- `.env.example` sem segredos;
- validacao de env no servidor;
- Zod ou equivalente para entrada de dados;
- logs sem secrets;
- limites de uso de API;
- modo mock;
- revisao humana antes de contato externo;
- revisao humana antes de deploy;
- historico de diagnostico/proposta.

## Backend de IA

Se existir rota como `/api/generate`, auditar antes de evoluir.

Checklist:

- existe autenticacao ou limite?
- aceita input arbitrario?
- registra custo/uso?
- expoe stack trace?
- permite prompt injection causar acao externa?
- usa chave no frontend?
- tem fallback?
- tem timeout?
- tem limite de tamanho de input?

Acao recomendada:

- mover logica de IA para `src/modules/ai/aiClient.ts`;
- manter rota fina;
- bloquear custo infinito;
- permitir `AI_PROVIDER=mock`.

## Scraping/coleta

O MVP deve evitar scraping em massa sem controle.

Regras:

- preferir importacao manual/CSV inicialmente;
- registrar fonte;
- limitar volume;
- respeitar termos de uso das plataformas;
- nao coletar dado sensivel desnecessario;
- nao automatizar contato sem consentimento/revisao.

## Dados de leads

Dados minimos recomendados:

- nome do negocio;
- categoria;
- cidade/estado;
- site;
- telefone/WhatsApp publico;
- origem;
- status;
- observacoes.

Evitar:

- documentos pessoais;
- dados privados;
- informacoes financeiras;
- qualquer dado que nao ajude a vender/operar o diagnostico.

## IA e alucinacao

A IA nao pode inventar:

- tempo de mercado;
- numero de clientes;
- faturamento;
- depoimentos;
- certificacoes;
- endereco;
- promessas de resultado garantido;
- dados juridicos.

Quando nao houver dado, escrever como pendencia no briefing.

## Acoes proibidas sem confirmacao humana

- enviar WhatsApp;
- enviar email;
- criar campanha;
- publicar site;
- excluir lead;
- sobrescrever briefing aprovado;
- acionar cliente;
- rodar coleta em grande volume.

## Logs obrigatorios

Registrar:

- importacao de leads;
- auditoria criada;
- score gerado;
- proposta gerada;
- briefing gerado;
- uso de IA;
- erro de integracao;
- exportacao relevante.

Logs nao devem conter secrets ou dados sensiveis completos.

## Criterio de aceite de seguranca

Antes de considerar pronto:

- `git diff` revisado;
- nenhuma chave real no repo;
- `.env.example` existe;
- app roda sem provider real;
- chamadas externas tem timeout;
- prompts estao versionados;
- acoes externas exigem aprovacao humana;
- custos de IA/API sao visiveis ou pelo menos registraveis.
