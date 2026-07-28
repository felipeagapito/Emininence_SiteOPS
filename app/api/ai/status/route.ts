export async function GET() {
  return Response.json({
    configured: Boolean(process.env.OPENROUTER_API_KEY),
    provider: "openrouter",
    model: process.env.SITEOPS_AI_MODEL ?? "openrouter/free",
  });
}
