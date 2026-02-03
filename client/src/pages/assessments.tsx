import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { RatingBadge } from "@/components/rating-badge";
import { Link } from "wouter";
import {
  Search,
  ClipboardList,
  Filter,
  Building2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { Assessment, ScoreSnapshot } from "@shared/schema";

interface AssessmentWithDetails extends Assessment {
  organizationName: string;
  score: ScoreSnapshot | null;
}

export default function AssessmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: assessments, isLoading } = useQuery<AssessmentWithDetails[]>({
    queryKey: ["/api/assessments"],
  });

  const filteredAssessments = assessments?.filter((assessment) => {
    const matchesSearch = assessment.organizationName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          View and manage risk assessments across all organizations
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-assessments"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAssessments && filteredAssessments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => (
            <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
              <Card className="hover-elevate cursor-pointer" data-testid={`card-assessment-${assessment.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            Assessment #{assessment.id.slice(0, 8)}
                          </h3>
                          <StatusBadge status={assessment.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{assessment.organizationName}</span>
                          <span>•</span>
                          <span>
                            {new Date(assessment.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {assessment.score?.overallScore && (
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-2xl font-bold">
                              {Number(assessment.score.overallScore).toFixed(1)}
                            </span>
                          </div>
                          {assessment.score.overallRating && (
                            <RatingBadge
                              rating={assessment.score.overallRating}
                              className="mt-1"
                            />
                          )}
                        </div>
                      )}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Assessments will appear here when created from organization pages"}
            </p>
            <Link href="/organizations">
              <Button variant="outline" data-testid="button-go-to-organizations">
                Go to Organizations
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
