import {
  urlAuditRequestSchema,
  fetchUrlHtml,
  buildUrlAuditArtifacts,
} from "../../../lib/money/url-audit";

// ---------------------------------------------------------------------------
// POST /api/money/audit-url
// Server-side fetch + deterministic signal extraction. No AI, no persistence.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = urlAuditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Dados invalidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { html: pastedHtml, url: rawUrl, ...targetFields } = parsed.data;

  let html = pastedHtml;
  let finalUrl = rawUrl ?? "html-paste";
  let fetchedAt = new Date().toISOString();

  if (!html) {
    if (!rawUrl) {
      return Response.json(
        { ok: false, error: "URL ou HTML obrigatorio." },
        { status: 400 },
      );
    }
    try {
      const fetched = await fetchUrlHtml(rawUrl);
      html = fetched.html;
      finalUrl = fetched.finalUrl;
      fetchedAt = fetched.fetchedAt;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Falha ao buscar a URL.";
      return Response.json({ ok: false, error: message }, { status: 422 });
    }
  }

  try {
    const artifacts = buildUrlAuditArtifacts(
      { ...targetFields, url: finalUrl },
      html,
      finalUrl,
      fetchedAt,
    );
    return Response.json({ ok: true, data: artifacts });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Falha ao analisar o HTML.";
    return Response.json({ ok: false, error: message }, { status: 422 });
  }
}
