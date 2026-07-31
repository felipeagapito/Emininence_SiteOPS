# Data Model And Scoring

## Principio

O modelo de dados deve ser pequeno, rastreavel e util para venda. Nao criar CRM completo no MVP.

## Entidades principais

### `business_leads`

Representa um negocio local candidato.

Campos sugeridos:

- `id`
- `business_name`
- `category`
- `city`
- `state`
- `country`
- `phone`
- `whatsapp`
- `email`
- `website_url`
- `google_maps_url`
- `source`
- `status`
- `notes`
- `created_at`
- `updated_at`

Status sugeridos:

- `new`
- `needs_audit`
- `audited`
- `proposal_ready`
- `contacted`
- `won`
- `lost`
- `not_fit`

### `site_audits`

Representa uma auditoria de presenca digital.

Campos sugeridos:

- `id`
- `lead_id`
- `audit_mode`: `manual`, `mock`, `firecrawl`, `lighthouse`, `combined`
- `website_exists`
- `has_whatsapp`
- `has_primary_cta`
- `has_contact_form`
- `has_booking_or_schedule`
- `has_social_proof`
- `has_local_seo_signals`
- `has_google_maps_embed`
- `mobile_usability_notes`
- `performance_score`
- `accessibility_score`
- `seo_score`
- `best_practices_score`
- `raw_findings_json`
- `created_at`

### `commercial_scores`

Representa score calculado para venda.

Campos sugeridos:

- `id`
- `lead_id`
- `audit_id`
- `digital_presence_score`
- `performance_score`
- `local_seo_score`
- `conversion_score`
- `trust_score`
- `sales_urgency_score`
- `overall_opportunity_score`
- `priority_label`: `low`, `medium`, `high`, `urgent`
- `score_explanation`
- `created_at`

### `proposals`

Representa diagnostico/proposta gerada.

Campos sugeridos:

- `id`
- `lead_id`
- `score_id`
- `title`
- `diagnosis_markdown`
- `proposal_markdown`
- `offer_summary`
- `estimated_delivery_days`
- `created_at`

### `site_briefings`

Representa handoff para construir site externo.

Campos sugeridos:

- `id`
- `lead_id`
- `proposal_id`
- `briefing_json`
- `claude_prompt`
- `target_stack`
- `status`
- `created_at`

### `ai_usage_logs`

Representa uso de IA.

Campos sugeridos:

- `id`
- `provider`
- `model`
- `prompt_version`
- `purpose`
- `input_tokens_estimate`
- `output_tokens_estimate`
- `status`
- `error_code`
- `created_at`

Nao registrar prompt completo com dados sensiveis sem necessidade.

### `audit_logs`

Representa eventos relevantes.

Campos sugeridos:

- `id`
- `actor`
- `event_type`
- `entity_type`
- `entity_id`
- `metadata_json`
- `created_at`

## Score comercial

O score deve ir de 0 a 100.

Pesos iniciais:

| Dimensao | Peso |
|---|---:|
| Presenca digital | 20 |
| Performance | 15 |
| SEO local | 15 |
| Conversao | 25 |
| Confianca | 15 |
| Urgencia de venda | 10 |

## Regras de calculo iniciais

### Presenca digital

- sem site: score baixo, urgencia alta;
- site existe mas incompleto: score medio;
- site claro, responsivo e completo: score alto.

### Performance

Usar Lighthouse quando disponivel.

Fallback manual:

- carregamento ruim percebido: baixo;
- carregamento ok: medio;
- carregamento rapido: alto.

### SEO local

Sinais positivos:

- cidade/bairro no titulo/conteudo;
- telefone local;
- endereco;
- Google Maps;
- schema/local business futuro;
- paginas de servico.

### Conversao

Sinais positivos:

- CTA acima da dobra;
- WhatsApp visivel;
- formulario;
- agenda/orcamento;
- proposta clara;
- servicos explicitos.

### Confianca

Sinais positivos:

- depoimentos;
- fotos reais;
- antes/depois quando aplicavel;
- CNPJ/identidade clara;
- portfolio;
- redes sociais consistentes.

### Urgencia de venda

Alta quando:

- negocio tem demanda local evidente;
- site ausente ou muito ruim;
- ha WhatsApp/telefone mas sem estrutura de conversao;
- concorrentes aparentam melhores;
- melhoria pode ser entregue em 72h.

## Regra importante

IA pode escrever explicacao, proposta e briefing. O score numerico deve ser calculado por funcao deterministica testavel.
