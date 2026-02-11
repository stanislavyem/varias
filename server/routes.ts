import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replit_integrations/auth";
import { QUESTIONS_DATA } from "./questions-data";
import { db } from "./db";
import { organizations, users, assessments, scoreSnapshots, actionItems, documents, comments } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import {
  calculateQuestionScore,
  applyConstraints,
  getRatingFromScore,
  PILLAR_WEIGHTS,
  insertOrganizationSchema,
  insertAssessmentSchema,
  insertActionItemSchema,
  insertCommentSchema,
  questions as questionsTable,
} from "@shared/schema";

// Validation schemas
const createOrganizationSchema = insertOrganizationSchema.extend({
  name: z.string().min(1, "Organization name is required"),
});

const createAssessmentSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
});

const createResponseSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  responseValue: z.number().int().min(1).max(5),
  constraintApplied: z.boolean().optional().default(false),
});

const createActionSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  priorityRank: z.number().int().min(0).max(100).default(50),
  assessmentId: z.string().nullable().optional(),
});

const updateActionStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
});

const createCommentSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  body: z.string().min(1, "Comment body is required"),
  assessmentId: z.string().nullable().optional(),
  actionItemId: z.string().nullable().optional(),
});

const subcontractorSchema = z.object({
  safetyTrainingScore: z.number().int().min(1).max(5).nullable().optional(),
  insuranceVerificationScore: z.number().int().min(1).max(5).nullable().optional(),
  coverageContractScore: z.number().int().min(1).max(5).nullable().optional(),
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed questions on startup
  await storage.seedQuestions(QUESTIONS_DATA);

  // Dashboard endpoint
  app.get("/api/dashboard", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const orgs = await storage.getOrganizations(userId);
      const allActions = await storage.getActionItems(userId);
      
      // Get latest scores with org names
      const latestScores = await db
        .select({
          id: scoreSnapshots.id,
          assessmentId: scoreSnapshots.assessmentId,
          organizationId: assessments.organizationId,
          completionPct: scoreSnapshots.completionPct,
          overallScore: scoreSnapshots.overallScore,
          overallRating: scoreSnapshots.overallRating,
          safetyScore: scoreSnapshots.safetyScore,
          workersCompScore: scoreSnapshots.workersCompScore,
          fleetScore: scoreSnapshots.fleetScore,
          guardrailTriggered: scoreSnapshots.guardrailTriggered,
          subcontractorWeightedAvg: scoreSnapshots.subcontractorWeightedAvg,
          createdAt: scoreSnapshots.createdAt,
          organizationName: organizations.name,
        })
        .from(scoreSnapshots)
        .innerJoin(assessments, eq(scoreSnapshots.assessmentId, assessments.id))
        .innerJoin(organizations, eq(assessments.organizationId, organizations.id))
        .where(sql`${scoreSnapshots.overallScore} IS NOT NULL`)
        .orderBy(desc(scoreSnapshots.createdAt));

      // Build a map of org ID to latest non-null score
      const orgScoreMap = new Map<string, { overallScore: string | null; overallRating: string | null }>();
      latestScores.forEach(score => {
        if (!orgScoreMap.has(score.organizationId)) {
          orgScoreMap.set(score.organizationId, {
            overallScore: score.overallScore,
            overallRating: score.overallRating,
          });
        }
      });

      // Add scores to organizations
      const orgsWithScores = orgs.map(org => ({
        ...org,
        latestScore: orgScoreMap.get(org.id)?.overallScore || null,
        latestRating: orgScoreMap.get(org.id)?.overallRating || null,
      }));

      // Add org names to actions
      const orgMap = new Map(orgs.map(o => [o.id, o.name]));
      const recentActions = allActions.slice(0, 10).map(a => ({
        ...a,
        organizationName: orgMap.get(a.organizationId) || "Unknown",
      }));

      // Calculate stats
      const openActions = allActions.filter(a => a.status !== "DONE").length;
      const activeAssessments = await db
        .select({ count: sql<number>`count(*)` })
        .from(assessments)
        .where(eq(assessments.status, "DRAFT"))
        .then(r => Number(r[0]?.count || 0));

      const avgScoreResult = await db
        .select({ avg: sql<number>`avg(${scoreSnapshots.overallScore}::numeric)` })
        .from(scoreSnapshots)
        .where(sql`${scoreSnapshots.overallScore} IS NOT NULL`);
      const avgScore = avgScoreResult[0]?.avg ? Number(avgScoreResult[0].avg) : null;

      res.json({
        organizations: orgsWithScores,
        recentActions,
        latestScores,
        stats: {
          totalOrganizations: orgs.length,
          activeAssessments,
          openActions,
          avgScore,
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to load dashboard" });
    }
  });

  // Organizations
  app.get("/api/organizations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const orgs = await storage.getOrganizations(userId);
      res.json(orgs);
    } catch (error) {
      console.error("Get organizations error:", error);
      res.status(500).json({ message: "Failed to load organizations" });
    }
  });

  app.get("/api/organizations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }

      const orgAssessments = await storage.getAssessmentsByOrganization(id);
      const orgActions = await storage.getActionItemsByOrganization(id);
      const orgDocuments = await storage.getDocumentsByOrganization(id);

      // Get latest score
      let latestScore = null;
      if (orgAssessments.length > 0) {
        for (const assessment of orgAssessments) {
          const score = await storage.getLatestScoreSnapshot(assessment.id);
          if (score && score.overallScore) {
            latestScore = score;
            break;
          }
        }
      }

      res.json({
        organization: org,
        assessments: orgAssessments,
        actions: orgActions,
        documents: orgDocuments,
        latestScore,
      });
    } catch (error) {
      console.error("Get organization error:", error);
      res.status(500).json({ message: "Failed to load organization" });
    }
  });

  app.delete("/api/organizations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { id } = req.params;
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ message: "Organization not found" });
      }
      const userOrgs = await storage.getOrganizations(userId);
      const canAccess = userOrgs.some(o => o.id === id);
      if (!canAccess) {
        return res.status(403).json({ message: "You do not have permission to delete this organization" });
      }
      await storage.deleteOrganization(id);
      res.json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Delete organization error:", error);
      res.status(500).json({ message: "Failed to delete organization" });
    }
  });

  app.post("/api/organizations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validationResult = createOrganizationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const org = await storage.createOrganization(validationResult.data, userId);
      res.json(org);
    } catch (error) {
      console.error("Create organization error:", error);
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  // Assessments
  app.get("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const allAssessments = await storage.getAssessments(userId);
      
      // Add org names and scores
      const result = await Promise.all(
        allAssessments.map(async (assessment) => {
          const org = await storage.getOrganization(assessment.organizationId);
          const score = await storage.getLatestScoreSnapshot(assessment.id);
          return {
            ...assessment,
            organizationName: org?.name || "Unknown",
            score,
          };
        })
      );

      res.json(result);
    } catch (error) {
      console.error("Get assessments error:", error);
      res.status(500).json({ message: "Failed to load assessments" });
    }
  });

  app.get("/api/assessments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const allQuestions = await storage.getQuestions();
      const allResponses = await storage.getResponsesByAssessment(id);
      const scoreSnapshot = await storage.getLatestScoreSnapshot(id);
      const org = await storage.getOrganization(assessment.organizationId);

      // Convert responses to map
      const responseMap: Record<string, any> = {};
      allResponses.forEach((r) => {
        responseMap[r.questionId] = r;
      });

      res.json({
        assessment,
        questions: allQuestions,
        responses: responseMap,
        scoreSnapshot,
        organizationName: org?.name || "Unknown",
      });
    } catch (error) {
      console.error("Get assessment error:", error);
      res.status(500).json({ message: "Failed to load assessment" });
    }
  });

  app.post("/api/assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validationResult = createAssessmentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const assessment = await storage.createAssessment({
        ...validationResult.data,
        createdByUserId: userId,
      });
      res.json(assessment);
    } catch (error) {
      console.error("Create assessment error:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.post("/api/assessments/:id/responses", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validationResult = createResponseSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const { questionId, responseValue, constraintApplied } = validationResult.data;

      const response = await storage.upsertResponse({
        assessmentId: id,
        questionId,
        responseValue,
        responseScoredValue: responseValue,
        questionScore: "0",
        constraintApplied: constraintApplied || false,
      });

      // Recalculate scores
      await storage.calculateAndSaveScores(id);

      res.json(response);
    } catch (error) {
      console.error("Save response error:", error);
      res.status(500).json({ message: "Failed to save response" });
    }
  });

  app.post("/api/assessments/:id/submit", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Verify all questions answered
      const allQuestions = await storage.getQuestions();
      const allResponses = await storage.getResponsesByAssessment(id);
      
      if (allResponses.length < allQuestions.length) {
        return res.status(400).json({ message: "All questions must be answered before submitting" });
      }

      const assessment = await storage.updateAssessmentStatus(id, "SUBMITTED");
      await storage.calculateAndSaveScores(id);
      
      res.json(assessment);
    } catch (error) {
      console.error("Submit assessment error:", error);
      res.status(500).json({ message: "Failed to submit assessment" });
    }
  });

  // Subcontractor
  app.get("/api/assessments/:id/subcontractor", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const response = await storage.getSubcontractorResponse(id);
      const assessment = await storage.getAssessment(id);
      const org = assessment ? await storage.getOrganization(assessment.organizationId) : null;

      res.json({
        response,
        assessmentId: id,
        organizationName: org?.name || "Unknown",
      });
    } catch (error) {
      console.error("Get subcontractor error:", error);
      res.status(500).json({ message: "Failed to load subcontractor data" });
    }
  });

  app.post("/api/assessments/:id/subcontractor", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validationResult = subcontractorSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const response = await storage.upsertSubcontractorResponse({
        assessmentId: id,
        ...validationResult.data,
      });

      // Recalculate scores
      await storage.calculateAndSaveScores(id);

      res.json(response);
    } catch (error) {
      console.error("Save subcontractor error:", error);
      res.status(500).json({ message: "Failed to save subcontractor data" });
    }
  });

  // Action Items
  app.get("/api/actions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const allActions = await storage.getActionItems(userId);
      
      // Add org names
      const result = await Promise.all(
        allActions.map(async (action) => {
          const org = await storage.getOrganization(action.organizationId);
          return {
            ...action,
            organizationName: org?.name || "Unknown",
          };
        })
      );

      res.json(result);
    } catch (error) {
      console.error("Get actions error:", error);
      res.status(500).json({ message: "Failed to load actions" });
    }
  });

  app.post("/api/actions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validationResult = createActionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const action = await storage.createActionItem({
        ...validationResult.data,
        createdByUserId: userId,
      });
      res.json(action);
    } catch (error) {
      console.error("Create action error:", error);
      res.status(500).json({ message: "Failed to create action" });
    }
  });

  app.patch("/api/actions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const validationResult = updateActionStatusSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const { status } = validationResult.data;
      const action = await storage.updateActionItemStatus(id, status);
      res.json(action);
    } catch (error) {
      console.error("Update action error:", error);
      res.status(500).json({ message: "Failed to update action" });
    }
  });

  // Comments
  app.get("/api/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const allComments = await storage.getComments(userId);
      
      // Add author names and org names
      const result = await Promise.all(
        allComments.map(async (comment) => {
          const org = await storage.getOrganization(comment.organizationId);
          const [author] = await db.select().from(users).where(eq(users.id, comment.authorUserId));
          return {
            ...comment,
            organizationName: org?.name || "Unknown",
            authorName: author?.firstName ? `${author.firstName} ${author.lastName || ""}`.trim() : author?.email || "Unknown",
            authorImage: author?.profileImageUrl || null,
          };
        })
      );

      res.json(result);
    } catch (error) {
      console.error("Get comments error:", error);
      res.status(500).json({ message: "Failed to load comments" });
    }
  });

  app.post("/api/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const validationResult = createCommentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }
      const comment = await storage.createComment({
        ...validationResult.data,
        authorUserId: userId,
      });
      res.json(comment);
    } catch (error) {
      console.error("Create comment error:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Documents
  app.get("/api/documents", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const allDocuments = await storage.getDocuments(userId);
      
      // Add org names
      const result = await Promise.all(
        allDocuments.map(async (doc) => {
          const org = await storage.getOrganization(doc.organizationId);
          return {
            ...doc,
            organizationName: org?.name || "Unknown",
          };
        })
      );

      res.json(result);
    } catch (error) {
      console.error("Get documents error:", error);
      res.status(500).json({ message: "Failed to load documents" });
    }
  });

  app.post("/api/documents", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const documentSchema = z.object({
        organizationId: z.string().min(1, "Organization ID is required"),
        category: z.enum(["SAFETY_PROGRAM", "TRAINING", "COI", "OSHA_LOG", "INCIDENT_REPORT", "OTHER"]).optional().default("OTHER"),
      });

      const validationResult = documentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationResult.error.errors 
        });
      }

      const doc = await storage.createDocument({
        organizationId: validationResult.data.organizationId,
        uploadedByUserId: userId,
        filename: file.originalname,
        mimeType: file.mimetype,
        storagePath: file.path,
        category: validationResult.data.category,
      });
      
      res.json(doc);
    } catch (error) {
      console.error("Upload document error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Scoring Test Route - for validation against Excel
  app.get("/dev/scoring-test", async (req, res) => {
    try {
      const responseValues: number[] = [];
      for (let i = 1; i <= 20; i++) {
        const val = parseInt(req.query[`r${i}`] as string);
        if (isNaN(val) || val < 1 || val > 5) {
          return res.status(400).json({ 
            message: `Invalid response for r${i}. Must be 1-5.`,
            usage: "GET /dev/scoring-test?r1=3&r2=4&...&r20=5"
          });
        }
        responseValues.push(val);
      }

      const allQuestions = await storage.getQuestions();
      if (allQuestions.length !== 20) {
        return res.status(500).json({ message: "Questions not properly seeded" });
      }

      const totalWeight = allQuestions.reduce((sum, q) => sum + Number(q.weight), 0);
      let totalScore = 0;
      const pillarPts: Record<string, number> = { Safety: 0, WorkersComp: 0, Fleet: 0 };
      const details: any[] = [];

      allQuestions.forEach((q, i) => {
        const raw = responseValues[i];
        const scored = raw;
        const weight = Number(q.weight);
        const questionScore = calculateQuestionScore(scored, weight);
        
        totalScore += questionScore;
        pillarPts[q.pillar] = (pillarPts[q.pillar] || 0) + questionScore;

        details.push({
          questionId: q.id,
          pillar: q.pillar,
          raw,
          scored,
          weight,
          questionScore: questionScore.toFixed(6),
          constraintApplied: false,
          capValue: null,
        });
      });

      const overallRating = getRatingFromScore(totalScore);

      res.json({
        totalScore: totalScore.toFixed(3),
        overallRating,
        weightsSum: totalWeight.toFixed(4),
        pillarSubtotals: {
          safety: pillarPts.Safety.toFixed(3),
          workersComp: pillarPts.WorkersComp.toFixed(3),
          fleet: pillarPts.Fleet.toFixed(3),
        },
        pillarSubtotalsSum: (pillarPts.Safety + pillarPts.WorkersComp + pillarPts.Fleet).toFixed(3),
        formula: {
          description: "TotalScore = SUM(scored * weight); PillarSubtotal = SUM(question_score) per pillar; PillarSubtotals sum to TotalScore",
        },
        details,
      });
    } catch (error) {
      console.error("Scoring test error:", error);
      res.status(500).json({ message: "Failed to calculate scores" });
    }
  });

  // Scoring Debug Route - detailed scoring for an assessment
  app.get("/api/assessments/:id/scoring-debug", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const allResponses = await storage.getResponsesByAssessment(id);
      const allQuestions = await storage.getQuestions();
      const questionMap = new Map(allQuestions.map(q => [q.id, q]));

      const pillarPts: Record<string, number> = { Safety: 0, WorkersComp: 0, Fleet: 0 };
      const topicPts: Record<string, number> = {};
      let totalScore = 0;

      const details = allResponses.map(r => {
        const q = questionMap.get(r.questionId);
        const qScore = Number(r.questionScore);
        totalScore += qScore;
        const pillar = r.pillar || q?.pillar || "";
        if (pillar in pillarPts) {
          pillarPts[pillar] = (pillarPts[pillar] || 0) + qScore;
        }
        const topicKey = `${pillar}|${r.topic || q?.topic || ""}`;
        topicPts[topicKey] = (topicPts[topicKey] || 0) + qScore;

        return {
          questionId: r.questionId,
          raw: r.responseValue,
          scored: r.responseScoredValue,
          weight: Number(r.weight || q?.weight),
          questionScore: qScore.toFixed(6),
          constraintApplied: r.constraintApplied,
          capValue: r.constraintCapValue,
        };
      });

      res.json({
        totalScore: totalScore.toFixed(3),
        overallRating: getRatingFromScore(totalScore),
        pillarSubtotals: pillarPts,
        topicSubtotals: topicPts,
        details,
      });
    } catch (error) {
      console.error("Scoring debug error:", error);
      res.status(500).json({ message: "Failed to get scoring debug" });
    }
  });

  // Export PDF placeholder
  app.get("/api/assessments/:id/export-pdf", isAuthenticated, async (req: any, res) => {
    res.status(501).json({ 
      message: "PDF export not implemented in MVP",
      assessmentId: req.params.id 
    });
  });

  return httpServer;
}
