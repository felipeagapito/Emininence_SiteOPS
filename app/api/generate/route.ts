import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText, Output } from "ai";
import { siteBlueprintSchema, siteBriefSchema } from "../../lib/blueprint";

const systemPrompt = `
Você é o núcleo de direção criativa da Eminence SiteOps.
Transforme o briefing em um blueprint original, refinado e implementável.
Use referências apenas como princípios; nunca copie composição, marca, texto,
assinatura visual ou propriedade intelectual. Não invente clientes,
depoimentos, prêmios, garantias, certificações, métricas ou resultados.
Motion e 3D devem ter função narrativa e fallback acessível.
Responda em português do Brasil.
`;

export async function POST(request: Request) {
  const parsed = siteBriefSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json(
      { error: "Briefing inválido.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "IA não configurada. Use o motor local ou adicione OPENROUTER_API_KEY." },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const openrouter = createOpenRouter({
      apiKey,
      headers: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://eminence-siteops.local",
        "X-Title": "Eminence SiteOps",
      },
    });

    const result = await generateText({
      model: openrouter(process.env.SITEOPS_AI_MODEL ?? "openrouter/free"),
      system: systemPrompt,
      prompt: JSON.stringify(parsed.data),
      output: Output.object({ schema: siteBlueprintSchema }),
      maxOutputTokens: 3_200,
      abortSignal: controller.signal,
    });

    console.info("siteops.generate", {
      model: process.env.SITEOPS_AI_MODEL ?? "openrouter/free",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
    });

    return Response.json({ blueprint: result.output });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "A geração excedeu o tempo limite."
        : "Não foi possível gerar o blueprint agora.";
    return Response.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
