# Configuração de IA

Sem chave, `/studio` usa o motor local determinístico.

## OpenRouter

1. Crie uma chave em <https://openrouter.ai/settings/keys>.
2. Copie `.env.example` para `.env.local`.
3. Preencha `OPENROUTER_API_KEY`.
4. Reinicie `npm run dev`.
5. Abra `/studio` e confirme `OPENROUTER / ONLINE`.

Nunca envie a chave no chat ou a versione. `openrouter/free` escolhe modelos
gratuitos disponíveis; disponibilidade e limite podem mudar. Em produção, fixe
um modelo e configure limite de gasto.

## Claude Code

Execute `claude` na raiz. `CLAUDE.md` e `brain/` fornecem o contexto. O botão de
handoff no Studio copia o briefing e blueprint atuais.

## Motion.so

Use como conector de geração de vídeo para lançamento, reels e walkthroughs.
Ele não substitui Motion, GSAP ou React Three Fiber no runtime.

## Motion AI Kit

É opcional e algumas integrações completas exigem Motion+. O repositório já
inclui regras de motion para Claude, reduzindo a dependência.
