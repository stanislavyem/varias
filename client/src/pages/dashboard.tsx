import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreCard } from "@/components/score-card";
import { RatingBadge } from "@/components/rating-badge";
import { StatusBadge } from "@/components/status-badge";
import { PillarProgress } from "@/components/pillar-progress";
import { 
  Building2, 
  ClipboardList, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  FileCheck
} from "lucide-react";
import { Link } from "wouter";
import type { Organization, ActionItem, ScoreSnapshot } from "@shared/schema";

interface OrganizationWithScore extends Organization {
  latestScore: string | null;
  latestRating: string | null;
}

interface RecentAssessment {
  id: string;
  organizationId: string;
  status: string;
  createdAt: string;
  submittedAt: string | null;
  organizationName: string;
  score: { overallScore: string | null; overallRating: string | null } | null;
}

interface DashboardData {
  organizations: OrganizationWithScore[];
  recentActions: (ActionItem & { organizationName: string })[];
  recentAssessments: RecentAssessment[];
  latestScores: (ScoreSnapshot & { organizationName: string })[];
  stats: {
    totalOrganizations: number;
    activeAssessments: number;
    completedAssessments: number;
    openActions: number;
    avgScore: number | null;
  };
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalOrganizations: 0,
    activeAssessments: 0,
    completedAssessments: 0,
    openActions: 0,
    avgScore: null,
  };

  const completedAssessments = data?.recentAssessments?.filter(
    a => a.status === "SUBMITTED" || a.status === "CLOSED"
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your risk assessment portfolio
          </p>
        </div>
        <Link href="/organizations/new">
          <Button className="gap-2" data-testid="button-new-organization">
            <Plus className="h-4 w-4" />
            New Organization
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          title="Organizations"
          value={stats.totalOrganizations}
          icon={Building2}
          subtitle="Total accounts"
        />
        <ScoreCard
          title="Active Assessments"
          value={stats.activeAssessments}
          icon={ClipboardList}
          subtitle="In progress"
        />
        <ScoreCard
          title="Completed"
          value={stats.completedAssessments}
          icon={FileCheck}
          subtitle="Submitted assessments"
        />
        <ScoreCard
          title="Avg. Risk Score"
          value={stats.avgScore !== null ? stats.avgScore.toFixed(0) : null}
          icon={TrendingUp}
          subtitle="0 - 100 scale"
        />
      </div>

      {completedAssessments.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Completed Assessments</CardTitle>
              <CardDescription>Submitted and finalized risk assessments</CardDescription>
            </div>
            <Link href="/assessments">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-assessments">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedAssessments.slice(0, 6).map((assessment) => (
                <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border" data-testid={`card-completed-assessment-${assessment.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{assessment.organizationName}</p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.submittedAt
                            ? `Submitted ${new Date(assessment.submittedAt).toLocaleDateString()}`
                            : `Created ${new Date(assessment.createdAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {assessment.score?.overallScore ? (
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-lg font-bold" data-testid={`text-score-${assessment.id}`}>
                              {Number(assessment.score.overallScore).toFixed(0)}
                            </p>
                            <p className="text-xs text-muted-foreground">/ 100</p>
                          </div>
                          {assessment.score.overallRating && (
                            <RatingBadge rating={assessment.score.overallRating} />
                          )}
                        </div>
                      ) : (
                        <StatusBadge status={assessment.status as any} />
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Recent Organizations</CardTitle>
              <CardDescription>Your latest insured accounts</CardDescription>
            </div>
            <Link href="/organizations">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-organizations">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.organizations && data.organizations.length > 0 ? (
              <div className="space-y-4">
                {data.organizations.slice(0, 5).map((org) => (
                  <Link key={org.id} href={`/organizations/${org.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover-elevate cursor-pointer border" data-testid={`card-organization-${org.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.industry || "No industry specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {org.latestScore !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-lg font-bold">{Number(org.latestScore).toFixed(0)}</p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                            {org.latestRating && (
                              <RatingBadge rating={org.latestRating} />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No assessment</span>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No organizations yet</p>
                <Link href="/organizations/new">
                  <Button variant="outline" className="mt-4" data-testid="button-add-first-organization">
                    Add your first organization
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Tasks requiring attention</CardDescription>
            </div>
            <Link href="/actions">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-actions">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentActions && data.recentActions.length > 0 ? (
              <div className="space-y-4">
                {data.recentActions.slice(0, 5).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border"
                    data-testid={`card-action-${action.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center mt-0.5">
                        {action.status === "DONE" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : action.status === "IN_PROGRESS" ? (
                          <Clock className="h-4 w-4 text-amber-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.organizationName}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={action.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No action items</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {data?.latestScores && data.latestScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Assessment Scores</CardTitle>
            <CardDescription>Recent risk assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.latestScores.slice(0, 6).map((score) => (
                <Card key={score.id} className="hover-elevate" data-testid={`card-score-${score.id}`}>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{score.organizationName}</p>
                      {score.overallRating && (
                        <RatingBadge rating={score.overallRating} />
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {score.overallScore ? Number(score.overallScore).toFixed(0) : "\u2014"}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <div className="space-y-3">
                      <PillarProgress
                        label="Safety"
                        value={score.safetyScore ? Number(score.safetyScore) : null}
                        maxValue={100}
                      />
                      <PillarProgress
                        label="Workers' Comp"
                        value={score.workersCompScore ? Number(score.workersCompScore) : null}
                        maxValue={100}
                      />
                      <PillarProgress
                        label="Fleet"
                        value={score.fleetScore ? Number(score.fleetScore) : null}
                        maxValue={100}
                      />
                    </div>
                    {score.guardrailTriggered && (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm">
                        <Shield className="h-4 w-4" />
                        <span>Guardrail Triggered</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
