import { z } from "zod";
import { leadSchema, type Lead } from "./lead.ts";
import { auditSchema, type Audit } from "./audit.ts";
import { type Evidence } from "./evidence.ts";
import { computeDualScore, type DualScore } from "./score.ts";
import { generateBriefing, type GenerateBriefingOptions } from "./briefing-generator.ts";
import { generateProposalFromBriefing, renderProposalMarkdown } from "./proposal.ts";
import { generateSiteBuildPrompt } from "./prompt.ts";
import { serializeBriefing } from "./export.ts";
import { buildSiteAuditReport, type SiteAuditReport } from "./scoring.ts";

// ---------------------------------------------------------------------------
// Request schema — matches the POST body from url-audit-form.tsx
// `url` stays loose here; real validation + normalization happen in
// normalizeUrl() before any fetch (returns a clean https URL or throws).
// ---------------------------------------------------------------------------

export const urlAuditRequestSchema = z.object({
  url: z.string().optional(),
  html: z.string().min(1).optional(),
  businessName: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

// ---------------------------------------------------------------------------
// normalizeUrl — deterministic, server-safe URL normalization
// ---------------------------------------------------------------------------

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Trims, adds `https://` when no scheme is present, strips fragments and
 * leading/trailing whitespace, and enforces http(s) only. Throws a clear
 * message for anything else so callers can surface a 4xx.
 */
export function normalizeUrl(input: string): string {
  let candidate = input.trim();
  if (!candidate) {
    throw new Error("URL vazia.");
  }
  if (!SCHEME_RE.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  const parsed = new URL(candidate);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Protocolo nao suportado: ${parsed.protocol} (use http ou https).`);
  }
  parsed.hash = "";
  return parsed.toString();
}

// ---------------------------------------------------------------------------
// fetchUrlHtml — server-side fetch of a public URL
// ---------------------------------------------------------------------------

export async function fetchUrlHtml(
  url: string,
): Promise<{ html: string; finalUrl: string; fetchedAt: string }> {
  const normalized = normalizeUrl(url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(normalized, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SiteOpsAudit/1.0; +https://eminence-siteops.local)",
        Accept: "text/html,application/xhtml+xml,*/*",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const finalUrl = response.url ?? url;
    const fetchedAt = new Date().toISOString();

    return { html, finalUrl, fetchedAt };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Timeout ao buscar a URL (15s).");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// HTML signal extraction — deterministic regex-based parsing (MVP)
// TODO: Replace with Playwright + axe-core for full fidelity in Phase 2.
// ---------------------------------------------------------------------------

function extract(title: string, html: string): string | null {
  const match = html.match(title);
  return match?.[1]?.trim() ?? null;
}

function extractAll(pattern: string, html: string, group = 1): string[] {
  const regex = new RegExp(pattern, "gi");
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const value = match[group]?.trim();
    if (value) results.push(value);
  }
  return results;
}

function extractSignals(html: string, finalUrl: string) {
  const title = extract("<title[^>]*>([^<]+)<", html);
  const metaDescription = extract(
    '<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)',
    html,
  );
  const h1 = extract("<h1[^>]*>([^<]+)<", html);

  // Contact info
  const emails = extractAll('href=["\']mailto:([^"\']+)', html);
  const phones = extractAll(
    'href=["\']tel:([^"\']+)',
    html,
  );
  const whatsappLinks = extractAll(
    'href=["\']([^"\']*(?:wa\\.me|whatsapp\\.com|api\\.whatsapp\\.com)[^"\']*)',
    html,
  );

  // Features
  const hasContactForm = /<form[^>]*>/i.test(html);
  const hasGoogleMaps =
    /google\.com\/maps|maps\.google\.com|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(
      html,
    );

  // Social links
  const socialDomains = [
    "facebook\\.com",
    "instagram\\.com",
    "linkedin\\.com",
    "twitter\\.com",
    "x\\.com",
    "youtube\\.com",
    "tiktok\\.com",
  ];
  const socialLinks = extractAll(
    `href=["\']([^"\']*(?:${socialDomains.join("|")})[^"\']*)`,
    html,
  );

  // Internal links (relative or same-origin)
  const allLinks = extractAll('href=["\']([^"\']+)', html);
  const internalLinks = allLinks.filter(
    (link) =>
      link.startsWith("/") ||
      link.startsWith("#") ||
      link.includes("eminence-siteops") ||
      (!link.startsWith("http") && !link.startsWith("mailto:") && !link.startsWith("tel:")),
  );

  // CTA signals
  const ctaPatterns = [
    /<(?:button|a)[^>]*>(?:[^<]*(?:solicitar|orcamento|contato|whatsapp|ligar|chamar|fale|entre|agende|compre|contrate|peça|envie)[^<]*)/i,
    /<(?:button|a)[^>]*class=["\'][^"\']*(?:cta|btn|button|primary|action)[^"\']*["\'][^>]*>/i,
  ];
  const hasCta = ctaPatterns.some((p) => p.test(html));

  // Social proof signals
  const proofPatterns = [
    /depoimento|testimonial|avaliacao|review|nota|estrela|rating/i,
    /<blockquote/i,
    /class=["\'][^"\']*(?:testimonial|review|depoimento|proof)[^"\']*["\']/i,
  ];
  const hasSocialProof = proofPatterns.some((p) => p.test(html));

  // Technical signals
  const hasCharset = /charset/i.test(html);
  const hasViewport = /viewport/i.test(html);
  const bodyLength = html.replace(/<[^>]+>/g, "").trim().length;

  // Canonical
  const hasCanonical = /<link[^>]+rel=["']canonical["'][^>]*>|<link[^>]+href=["'][^"']*["'][^>]*rel=["']canonical["']/i.test(html);

  // Image alt coverage
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  const imgsWithoutAlt = imgTags.filter((tag) => !/\balt\s*=/.test(tag));
  const imagesAlt: "yes" | "no" | "unknown" =
    imgTags.length === 0
      ? "unknown"
      : imgsWithoutAlt.length === 0
        ? "yes"
        : "no";

  // Tech stack detection (deterministic heuristics, no external calls)
  const generatorMeta = extract(
    '<meta[^>]+name=["\']generator["\'][^>]+content=["\']([^"\']+)',
    html,
  );
  const modernStackRe =
    /(?:__NEXT_DATA__|data-reactroot|id=["']__next["']|id=["']root["']|create-react-app|nuxt|gatsby|astro|sveltekit|remix|vite|webpack|tailwindcss|nextjs)/i;
  const cmsRe = /(?:wordpress|wix|weebly|blogger|joomla|shopify|squarespace|drupal)/i;
  const legacyRe = /<frameset|frame\s+src|<marquee|bgcolor=|x-ua-compatible[^>]*IE=[567]|font\s+face|font\s+size=/i;
  let techStack: "yes" | "partial" | "no" | "unknown";
  if (modernStackRe.test(html)) techStack = "yes";
  else if (cmsRe.test(html) || generatorMeta) techStack = "partial";
  else if (legacyRe.test(html)) techStack = "no";
  else techStack = "unknown";

  return {
    title,
    metaDescription,
    h1,
    emails: [...new Set(emails)],
    phones: [...new Set(phones)],
    whatsappLinks: [...new Set(whatsappLinks)],
    hasContactForm,
    hasGoogleMaps,
    socialLinks: [...new Set(socialLinks)],
    internalLinkCount: internalLinks.length,
    hasCta,
    hasSocialProof,
    hasCharset,
    hasViewport,
    bodyLength,
    hasCanonical,
    imagesAlt,
    techStack,
    https: finalUrl.startsWith("https://"),
  };
}

// ---------------------------------------------------------------------------
// Build artifacts — deterministic pipeline from HTML signals
// ---------------------------------------------------------------------------

export function buildUrlAuditArtifacts(
  targetFields: {
    url?: string;
    businessName?: string;
    category?: string;
    city?: string;
    state?: string;
  },
  html: string,
  finalUrl: string,
  fetchedAt: string,
) {
  const signals = extractSignals(html, finalUrl);

  // Build lead
  const lead: Lead = leadSchema.parse({
    id: `lead_url_${fetchedAt.replace(/\D/g, "")}`,
    businessName:
      targetFields.businessName ||
      signals.title ||
      "Negocio identificado por URL",
    category: targetFields.category || "A determinar",
    city: targetFields.city || "A determinar",
    state: targetFields.state || "",
    country: "BR",
    phone: signals.phones[0] || undefined,
    whatsapp: signals.whatsappLinks[0] || undefined,
    email: signals.emails[0] || undefined,
    websiteUrl: finalUrl,
    source: "url",
    status: "needs_audit",
    createdAt: fetchedAt,
    updatedAt: fetchedAt,
  });

  // Build audit
  const audit: Audit = auditSchema.parse({
    id: `audit_url_${fetchedAt.replace(/\D/g, "")}`,
    leadId: lead.id,
    auditMode: "url",
    websiteExists: true,
    hasWhatsapp: signals.whatsappLinks.length > 0,
    hasPrimaryCta: signals.hasCta,
    hasContactForm: signals.hasContactForm,
    hasBookingOrSchedule: false, // Would need deeper analysis
    hasSocialProof: signals.hasSocialProof,
    hasLocalSeoSignals: Boolean(signals.title && signals.metaDescription),
    hasGoogleMapsEmbed: signals.hasGoogleMaps,
    mobileUsabilityNotes: signals.hasViewport
      ? "Viewport meta tag presente"
      : "Viewport meta tag ausente — pode nao ser responsivo",
    performanceScore: null, // Requires Lighthouse in Phase 2
    accessibilityScore: null, // Requires axe-core in Phase 2
    seoScore: null, // Requires Lighthouse in Phase 2
    bestPracticesScore: null, // Requires Lighthouse in Phase 2
    createdAt: fetchedAt,
  });

  // Build evidence from signals
  const evidence: Evidence[] = [
    {
      key: "siteExists",
      label: "Site existente",
      status: "yes",
      evidence: `HTML obtido de ${finalUrl} (${html.length} bytes)`,
      confidence: "high",
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      status: signals.whatsappLinks.length > 0 ? "yes" : "no",
      evidence:
        signals.whatsappLinks.length > 0
          ? `Link WhatsApp encontrado: ${signals.whatsappLinks[0]}`
          : "Nenhum link WhatsApp encontrado no HTML",
      confidence: signals.whatsappLinks.length > 0 ? "high" : "medium",
    },
    {
      key: "cta",
      label: "CTA principal",
      status: signals.hasCta ? "yes" : "no",
      evidence: signals.hasCta
        ? "Elemento CTA detectado no HTML"
        : "Nenhum elemento CTA encontrado",
      confidence: "medium",
    },
    {
      key: "contactForm",
      label: "Formulario de contato",
      status: signals.hasContactForm ? "yes" : "no",
      evidence: signals.hasContactForm
        ? "Tag <form> encontrada no HTML"
        : "Nenhum formulario encontrado",
      confidence: "high",
    },
    {
      key: "booking",
      label: "Agendamento / reserva",
      status: "unknown",
      evidence: "Requer analise mais profunda do conteudo do formulario",
      confidence: "low",
    },
    {
      key: "socialProof",
      label: "Prova social",
      status: signals.hasSocialProof ? "yes" : "no",
      evidence: signals.hasSocialProof
        ? "Sinais de prova social (depoimentos/avaliacoes) detectados"
        : "Nenhum sinal de prova social encontrado",
      confidence: "medium",
    },
    {
      key: "localSeo",
      label: "Sinais de SEO local",
      status:
        signals.title && signals.metaDescription
          ? "yes"
          : signals.title || signals.metaDescription
            ? "partial"
            : "no",
      evidence: [
        signals.title ? `Titulo: "${signals.title}"` : "Titulo ausente",
        signals.metaDescription
          ? `Meta description presente`
          : "Meta description ausente",
      ].join("; "),
      confidence: "medium",
    },
    {
      key: "googleMaps",
      label: "Google Maps",
      status: signals.hasGoogleMaps ? "yes" : "no",
      evidence: signals.hasGoogleMaps
        ? "Embed ou link do Google Maps encontrado"
        : "Nenhum embed/link do Google Maps encontrado",
      confidence: "high",
    },
    {
      key: "title",
      label: "Titulo da pagina",
      status: signals.title ? "yes" : "no",
      evidence: signals.title
        ? `Titulo encontrado: "${signals.title}"`
        : "Nenhum titulo encontrado",
      confidence: "high",
    },
    {
      key: "metaDescription",
      label: "Meta description",
      status: signals.metaDescription ? "yes" : "no",
      evidence: signals.metaDescription
        ? "Meta description presente"
        : "Meta description ausente",
      confidence: "high",
    },
    {
      key: "phone",
      label: "Telefone",
      status: signals.phones.length > 0 ? "yes" : "no",
      evidence:
        signals.phones.length > 0
          ? `Telefone encontrado: ${signals.phones[0]}`
          : "Nenhum telefone encontrado no HTML",
      confidence: "high",
    },
    {
      key: "email",
      label: "Email",
      status: signals.emails.length > 0 ? "yes" : "no",
      evidence:
        signals.emails.length > 0
          ? `Email encontrado: ${signals.emails[0]}`
          : "Nenhum email encontrado no HTML",
      confidence: "high",
    },
    {
      key: "address",
      label: "Endereco",
      status: signals.hasGoogleMaps ? "yes" : "unknown",
      evidence: signals.hasGoogleMaps
        ? "Endereco via Google Maps"
        : "Nao detectado apenas via HTML",
      confidence: "low",
    },
    {
      key: "technicalErrors",
      label: "Erros tecnicos visiveis",
      status:
        !signals.hasCharset || !signals.hasViewport || signals.bodyLength < 100
          ? "yes"
          : "no",
      evidence: [
        !signals.hasCharset ? "Charset ausente" : null,
        !signals.hasViewport ? "Viewport ausente" : null,
        signals.bodyLength < 100
          ? "Conteudo textual muito curto (possivel JS-rendered)"
          : null,
      ]
        .filter(Boolean)
        .join("; ") || "Nenhum erro tecnico basico detectado",
      confidence: signals.bodyLength < 100 ? "medium" : "high",
    },
    {
      key: "socialLinks",
      label: "Links sociais",
      status: signals.socialLinks.length > 0 ? "yes" : "no",
      evidence:
        signals.socialLinks.length > 0
          ? `${signals.socialLinks.length} link(s) social(is) encontrado(s)`
          : "Nenhum link social encontrado",
      confidence: "high",
    },
    {
      key: "internalLinks",
      label: "Links internos",
      status:
        signals.internalLinkCount >= 3
          ? "yes"
          : signals.internalLinkCount > 0
            ? "partial"
            : "no",
      evidence: `${signals.internalLinkCount} link(s) interno(s) detectado(s)`,
      confidence: "medium",
    },
    {
      key: "h1",
      label: "Heading principal (H1)",
      status: signals.h1 ? "yes" : "no",
      evidence: signals.h1
        ? `H1 encontrado: "${signals.h1}"`
        : "Nenhum H1 encontrado",
      confidence: "high",
    },
    {
      key: "viewport",
      label: "Viewport (responsividade)",
      status: signals.hasViewport ? "yes" : "no",
      evidence: signals.hasViewport
        ? "Viewport meta tag presente"
        : "Viewport meta tag ausente",
      confidence: "high",
    },
    {
      key: "charset",
      label: "Charset",
      status: signals.hasCharset ? "yes" : "no",
      evidence: signals.hasCharset
        ? "Charset declarado"
        : "Charset nao declarado",
      confidence: "high",
    },
    {
      key: "canonical",
      label: "URL canonica",
      status: signals.hasCanonical ? "yes" : "no",
      evidence: signals.hasCanonical
        ? "Link canonical presente"
        : "Link canonical ausente",
      confidence: "high",
    },
    {
      key: "imagesAlt",
      label: "Atributo alt em imagens",
      status: signals.imagesAlt,
      evidence:
        signals.imagesAlt === "yes"
          ? "Todas as imagens com alt"
          : signals.imagesAlt === "no"
            ? "Imagens sem atributo alt"
            : "Nenhuma imagem encontrada",
      confidence: "high",
    },
    {
      key: "techStack",
      label: "Stack / tecnologia",
      status: signals.techStack,
      evidence:
        signals.techStack === "yes"
          ? "Framework moderno detectado no HTML"
          : signals.techStack === "partial"
            ? "CMS ou tecnologia parcialmente detectada"
            : signals.techStack === "no"
              ? "Marcadores de stack legado detectados"
              : "Stack nao detectada no HTML",
      confidence: "medium",
    },
    {
      key: "https",
      label: "HTTPS",
      status: signals.https ? "yes" : "no",
      evidence: signals.https
        ? "Site servido via HTTPS"
        : "Site servido sem HTTPS",
      confidence: "high",
    },
    {
      key: "bodyShort",
      label: "Conteudo JS-rendered",
      status: signals.bodyLength < 100 ? "yes" : "no",
      evidence:
        signals.bodyLength < 100
          ? "Conteudo textual muito curto — provavelmente JS-rendered"
          : "Conteudo textual normal",
      confidence: "medium",
    },
  ];

  // Compute scores
  const scores: DualScore = computeDualScore(evidence);

  // Generate briefing
  const briefingOptions: GenerateBriefingOptions = { evidence, scores };
  const briefing = generateBriefing(lead, audit, computeBriefingScore(signals), briefingOptions);

  // Generate artifacts
  const proposal = generateProposalFromBriefing(briefing);
  const proposalMd = renderProposalMarkdown(proposal);
  const briefingJson = serializeBriefing(briefing);
  const siteBuildPromptMd = generateSiteBuildPrompt(briefing);

  return {
    lead: {
      businessName: lead.businessName,
      category: lead.category,
      city: lead.city,
      state: lead.state,
      websiteUrl: lead.websiteUrl,
      email: lead.email,
    },
    evidence: evidence.map((e) => ({
      key: e.key,
      label: e.label,
      status: e.status,
      evidence: e.evidence,
      confidence: e.confidence,
    })),
    scores: {
      digitalMaturity: scores.digitalMaturity,
      commercialOpportunity: scores.commercialOpportunity,
      urgency: scores.urgency,
      overallPriority: scores.overallPriority,
      priorityLabel: scores.priorityLabel,
    },
    briefingJson,
    proposalMd,
    siteBuildPromptMd,
    report: buildSiteAuditReport({
      url: finalUrl,
      fetchedAt,
      evidence,
    }) satisfies SiteAuditReport,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a BriefingScore from HTML signals for the briefing generator. */
function computeBriefingScore(signals: ReturnType<typeof extractSignals>) {
  let digitalPresence = 35;
  if (signals.title && signals.metaDescription) digitalPresence += 15;
  if (signals.hasGoogleMaps) digitalPresence += 15;

  let conversion = 0;
  const convSignals = [
    signals.whatsappLinks.length > 0,
    signals.hasCta,
    signals.hasContactForm,
    signals.hasSocialProof,
  ].filter(Boolean).length;
  conversion = Math.round((convSignals / 4) * 100);

  let trust = 20;
  if (signals.hasSocialProof) trust += 50;
  if (signals.socialLinks.length > 0) trust += 10;

  let urgency = 55;
  if (signals.whatsappLinks.length === 0) urgency += 10;
  if (!signals.hasCta) urgency += 10;

  const overall = Math.round(
    digitalPresence * 0.2 +
      50 * 0.15 +
      40 * 0.15 +
      conversion * 0.25 +
      trust * 0.15 +
      urgency * 0.1,
  );

  return {
    digitalPresence: Math.min(100, Math.max(0, digitalPresence)),
    performance: 50, // Default without Lighthouse
    localSeo: Math.min(100, Math.max(0, signals.title && signals.metaDescription ? 55 : 15)),
    conversion: Math.min(100, Math.max(0, conversion)),
    trust: Math.min(100, Math.max(0, trust)),
    urgency: Math.min(100, Math.max(0, urgency)),
    overall: Math.min(100, Math.max(0, overall)),
  };
}
