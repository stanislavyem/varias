import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RatingBadge } from "@/components/rating-badge";
import { PillarProgress } from "@/components/pillar-progress";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Info,
  Shield,
  CheckCircle2,
  Send,
  HardHat,
  Truck,
  Users,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import type { Assessment, Question, Response, ScoreSnapshot } from "@shared/schema";
import { parseConstraints } from "@shared/schema";

interface AssessmentDetail {
  assessment: Assessment;
  questions: Question[];
  responses: Record<string, Response>;
  scoreSnapshot: ScoreSnapshot | null;
  organizationName: string;
}

const pillarIcons: Record<string, typeof Shield> = {
  Safety: HardHat,
  WorkersComp: Users,
  Fleet: Truck,
};

export default function AssessmentPage() {
  const [, params] = useRoute("/assessments/:id");
  const assessmentId = params?.id;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localResponses, setLocalResponses] = useState<Record<string, number>>({});
  const [localConstraints, setLocalConstraints] = useState<Record<string, boolean>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const notesTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data, isLoading, error } = useQuery<AssessmentDetail>({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!assessmentId,
  });

  useEffect(() => {
    if (data?.responses) {
      const existing: Record<string, number> = {};
      const existingConstraints: Record<string, boolean> = {};
      Object.entries(data.responses).forEach(([qId, resp]) => {
        existing[qId] = resp.responseValue;
        existingConstraints[qId] = resp.constraintApplied || false;
      });
      setLocalResponses(existing);
      setLocalConstraints(existingConstraints);
    }
  }, [data?.responses]);

  useEffect(() => {
    if (data?.assessment?.notes) {
      try {
        const parsed = JSON.parse(data.assessment.notes);
        if (typeof parsed === "object" && parsed !== null) {
          setLocalNotes(parsed);
        }
      } catch {}
    }
  }, [data?.assessment?.notes]);

  const saveQuestionNotes = useCallback(async (questionId: string, notes: string) => {
    try {
      await apiRequest("PATCH", `/api/assessments/${assessmentId}/notes`, { questionId, notes });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    }
  }, [assessmentId, toast]);

  const handleQuestionNotesChange = useCallback((questionId: string, value: string) => {
    setLocalNotes((prev) => ({ ...prev, [questionId]: value }));
    if (notesTimersRef.current[questionId]) clearTimeout(notesTimersRef.current[questionId]);
    notesTimersRef.current[questionId] = setTimeout(() => saveQuestionNotes(questionId, value), 800);
  }, [saveQuestionNotes]);

  useEffect(() => {
    return () => {
      Object.values(notesTimersRef.current).forEach(clearTimeout);
    };
  }, []);

  const saveResponseMutation = useMutation({
    mutationFn: async ({
      questionId,
      value,
      constraintApplied,
    }: {
      questionId: string;
      value: number;
      constraintApplied: boolean;
    }) => {
      await apiRequest("POST", `/api/assessments/${assessmentId}/responses`, {
        questionId,
        responseValue: value,
        constraintApplied,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/assessments/${assessmentId}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments", assessmentId] });
      toast({
        title: "Assessment submitted",
        description: "The assessment has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please ensure all questions are answered.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/assessments/${assessmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Assessment deleted",
        description: "The assessment has been permanently removed.",
      });
      navigate(`/organizations/${data?.assessment.organizationId || ""}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleResponseChange = (questionId: string, value: number) => {
    setLocalResponses((prev) => ({ ...prev, [questionId]: value }));
    const constraintApplied = localConstraints[questionId] || false;
    saveResponseMutation.mutate({ questionId, value, constraintApplied });
  };

  const handleConstraintToggle = (questionId: string, checked: boolean) => {
    setLocalConstraints((prev) => ({ ...prev, [questionId]: checked }));
    const value = localResponses[questionId];
    if (value !== undefined) {
      saveResponseMutation.mutate({ questionId, value, constraintApplied: checked });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <Shield className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Assessment not found</h2>
        <Link href="/assessments">
          <Button variant="outline">Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  const { assessment, questions, scoreSnapshot, organizationName } = data;
  const answeredCount = Object.keys(localResponses).length;
  const totalQuestions = questions.length;
  const completionPct = (answeredCount / totalQuestions) * 100;
  const isComplete = answeredCount === totalQuestions;
  const isSubmitted = assessment.status !== "DRAFT";

  const groupedQuestions = questions.reduce(
    (acc, q) => {
      if (!acc[q.pillar]) {
        acc[q.pillar] = {};
      }
      if (!acc[q.pillar][q.topic]) {
        acc[q.pillar][q.topic] = [];
      }
      acc[q.pillar][q.topic].push(q);
      return acc;
    },
    {} as Record<string, Record<string, Question[]>>
  );

  const pillarOrder = ["Safety", "WorkersComp", "Fleet"];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href={`/organizations/${assessment.organizationId}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Risk Assessment</h1>
            <p className="text-muted-foreground">{organizationName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={assessment.status} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            data-testid="button-delete-assessment"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          {!isSubmitted && isComplete && (
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="gap-2"
              data-testid="button-submit-assessment"
            >
              <Send className="h-4 w-4" />
              Submit Assessment
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Progress</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {answeredCount} of {totalQuestions} questions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completionPct} className="h-2" />
            </CardContent>
          </Card>

          {pillarOrder.map((pillar) => {
            const topics = groupedQuestions[pillar];
            if (!topics) return null;
            const PillarIcon = pillarIcons[pillar] || Shield;

            return (
              <Card key={pillar}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <PillarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>
                        {pillar === "WorkersComp" ? "Workers' Compensation" : pillar} Pillar
                      </CardTitle>
                      <CardDescription>
                        {Object.values(topics).flat().length} questions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(topics).map(([topic, topicQuestions]) => (
                    <div key={topic} className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {topic}
                      </h4>
                      {topicQuestions.map((question) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          value={localResponses[question.id]}
                          constraintApplied={localConstraints[question.id] || false}
                          notes={localNotes[question.id] || ""}
                          onChange={(value) => handleResponseChange(question.id, value)}
                          onConstraintToggle={(checked) => handleConstraintToggle(question.id, checked)}
                          onNotesChange={(value) => handleQuestionNotesChange(question.id, value)}
                          disabled={isSubmitted}
                        />
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <Link href={`/assessments/${assessmentId}/subcontractor`}>
            <Card className="hover-elevate cursor-pointer" data-testid="card-subcontractor-link">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Subcontractor Sub-Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Additional subcontractor risk assessment
                    </p>
                  </div>
                </div>
                <Button variant="outline" data-testid="button-subcontractor">
                  Complete Sub-Score
                </Button>
              </CardContent>
            </Card>
          </Link>

        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Score Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                {isComplete && scoreSnapshot?.overallScore ? (
                  <>
                    <p className="text-5xl font-bold" data-testid="text-overall-score">
                      {Number(scoreSnapshot.overallScore).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Overall Risk Score (0 - 100)</p>
                    {scoreSnapshot.overallRating && (
                      <div className="mt-4">
                        <RatingBadge rating={scoreSnapshot.overallRating} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-medium text-muted-foreground">
                      Incomplete
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Answer all questions to see score
                    </p>
                  </>
                )}
              </div>

              {isComplete && scoreSnapshot?.overallScore && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Pillar Breakdown</h4>
                  <PillarProgress
                    label="Safety"
                    value={
                      scoreSnapshot?.safetyScore
                        ? Number(scoreSnapshot.safetyScore)
                        : null
                    }
                    maxValue={100}
                  />
                  <PillarProgress
                    label="Workers' Comp"
                    value={
                      scoreSnapshot?.workersCompScore
                        ? Number(scoreSnapshot.workersCompScore)
                        : null
                    }
                    maxValue={100}
                  />
                  <PillarProgress
                    label="Fleet"
                    value={
                      scoreSnapshot?.fleetScore
                        ? Number(scoreSnapshot.fleetScore)
                        : null
                    }
                    maxValue={100}
                  />
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    0-100 scale per pillar
                  </div>
                </div>
              )}

              {scoreSnapshot?.guardrailTriggered && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span>Guardrail Triggered</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assessment for {organizationName},
              including all responses and scores. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const PILLAR_WEIGHTS = { Safety: 0.4, WorkersComp: 0.2, Fleet: 0.4 };

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  constraintApplied: boolean;
  notes: string;
  onChange: (value: number) => void;
  onConstraintToggle: (checked: boolean) => void;
  onNotesChange: (value: string) => void;
  disabled: boolean;
}

function QuestionCard({ question, value, constraintApplied, notes, onChange, onConstraintToggle, onNotesChange, disabled }: QuestionCardProps) {
  const hasConstraints = !!question.constraints;
  const parsed = hasConstraints ? parseConstraints(question.constraints) : { caps: [], mins: [] };
  const hasCap = parsed.caps.length > 0;
  const capValue = hasCap ? Math.min(...parsed.caps) : null;

  return (
    <Card data-testid={`question-card-${question.id}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{question.id}</span>
            {value && (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <p className="font-medium" data-testid={`text-question-${question.id}`}>{question.text}</p>
        </div>

        <RadioGroup
          value={value?.toString()}
          onValueChange={(v) => onChange(parseInt(v))}
          disabled={disabled}
          className="flex gap-2"
        >
          {[1, 2, 3, 4, 5].map((score) => (
            <div key={score} className="flex-1 relative">
              <RadioGroupItem
                value={score.toString()}
                id={`${question.id}-${score}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`${question.id}-${score}`}
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
                data-testid={`radio-${question.id}-${score}`}
              >
                <span className="font-semibold">{score}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {hasCap && (
          <div className="flex items-center gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Checkbox
              id={`constraint-${question.id}`}
              checked={constraintApplied}
              onCheckedChange={(checked) => onConstraintToggle(!!checked)}
              disabled={disabled}
              data-testid={`checkbox-constraint-${question.id}`}
            />
            <Label
              htmlFor={`constraint-${question.id}`}
              className="text-sm cursor-pointer flex items-center gap-2"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Apply constraint cap (cap at {capValue})</span>
            </Label>
          </div>
        )}

        <div className="space-y-1">
          <Textarea
            placeholder="Add notes for this question..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            disabled={disabled}
            className="min-h-[60px] resize-y text-sm"
            data-testid={`textarea-notes-${question.id}`}
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          {question.scaleNotes && (
            <AccordionItem value="scale" className="border-none">
              <AccordionTrigger className="text-sm py-2 hover:no-underline" data-testid={`trigger-scale-${question.id}`}>
                <span className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5" />
                  Scoring Scale
                </span>
              </AccordionTrigger>
              <AccordionContent data-testid={`content-scale-${question.id}`}>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {question.scaleNotes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          {question.constraints && (
            <AccordionItem value="constraints" className="border-none">
              <AccordionTrigger className="text-sm py-2 hover:no-underline" data-testid={`trigger-constraints-${question.id}`}>
                <span className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Constraints
                </span>
              </AccordionTrigger>
              <AccordionContent data-testid={`content-constraints-${question.id}`}>
                <div className="text-sm text-muted-foreground">
                  {question.constraints}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
