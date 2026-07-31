export { leadSchema, leadStatusSchema, mockLead } from "./lead.ts";
export type { Lead } from "./lead.ts";

export { auditSchema, auditModeSchema, mockAudit } from "./audit.ts";
export type { Audit } from "./audit.ts";

export {
  computeCommercialScore,
  mockAuditForScoring,
  priorityLabelFromOverall,
  priorityLabelSchema,
} from "./score.ts";
export type { PriorityLabel, ScoringInput } from "./score.ts";

export {
  ACCEPTANCE_CRITERIA,
  DELIVERY_GOAL_DAYS,
  MUST_NOT_INVENT,
  PRIMARY_CTA,
  PRIMARY_GOAL,
  PROJECT_TYPE,
  SECONDARY_CTA,
  TARGET_STACK,
  TONE,
  VISUAL_DIRECTION,
  briefingSchema,
  briefingScoreSchema,
  businessSchema,
  contentRulesSchema,
  diagnosisSchema,
  mockBriefing,
  projectSchema,
  sitePlanSchema,
} from "./briefing.ts";
export type { Briefing, BriefingScore } from "./briefing.ts";

export {
  buildCommercialRisks,
  buildMainProblems,
  buildMissingAssets,
  buildMustUse,
  buildOpportunities,
  buildSeoKeywords,
  buildSections,
  buildTechnicalRisks,
  generateBriefing,
} from "./briefing-generator.ts";

export {
  HUMAN_APPROVAL_NOTE,
  buildBusinessSummary,
  generateProposalFromBriefing,
  mockProposal,
  priorityLabelToPt,
  proposalMetaSchema,
  proposalSchema,
  recommendedSitePlanSchema,
  renderProposalMarkdown,
} from "./proposal.ts";
export type { Proposal } from "./proposal.ts";
