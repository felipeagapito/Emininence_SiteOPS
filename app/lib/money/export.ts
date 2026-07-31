import type { Briefing } from "./briefing.ts";
import {
  generateProposalFromBriefing,
  renderProposalMarkdown,
} from "./proposal.ts";

// ---------------------------------------------------------------------------
// Read-only export helpers — deterministic serializers for the Money Engine
// artifacts. No AI, no I/O, no external calls.
// ---------------------------------------------------------------------------

/** Serializes a briefing to a deterministic, pretty-printed JSON string. */
export function serializeBriefing(briefing: Briefing): string {
  return JSON.stringify(briefing, null, 2);
}

/** Generates the full proposal Markdown from a briefing in one call. */
export function generateProposalMarkdown(briefing: Briefing): string {
  const proposal = generateProposalFromBriefing(briefing);
  return renderProposalMarkdown(proposal);
}
