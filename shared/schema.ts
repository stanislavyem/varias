import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const userRoleEnum = pgEnum("user_role", ["CARRIER", "AGENT", "INSURED"]);
export const assessmentStatusEnum = pgEnum("assessment_status", ["DRAFT", "SUBMITTED", "CLOSED"]);
export const actionStatusEnum = pgEnum("action_status", ["OPEN", "IN_PROGRESS", "DONE"]);
export const documentCategoryEnum = pgEnum("document_category", [
  "SAFETY_PROGRAM", "TRAINING", "COI", "OSHA_LOG", "INCIDENT_REPORT", "OTHER"
]);

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: userRoleEnum("role").notNull().default("INSURED"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry"),
  naicsCode: varchar("naics_code", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  organizationId: varchar("organization_id").notNull(),
  roleOverride: userRoleEnum("role_override"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey(),
  pillar: text("pillar").notNull(),
  topic: text("topic").notNull(),
  text: text("text").notNull(),
  weight: decimal("weight", { precision: 5, scale: 4 }).notNull(),
  scaleNotes: text("scale_notes"),
  constraints: text("constraints"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  createdByUserId: varchar("created_by_user_id").notNull(),
  status: assessmentStatusEnum("status").notNull().default("DRAFT"),
  createdAt: timestamp("created_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
});

export const responses = pgTable("responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(),
  questionId: varchar("question_id").notNull(),
  responseValue: integer("response_value").notNull(),
  responseScoredValue: integer("response_scored_value").notNull(),
  questionScore: decimal("question_score", { precision: 10, scale: 6 }).notNull(),
  constraintApplied: boolean("constraint_applied").notNull().default(false),
  constraintCapValue: integer("constraint_cap_value"),
  pillar: text("pillar"),
  topic: text("topic"),
  weight: decimal("weight", { precision: 5, scale: 4 }),
  questionTextOriginal: text("question_text_original"),
  scaleNotesOriginal: text("scale_notes_original"),
  constraintsOriginal: text("constraints_original"),
});

export const scoreSnapshots = pgTable("score_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(),
  completionPct: decimal("completion_pct", { precision: 5, scale: 2 }),
  overallScore: decimal("overall_score", { precision: 6, scale: 3 }),
  overallRating: text("overall_rating"),
  safetyScore: decimal("safety_score", { precision: 6, scale: 3 }),
  workersCompScore: decimal("workers_comp_score", { precision: 6, scale: 3 }),
  fleetScore: decimal("fleet_score", { precision: 6, scale: 3 }),
  guardrailTriggered: boolean("guardrail_triggered").default(false),
  subcontractorWeightedAvg: decimal("subcontractor_weighted_avg", { precision: 5, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const actionItems = pgTable("action_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  assessmentId: varchar("assessment_id"),
  assignedToUserId: varchar("assigned_to_user_id"),
  createdByUserId: varchar("created_by_user_id").notNull(),
  priorityRank: integer("priority_rank").notNull().default(0),
  title: text("title").notNull(),
  description: text("description"),
  status: actionStatusEnum("status").notNull().default("OPEN"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  assessmentId: varchar("assessment_id"),
  actionItemId: varchar("action_item_id"),
  authorUserId: varchar("author_user_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  assessmentId: varchar("assessment_id"),
  uploadedByUserId: varchar("uploaded_by_user_id").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  storagePath: text("storage_path").notNull(),
  category: documentCategoryEnum("category").notNull().default("OTHER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subcontractorResponses = pgTable("subcontractor_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull(),
  safetyTrainingScore: integer("safety_training_score"),
  insuranceVerificationScore: integer("insurance_verification_score"),
  coverageContractScore: integer("coverage_contract_score"),
  weightedAvg: decimal("weighted_avg", { precision: 5, scale: 3 }),
  guardrailTriggered: boolean("guardrail_triggered").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true });
export const insertOrganizationSchema = createInsertSchema(organizations).omit({ id: true, createdAt: true });
export const insertMembershipSchema = createInsertSchema(memberships).omit({ id: true, createdAt: true });
export const insertQuestionSchema = createInsertSchema(questions);
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, submittedAt: true });
export const insertResponseSchema = createInsertSchema(responses).omit({ id: true });
export const insertScoreSnapshotSchema = createInsertSchema(scoreSnapshots).omit({ id: true, createdAt: true });
export const insertActionItemSchema = createInsertSchema(actionItems).omit({ id: true, createdAt: true, closedAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export const insertSubcontractorResponseSchema = createInsertSchema(subcontractorResponses).omit({ id: true, createdAt: true });

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type Membership = typeof memberships.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertScoreSnapshot = z.infer<typeof insertScoreSnapshotSchema>;
export type ScoreSnapshot = typeof scoreSnapshots.$inferSelect;
export type InsertActionItem = z.infer<typeof insertActionItemSchema>;
export type ActionItem = typeof actionItems.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertSubcontractorResponse = z.infer<typeof insertSubcontractorResponseSchema>;
export type SubcontractorResponse = typeof subcontractorResponses.$inferSelect;

export const RATING_BANDS = {
  HIGH_RISK: { min: 0, max: 54, label: "High Risk" },
  ELEVATED_RISK: { min: 55, max: 69, label: "Elevated Risk" },
  MODERATE_RISK: { min: 70, max: 84, label: "Moderate Risk" },
  STRONG_LOW_RISK: { min: 85, max: 100, label: "Strong / Low Risk" },
} as const;

export const PILLAR_WEIGHTS = {
  Safety: 0.4,
  WorkersComp: 0.2,
  Fleet: 0.4,
} as const;

export const SUBCONTRACTOR_WEIGHTS = {
  safetyTraining: 0.3,
  insuranceVerification: 0.4,
  coverageContract: 0.3,
} as const;

export const ENABLE_GUARDRAIL_CAPPING = false;

export function rawScoreToDisplay(rawScore: number): number {
  return ((rawScore - 1) / 4) * 100;
}

export function getRatingFromScore(rawScore: number): string {
  const display = rawScoreToDisplay(rawScore);
  if (display < 55) return RATING_BANDS.HIGH_RISK.label;
  if (display < 70) return RATING_BANDS.ELEVATED_RISK.label;
  if (display < 85) return RATING_BANDS.MODERATE_RISK.label;
  return RATING_BANDS.STRONG_LOW_RISK.label;
}

export function parseConstraints(constraintText: string | null): { caps: number[]; mins: number[] } {
  const result = { caps: [] as number[], mins: [] as number[] };
  if (!constraintText) return result;
  try {
    const capMatches = constraintText.match(/cap(?:s)?\s+at\s+(\d+)/gi);
    if (capMatches) {
      for (const m of capMatches) {
        const num = m.match(/(\d+)/);
        if (num) result.caps.push(parseInt(num[1], 10));
      }
    }
    const minMatches = constraintText.match(/min(?:imum)?\s+(?:at\s+)?(\d+)/gi);
    if (minMatches) {
      for (const m of minMatches) {
        const num = m.match(/(\d+)/);
        if (num) result.mins.push(parseInt(num[1], 10));
      }
    }
  } catch {
  }
  return result;
}

export function applyConstraints(responseValue: number, constraintText: string | null): number {
  const { caps, mins } = parseConstraints(constraintText);
  let scored = responseValue;
  if (mins.length > 0) {
    const minVal = Math.max(...mins);
    scored = Math.max(scored, minVal);
  }
  if (caps.length > 0) {
    const capVal = Math.min(...caps);
    scored = Math.min(scored, capVal);
  }
  return scored;
}

export function calculateQuestionScore(scoredValue: number, weight: number): number {
  return scoredValue * weight;
}
