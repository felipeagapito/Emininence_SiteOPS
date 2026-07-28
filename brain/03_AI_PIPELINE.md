# Pipeline de IA

O Studio converte marca, segmento, objetivo, público, personalidade, prova,
motion e 3D em um blueprint validado por Zod.

O runtime usa AI SDK + OpenRouter. `SITEOPS_AI_MODEL` escolhe o modelo.
`openrouter/free` facilita teste, mas pode variar e sofrer limites.

Para produção:

- fixe um modelo;
- configure orçamento e rate limit;
- mantenha fallback local;
- não envie dados pessoais desnecessários;
- mantenha revisão humana antes de publicar.

O segredo vive apenas em `OPENROUTER_API_KEY`. O endpoint de status revela
somente se está configurado.
