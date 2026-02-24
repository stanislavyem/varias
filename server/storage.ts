import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import {
  organizations,
  memberships,
  questions,
  assessments,
  responses,
  scoreSnapshots,
  actionItems,
  comments,
  documents,
  subcontractorResponses,
  userProfiles,
  type InsertOrganization,
  type Organization,
  type InsertMembership,
  type Membership,
  type InsertQuestion,
  type Question,
  type InsertAssessment,
  type Assessment,
  type InsertResponse,
  type Response,
  type InsertScoreSnapshot,
  type ScoreSnapshot,
  type InsertActionItem,
  type ActionItem,
  type InsertComment,
  type Comment,
  type InsertDocument,
  type Document,
  type InsertSubcontractorResponse,
  type SubcontractorResponse,
  type InsertUserProfile,
  type UserProfile,
  calculateQuestionScore,
  applyConstraints,
  getRatingFromScore,
  rawScoreToDisplay,
  PILLAR_WEIGHTS,
} from "@shared/schema";
import { users } from "@shared/models/auth";

export interface IStorage {
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Organizations
  getOrganizations(userId: string): Promise<Organization[]>;
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization, userId: string): Promise<Organization>;
  deleteOrganization(id: string): Promise<void>;
  
  // Memberships
  getMemberships(userId: string): Promise<Membership[]>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  
  // Questions
  getQuestions(): Promise<Question[]>;
  seedQuestions(questionsData: InsertQuestion[]): Promise<void>;
  
  // Assessments
  getAssessments(userId: string): Promise<Assessment[]>;
  getAssessment(id: string): Promise<Assessment | undefined>;
  getAssessmentsByOrganization(orgId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessmentStatus(id: string, status: string): Promise<Assessment>;
  updateAssessmentNotes(id: string, notes: string): Promise<Assessment>;
  deleteAssessment(id: string): Promise<void>;
  
  // Responses
  getResponsesByAssessment(assessmentId: string): Promise<Response[]>;
  upsertResponse(response: InsertResponse): Promise<Response>;
  
  // Score Snapshots
  getLatestScoreSnapshot(assessmentId: string): Promise<ScoreSnapshot | undefined>;
  createScoreSnapshot(snapshot: InsertScoreSnapshot): Promise<ScoreSnapshot>;
  
  // Action Items
  getActionItems(userId: string): Promise<ActionItem[]>;
  getActionItemsByOrganization(orgId: string): Promise<ActionItem[]>;
  createActionItem(action: InsertActionItem): Promise<ActionItem>;
  updateActionItemStatus(id: string, status: string): Promise<ActionItem>;
  
  // Comments
  getComments(userId: string): Promise<Comment[]>;
  getCommentsByOrganization(orgId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Documents
  getDocuments(userId: string): Promise<Document[]>;
  getDocumentsByOrganization(orgId: string): Promise<Document[]>;
  getDocumentsByActionItem(actionItemId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  
  // Action Item lookup
  getActionItem(id: string): Promise<ActionItem | undefined>;
  
  // Subcontractor Responses
  getSubcontractorResponse(assessmentId: string): Promise<SubcontractorResponse | undefined>;
  upsertSubcontractorResponse(response: InsertSubcontractorResponse): Promise<SubcontractorResponse>;
  
  // Scoring
  calculateAndSaveScores(assessmentId: string): Promise<ScoreSnapshot>;
}

export class DatabaseStorage implements IStorage {
  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  // Organizations
  async getOrganizations(userId: string): Promise<Organization[]> {
    const memberOrgs = await db
      .select({ organizationId: memberships.organizationId })
      .from(memberships)
      .where(eq(memberships.userId, userId));
    
    if (memberOrgs.length === 0) {
      return db.select().from(organizations).orderBy(desc(organizations.createdAt));
    }
    
    const orgIds = memberOrgs.map(m => m.organizationId);
    return db.select().from(organizations)
      .where(inArray(organizations.id, orgIds))
      .orderBy(desc(organizations.createdAt));
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: InsertOrganization, userId: string): Promise<Organization> {
    const [created] = await db.insert(organizations).values(org).returning();
    await db.insert(memberships).values({
      userId,
      organizationId: created.id,
    });
    return created;
  }

  async deleteOrganization(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      const orgAssessments = await tx.select({ id: assessments.id }).from(assessments).where(eq(assessments.organizationId, id));
      const assessmentIds = orgAssessments.map(a => a.id);

      if (assessmentIds.length > 0) {
        await tx.delete(responses).where(inArray(responses.assessmentId, assessmentIds));
        await tx.delete(scoreSnapshots).where(inArray(scoreSnapshots.assessmentId, assessmentIds));
        await tx.delete(subcontractorResponses).where(inArray(subcontractorResponses.assessmentId, assessmentIds));
      }

      await tx.delete(assessments).where(eq(assessments.organizationId, id));
      await tx.delete(actionItems).where(eq(actionItems.organizationId, id));
      await tx.delete(comments).where(eq(comments.organizationId, id));
      await tx.delete(documents).where(eq(documents.organizationId, id));
      await tx.delete(memberships).where(eq(memberships.organizationId, id));
      await tx.delete(organizations).where(eq(organizations.id, id));
    });
  }

  // Memberships
  async getMemberships(userId: string): Promise<Membership[]> {
    return db.select().from(memberships).where(eq(memberships.userId, userId));
  }

  async createMembership(membership: InsertMembership): Promise<Membership> {
    const [created] = await db.insert(memberships).values(membership).returning();
    return created;
  }

  // Questions
  async getQuestions(): Promise<Question[]> {
    return db.select().from(questions).orderBy(questions.sortOrder);
  }

  async seedQuestions(questionsData: InsertQuestion[]): Promise<void> {
    const newIds = questionsData.map(q => q.id);
    const existing = await db.select({ id: questions.id }).from(questions);
    const oldIds = existing.map(q => q.id).filter(id => !newIds.includes(id));
    if (oldIds.length > 0) {
      await db.delete(responses).where(inArray(responses.questionId, oldIds));
      await db.delete(questions).where(inArray(questions.id, oldIds));
    }
    for (const q of questionsData) {
      await db.insert(questions).values(q)
        .onConflictDoUpdate({
          target: questions.id,
          set: {
            pillar: q.pillar,
            topic: q.topic,
            text: q.text,
            weight: q.weight,
            scaleNotes: q.scaleNotes,
            constraints: q.constraints,
            sortOrder: q.sortOrder,
          },
        });
    }
  }

  // Assessments
  async getAssessments(userId: string): Promise<Assessment[]> {
    return db.select().from(assessments).orderBy(desc(assessments.createdAt));
  }

  async getAssessment(id: string): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }

  async getAssessmentsByOrganization(orgId: string): Promise<Assessment[]> {
    return db.select().from(assessments)
      .where(eq(assessments.organizationId, orgId))
      .orderBy(desc(assessments.createdAt));
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [created] = await db.insert(assessments).values(assessment).returning();
    return created;
  }

  async updateAssessmentNotes(id: string, notes: string): Promise<Assessment> {
    const [updated] = await db.update(assessments)
      .set({ notes })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  async updateAssessmentStatus(id: string, status: string): Promise<Assessment> {
    const [updated] = await db.update(assessments)
      .set({ 
        status: status as any, 
        submittedAt: status === "SUBMITTED" ? new Date() : undefined 
      })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  async deleteAssessment(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(responses).where(eq(responses.assessmentId, id));
      await tx.delete(scoreSnapshots).where(eq(scoreSnapshots.assessmentId, id));
      await tx.delete(subcontractorResponses).where(eq(subcontractorResponses.assessmentId, id));
      await tx.delete(assessments).where(eq(assessments.id, id));
    });
  }

  // Responses
  async getResponsesByAssessment(assessmentId: string): Promise<Response[]> {
    return db.select().from(responses).where(eq(responses.assessmentId, assessmentId));
  }

  async upsertResponse(response: InsertResponse): Promise<Response> {
    const question = await db.select().from(questions).where(eq(questions.id, response.questionId)).then(r => r[0]);
    const weight = Number(question?.weight || 0);

    const constraintApplied = response.constraintApplied || false;
    let scoredValue = response.responseValue;
    let capValue: number | null = null;

    if (constraintApplied && question?.constraints) {
      scoredValue = applyConstraints(response.responseValue, question.constraints);
      const { caps } = await import("@shared/schema").then(m => m.parseConstraints(question.constraints));
      if (caps.length > 0) capValue = Math.min(...caps);
    }

    const questionScore = calculateQuestionScore(scoredValue, weight);

    const existing = await db.select().from(responses)
      .where(and(
        eq(responses.assessmentId, response.assessmentId),
        eq(responses.questionId, response.questionId)
      ));

    const data = {
      responseValue: response.responseValue,
      responseScoredValue: scoredValue,
      questionScore: questionScore.toFixed(6),
      constraintApplied,
      constraintCapValue: capValue,
      pillar: question?.pillar || null,
      topic: question?.topic || null,
      weight: question?.weight || null,
      questionTextOriginal: question?.text || null,
      scaleNotesOriginal: question?.scaleNotes || null,
      constraintsOriginal: question?.constraints || null,
    };

    if (existing.length > 0) {
      const [updated] = await db.update(responses)
        .set(data)
        .where(eq(responses.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(responses).values({
      assessmentId: response.assessmentId,
      questionId: response.questionId,
      ...data,
    }).returning();
    return created;
  }

  // Score Snapshots
  async getLatestScoreSnapshot(assessmentId: string): Promise<ScoreSnapshot | undefined> {
    const [snapshot] = await db.select().from(scoreSnapshots)
      .where(eq(scoreSnapshots.assessmentId, assessmentId))
      .orderBy(desc(scoreSnapshots.createdAt))
      .limit(1);
    return snapshot;
  }

  async createScoreSnapshot(snapshot: InsertScoreSnapshot): Promise<ScoreSnapshot> {
    const [created] = await db.insert(scoreSnapshots).values(snapshot).returning();
    return created;
  }

  // Action Items
  async getActionItems(userId: string): Promise<ActionItem[]> {
    return db.select().from(actionItems).orderBy(desc(actionItems.priorityRank), desc(actionItems.createdAt));
  }

  async getActionItemsByOrganization(orgId: string): Promise<ActionItem[]> {
    return db.select().from(actionItems)
      .where(eq(actionItems.organizationId, orgId))
      .orderBy(desc(actionItems.priorityRank), desc(actionItems.createdAt));
  }

  async createActionItem(action: InsertActionItem): Promise<ActionItem> {
    const [created] = await db.insert(actionItems).values(action).returning();
    return created;
  }

  async updateActionItemStatus(id: string, status: string): Promise<ActionItem> {
    const [updated] = await db.update(actionItems)
      .set({ 
        status: status as any,
        closedAt: status === "DONE" ? new Date() : null,
      })
      .where(eq(actionItems.id, id))
      .returning();
    return updated;
  }

  // Comments
  async getComments(userId: string): Promise<Comment[]> {
    return db.select().from(comments).orderBy(desc(comments.createdAt));
  }

  async getCommentsByOrganization(orgId: string): Promise<Comment[]> {
    return db.select().from(comments)
      .where(eq(comments.organizationId, orgId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [created] = await db.insert(comments).values(comment).returning();
    return created;
  }

  // Documents
  async getDocuments(userId: string): Promise<Document[]> {
    return db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByOrganization(orgId: string): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.organizationId, orgId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocumentsByActionItem(actionItemId: string): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.actionItemId, actionItemId))
      .orderBy(desc(documents.createdAt));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [created] = await db.insert(documents).values(doc).returning();
    return created;
  }

  async getActionItem(id: string): Promise<ActionItem | undefined> {
    const [item] = await db.select().from(actionItems)
      .where(eq(actionItems.id, id));
    return item;
  }

  // Subcontractor Responses
  async getSubcontractorResponse(assessmentId: string): Promise<SubcontractorResponse | undefined> {
    const [response] = await db.select().from(subcontractorResponses)
      .where(eq(subcontractorResponses.assessmentId, assessmentId));
    return response;
  }

  async upsertSubcontractorResponse(response: InsertSubcontractorResponse): Promise<SubcontractorResponse> {
    const weightedAvg = this.calculateSubcontractorWeightedAvg(
      response.safetyTrainingScore || 0,
      response.insuranceVerificationScore || 0,
      response.coverageContractScore || 0
    );
    const guardrailTriggered = (response.insuranceVerificationScore || 0) <= 2 && (response.insuranceVerificationScore || 0) > 0;

    const existing = await db.select().from(subcontractorResponses)
      .where(eq(subcontractorResponses.assessmentId, response.assessmentId));

    if (existing.length > 0) {
      const [updated] = await db.update(subcontractorResponses)
        .set({
          ...response,
          weightedAvg: weightedAvg?.toFixed(3) || null,
          guardrailTriggered,
        })
        .where(eq(subcontractorResponses.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(subcontractorResponses).values({
      ...response,
      weightedAvg: weightedAvg?.toFixed(3) || null,
      guardrailTriggered,
    }).returning();
    return created;
  }

  private calculateSubcontractorWeightedAvg(safety: number, insurance: number, coverage: number): number | null {
    if (!safety && !insurance && !coverage) return null;
    return safety * 0.3 + insurance * 0.4 + coverage * 0.3;
  }

  // Scoring Engine
  async calculateAndSaveScores(assessmentId: string): Promise<ScoreSnapshot> {
    const allQuestions = await this.getQuestions();
    const allResponses = await this.getResponsesByAssessment(assessmentId);
    const subResponse = await this.getSubcontractorResponse(assessmentId);

    const validQuestionIds = new Set(allQuestions.map(q => q.id));
    const validResponses = allResponses.filter(r => validQuestionIds.has(r.questionId));
    const completionPct = (validResponses.length / allQuestions.length) * 100;
    const isComplete = validResponses.length === allQuestions.length;

    const totalWeight = allQuestions.reduce((sum, q) => sum + Number(q.weight), 0);
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      console.warn(`[SCORING WARNING] Question weights sum to ${totalWeight.toFixed(4)}, expected 1.0000`);
    }

    let overallScore: number | null = null;
    let overallRating: string | null = null;
    let safetyScore: number | null = null;
    let workersCompScore: number | null = null;
    let fleetScore: number | null = null;

    if (isComplete) {
      const pillarPts: Record<string, number> = { Safety: 0, WorkersComp: 0, Fleet: 0 };
      let totalScore = 0;

      for (const response of validResponses) {
        const qScore = Number(response.questionScore);
        totalScore += qScore;
        const pillar = response.pillar || "";
        if (pillar in pillarPts) {
          pillarPts[pillar] = (pillarPts[pillar] || 0) + qScore;
        }
      }

      overallScore = rawScoreToDisplay(totalScore);
      overallRating = getRatingFromScore(totalScore);

      safetyScore = rawScoreToDisplay(pillarPts.Safety / PILLAR_WEIGHTS.Safety);
      workersCompScore = rawScoreToDisplay(pillarPts.WorkersComp / PILLAR_WEIGHTS.WorkersComp);
      fleetScore = rawScoreToDisplay(pillarPts.Fleet / PILLAR_WEIGHTS.Fleet);
    }

    const guardrailTriggered = subResponse?.guardrailTriggered || false;

    const snapshot: InsertScoreSnapshot = {
      assessmentId,
      completionPct: completionPct.toFixed(2),
      overallScore: overallScore?.toFixed(1) || null,
      overallRating,
      safetyScore: safetyScore?.toFixed(1) || null,
      workersCompScore: workersCompScore?.toFixed(1) || null,
      fleetScore: fleetScore?.toFixed(1) || null,
      guardrailTriggered,
      subcontractorWeightedAvg: subResponse?.weightedAvg || null,
    };

    return this.createScoreSnapshot(snapshot);
  }
}

export const storage = new DatabaseStorage();
