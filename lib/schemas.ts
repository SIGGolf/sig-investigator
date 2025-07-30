import { z } from 'zod';

// Enums
export const EntityTypeSchema = z.enum(["Person", "Company", "CryptoWallet", "Asset", "Unknown"]);
export type EntityType = z.infer<typeof EntityTypeSchema>;

export const CertaintySchema = z.enum(["Confirmed", "Suspected"]);
export type Certainty = z.infer<typeof CertaintySchema>;

export const NatureSchema = z.enum(["Illicit", "Neutral", "Legitimate"]);
export type Nature = z.infer<typeof NatureSchema>;

// Node schema
export const NodeRecordSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: EntityTypeSchema,
  role: z.string().optional(),
  detail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  riskScore: z.number().min(0).max(100).optional(),
  selectors: z.object({
    emails: z.array(z.string()).optional(),
    phones: z.array(z.string()).optional(),
    wallets: z.array(z.string()).optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type NodeRecord = z.infer<typeof NodeRecordSchema>;

// Edge schema
export const EdgeRecordSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  description: z.string().optional(),
  certainty: CertaintySchema,
  nature: NatureSchema,
  date: z.string().optional(),
  amount: z.number().optional(),
  currency: z.enum(["GBP", "USD", "EUR", "BTC", "ETH", "USDT"]).optional(),
  references: z.array(z.string()).optional(),
});

export type EdgeRecord = z.infer<typeof EdgeRecordSchema>;

// Timeline row schema
export const TimelineRowSchema = z.object({
  timestamp: z.string(),
  granularity: z.string(),
  source: z.enum(["text", "image_ocr"]),
  context: z.string(),
  persons: z.string().optional(),
  orgs: z.string().optional(),
  emails: z.string().optional(),
  phones: z.string().optional(),
  wallets: z.string().optional(),
  amounts: z.string().optional(),
});

export type TimelineRow = z.infer<typeof TimelineRowSchema>;

// Matrix row schema
export const MatrixRowSchema = z.object({
  entity: z.string(),
  category: z.enum(["Person", "Organisation"]),
  inferred_role: z.string(),
  mentions: z.number(),
  first_seen: z.string().optional(),
  last_seen: z.string().optional(),
  related_entities: z.string().optional(),
  emails: z.string().optional(),
  phones: z.string().optional(),
  wallets: z.string().optional(),
  claims_snippet: z.string().optional(),
  exhibits: z.string().optional(),
});

export type MatrixRow = z.infer<typeof MatrixRowSchema>;

// Graph data schema
export const GraphDataSchema = z.object({
  nodes: z.array(NodeRecordSchema),
  edges: z.array(EdgeRecordSchema),
});

export type GraphData = z.infer<typeof GraphDataSchema>;

// Import file schema
export const ImportFileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  hash: z.string(),
  content: z.string(),
});

export type ImportFile = z.infer<typeof ImportFileSchema>; 