import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
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
  calculateNormScore,
  calculateWeightedPts,
  getRatingFromScore,
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
  createDocument(doc: InsertDocument): Promise<Document>;
  
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
      .where(sql`${organizations.id} = ANY(${orgIds})`)
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
    const existing = await db.select().from(questions).limit(1);
    if (existing.length === 0) {
      await db.insert(questions).values(questionsData);
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

  // Responses
  async getResponsesByAssessment(assessmentId: string): Promise<Response[]> {
    return db.select().from(responses).where(eq(responses.assessmentId, assessmentId));
  }

  async upsertResponse(response: InsertResponse): Promise<Response> {
    const normScore = calculateNormScore(response.responseValue);
    const question = await db.select().from(questions).where(eq(questions.id, response.questionId)).then(r => r[0]);
    const weightedPts = calculateWeightedPts(normScore, Number(question?.weight || 0));

    const existing = await db.select().from(responses)
      .where(and(
        eq(responses.assessmentId, response.assessmentId),
        eq(responses.questionId, response.questionId)
      ));

    if (existing.length > 0) {
      const [updated] = await db.update(responses)
        .set({
          responseValue: response.responseValue,
          normScore: normScore.toFixed(4),
          weightedPts: weightedPts.toFixed(6),
        })
        .where(eq(responses.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db.insert(responses).values({
      ...response,
      normScore: normScore.toFixed(4),
      weightedPts: weightedPts.toFixed(6),
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

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [created] = await db.insert(documents).values(doc).returning();
    return created;
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

    const completionPct = (allResponses.length / allQuestions.length) * 100;
    const isComplete = allResponses.length === allQuestions.length;

    let overallScore: number | null = null;
    let overallRating: string | null = null;
    let safetyScore: number | null = null;
    let workersCompScore: number | null = null;
    let fleetScore: number | null = null;

    if (isComplete) {
      // Calculate overall score: 100 * SUM(WeightedPts) across all 20 questions
      const totalWeightedPts = allResponses.reduce((sum, r) => sum + Number(r.weightedPts), 0);
      overallScore = 100 * totalWeightedPts;
      overallRating = getRatingFromScore(overallScore);

      // Calculate pillar scores
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));
      const pillarPts: Record<string, number> = { Safety: 0, WorkersComp: 0, Fleet: 0 };

      for (const response of allResponses) {
        const question = questionMap.get(response.questionId);
        if (question) {
          pillarPts[question.pillar] = (pillarPts[question.pillar] || 0) + Number(response.weightedPts);
        }
      }

      // Pillar score = (sum of weightedPts for pillar / pillar weight share) * 100
      safetyScore = (pillarPts.Safety / PILLAR_WEIGHTS.Safety) * 100;
      workersCompScore = (pillarPts.WorkersComp / PILLAR_WEIGHTS.WorkersComp) * 100;
      fleetScore = (pillarPts.Fleet / PILLAR_WEIGHTS.Fleet) * 100;
    }

    const guardrailTriggered = subResponse?.guardrailTriggered || false;

    const snapshot: InsertScoreSnapshot = {
      assessmentId,
      completionPct: completionPct.toFixed(2),
      overallScore: overallScore?.toFixed(3) || null,
      overallRating,
      safetyScore: safetyScore?.toFixed(3) || null,
      workersCompScore: workersCompScore?.toFixed(3) || null,
      fleetScore: fleetScore?.toFixed(3) || null,
      guardrailTriggered,
      subcontractorWeightedAvg: subResponse?.weightedAvg || null,
    };

    return this.createScoreSnapshot(snapshot);
  }
}

export const storage = new DatabaseStorage();
