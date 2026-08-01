import { z } from "zod";

export const leadStatusSchema = z.enum([
  "new",
  "needs_audit",
  "audited",
  "proposal_ready",
  "contacted",
  "won",
  "lost",
  "not_fit",
]);

export const leadSchema = z.object({
  id: z.string(),
  businessName: z.string().min(1),
  category: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  websiteUrl: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  source: z.enum(["manual", "csv", "maxun", "other", "url"]),
  status: leadStatusSchema,
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Lead = z.infer<typeof leadSchema>;

export const mockLead: Lead = {
  id: "lead_001",
  businessName: "Calhas Silva",
  category: "Telhados e calhas",
  city: "Joinville",
  state: "SC",
  country: "BR",
  phone: "(47) 99999-0000",
  whatsapp: "+5547999990000",
  websiteUrl: "https://example.com",
  source: "manual",
  status: "needs_audit",
  notes:
    "Negocio local de telhados e calhas. Site existe mas sem WhatsApp visivel e sem CTA.",
  createdAt: "2026-07-31T10:00:00.000Z",
  updatedAt: "2026-07-31T10:00:00.000Z",
};
