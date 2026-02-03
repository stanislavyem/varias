import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreCard } from "@/components/score-card";
import { RatingBadge } from "@/components/rating-badge";
import { StatusBadge } from "@/components/status-badge";
import { PillarProgress } from "@/components/pillar-progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft,
  Building2,
  ClipboardList,
  Plus,
  AlertTriangle,
  TrendingUp,
  Shield,
  FileText,
  CheckCircle2,
} from "lucide-react";
import type { Organization, Assessment, ActionItem, ScoreSnapshot, Document } from "@shared/schema";

interface OrganizationDetail {
  organization: Organization;
  assessments: Assessment[];
  actions: ActionItem[];
  documents: Document[];
  latestScore: ScoreSnapshot | null;
}

export default function OrganizationDetailPage() {
  const [, params] = useRoute("/organizations/:id");
  const orgId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<OrganizationDetail>({
    queryKey: ["/api/organizations", orgId],
    enabled: !!orgId,
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/assessments", {
        organizationId: orgId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations", orgId] });
      toast({
        title: "Assessment created",
        description: "You can now begin the risk assessment.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Organization not found</h2>
        <Link href="/organizations">
          <Button variant="outline">Back to Organizations</Button>
        </Link>
      </div>
    );
  }

  const { organization, assessments, actions, documents, latestScore } = data;
  const openActions = actions.filter((a) => a.status !== "DONE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/organizations">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
            <p className="text-muted-foreground">
              {organization.industry || "No industry specified"}
              {organization.naicsCode && ` • NAICS: ${organization.naicsCode}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/organizations/${orgId}/actions/new`}>
            <Button variant="outline" className="gap-2" data-testid="button-new-action">
              <Plus className="h-4 w-4" />
              Action Item
            </Button>
          </Link>
          <Button
            onClick={() => createAssessmentMutation.mutate()}
            disabled={createAssessmentMutation.isPending}
            className="gap-2"
            data-testid="button-new-assessment"
          >
            <ClipboardList className="h-4 w-4" />
            New Assessment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          title="Overall Score"
          value={
            latestScore?.overallScore
              ? Number(latestScore.overallScore).toFixed(1)
              : null
          }
          icon={TrendingUp}
          subtitle={latestScore?.overallRating || "No assessment"}
        />
        <ScoreCard
          title="Assessments"
          value={assessments.length}
          icon={ClipboardList}
          subtitle={`${assessments.filter((a) => a.status === "DRAFT").length} in progress`}
        />
        <ScoreCard
          title="Open Actions"
          value={openActions}
          icon={AlertTriangle}
          subtitle="Requiring attention"
        />
        <ScoreCard
          title="Documents"
          value={documents.length}
          icon={FileText}
          subtitle="Uploaded files"
        />
      </div>

      {latestScore && latestScore.overallScore && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>Latest Assessment Score</CardTitle>
              {latestScore.overallRating && (
                <RatingBadge rating={latestScore.overallRating} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <PillarProgress
                label="Safety Pillar"
                value={latestScore.safetyScore ? Number(latestScore.safetyScore) : null}
              />
              <PillarProgress
                label="Workers' Comp Pillar"
                value={latestScore.workersCompScore ? Number(latestScore.workersCompScore) : null}
              />
              <PillarProgress
                label="Fleet Pillar"
                value={latestScore.fleetScore ? Number(latestScore.fleetScore) : null}
              />
            </div>
            {latestScore.guardrailTriggered && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Guardrail Triggered</span>
                <span className="text-sm opacity-80">
                  - Subcontractor insurance verification score is below threshold
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="assessments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assessments" data-testid="tab-assessments">
            Assessments ({assessments.length})
          </TabsTrigger>
          <TabsTrigger value="actions" data-testid="tab-actions">
            Actions ({actions.length})
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-4">
          {assessments.length > 0 ? (
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
                  <Card className="hover-elevate cursor-pointer" data-testid={`card-assessment-${assessment.id}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Assessment #{assessment.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created{" "}
                            {new Date(assessment.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={assessment.status} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No assessments yet</p>
                <Button
                  onClick={() => createAssessmentMutation.mutate()}
                  disabled={createAssessmentMutation.isPending}
                  data-testid="button-start-first-assessment"
                >
                  Start First Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          {actions.length > 0 ? (
            <div className="space-y-3">
              {actions.map((action) => (
                <Card key={action.id} data-testid={`card-action-${action.id}`}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {action.status === "DONE" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        {action.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {action.description}
                          </p>
                        )}
                        {action.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {new Date(action.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={action.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No action items</p>
                <Link href={`/organizations/${orgId}/actions/new`}>
                  <Button variant="outline" data-testid="button-add-first-action">
                    Add Action Item
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Card key={doc.id} data-testid={`card-document-${doc.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.category.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">No documents uploaded</p>
                <Link href={`/documents?org=${orgId}`}>
                  <Button variant="outline" data-testid="button-upload-document">
                    Upload Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
