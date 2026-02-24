import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Filter,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Plus,
  Upload,
  FileText,
  Download,
  Paperclip,
  Loader2,
} from "lucide-react";
import type { ActionItem, Document as DocRecord } from "@shared/schema";

interface ActionWithOrg extends ActionItem {
  organizationName: string;
}

interface OrgGroup {
  organizationId: string;
  organizationName: string;
  actions: ActionWithOrg[];
  total: number;
  open: number;
  inProgress: number;
  done: number;
  completionPct: number;
}

export default function ActionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: actions, isLoading } = useQuery<ActionWithOrg[]>({
    queryKey: ["/api/actions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      actionId,
      status,
    }: {
      actionId: string;
      status: string;
    }) => {
      await apiRequest("PATCH", `/api/actions/${actionId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/actions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Status updated",
        description: "Action item status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredActions = actions?.filter((action) => {
    const matchesSearch =
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.organizationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orgGroups: OrgGroup[] = (() => {
    if (!filteredActions) return [];
    const map = new Map<string, ActionWithOrg[]>();
    filteredActions.forEach((a) => {
      if (!map.has(a.organizationId)) map.set(a.organizationId, []);
      map.get(a.organizationId)!.push(a);
    });
    return Array.from(map.entries())
      .map(([orgId, orgActions]) => {
        const total = orgActions.length;
        const open = orgActions.filter((a) => a.status === "OPEN").length;
        const inProgress = orgActions.filter((a) => a.status === "IN_PROGRESS").length;
        const done = orgActions.filter((a) => a.status === "DONE").length;
        const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;
        return {
          organizationId: orgId,
          organizationName: orgActions[0].organizationName,
          actions: orgActions,
          total,
          open,
          inProgress,
          done,
          completionPct,
        };
      })
      .sort((a, b) => {
        if (a.completionPct === 100 && b.completionPct !== 100) return 1;
        if (a.completionPct !== 100 && b.completionPct === 100) return -1;
        return a.completionPct - b.completionPct;
      });
  })();

  const toggleOrg = (orgId: string) => {
    setExpandedOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(orgId)) next.delete(orgId);
      else next.add(orgId);
      return next;
    });
  };

  const totalActions = filteredActions?.length || 0;
  const totalOpen = filteredActions?.filter((a) => a.status === "OPEN").length || 0;
  const totalInProgress = filteredActions?.filter((a) => a.status === "IN_PROGRESS").length || 0;
  const totalDone = filteredActions?.filter((a) => a.status === "DONE").length || 0;
  const overallCompletion = totalActions > 0 ? Math.round((totalDone / totalActions) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-actions-title">Action Items Dashboard</h1>
          <p className="text-muted-foreground">
            Track risk mitigation progress across all organizations
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-stat-total">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalActions}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-open">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalOpen}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-in-progress">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalInProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-stat-done">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDone}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalActions > 0 && (
        <Card data-testid="card-overall-progress">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm font-bold" data-testid="text-overall-completion">{overallCompletion}%</span>
            </div>
            <Progress value={overallCompletion} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-actions"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orgGroups.length > 0 ? (
        <div className="space-y-4">
          {orgGroups.map((group) => {
            const isExpanded = expandedOrgs.has(group.organizationId);
            return (
              <Card key={group.organizationId} data-testid={`card-org-group-${group.organizationId}`}>
                <button
                  type="button"
                  className="w-full text-left p-4 cursor-pointer rounded-t-lg hover-elevate transition-all"
                  onClick={() => toggleOrg(group.organizationId)}
                  data-testid={`button-toggle-org-${group.organizationId}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate" data-testid={`text-org-name-${group.organizationId}`}>
                          {group.organizationName}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{group.total} item{group.total !== 1 ? "s" : ""}</span>
                          {group.open > 0 && (
                            <span className="text-red-600 dark:text-red-400">{group.open} open</span>
                          )}
                          {group.inProgress > 0 && (
                            <span className="text-amber-600 dark:text-amber-400">{group.inProgress} in progress</span>
                          )}
                          {group.done > 0 && (
                            <span className="text-green-600 dark:text-green-400">{group.done} done</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
                        <Progress value={group.completionPct} className="h-2 flex-1" />
                        <span
                          className={`text-sm font-semibold min-w-[40px] text-right ${
                            group.completionPct === 100
                              ? "text-green-600 dark:text-green-400"
                              : group.completionPct >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                          data-testid={`text-completion-${group.organizationId}`}
                        >
                          {group.completionPct}%
                        </span>
                      </div>
                      <div className="sm:hidden">
                        <span
                          className={`text-sm font-semibold ${
                            group.completionPct === 100
                              ? "text-green-600 dark:text-green-400"
                              : group.completionPct >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {group.completionPct}%
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    <div className="divide-y">
                      {group.actions.map((action) => (
                        <ActionItemRow
                          key={action.id}
                          action={action}
                          getStatusIcon={getStatusIcon}
                          updateStatusMutation={updateStatusMutation}
                        />
                      ))}
                    </div>
                    <div className="p-3 border-t bg-muted/30">
                      <Link href={`/organizations/${group.organizationId}/actions/new`}>
                        <Button variant="ghost" size="sm" className="gap-2 w-full" data-testid={`button-add-action-${group.organizationId}`}>
                          <Plus className="h-3.5 w-3.5" />
                          Add Action Item
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-no-actions">No action items found</h3>
            <p className="text-muted-foreground text-center">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Action items will appear here when created from organization assessments"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActionItemRow({
  action,
  getStatusIcon,
  updateStatusMutation,
}: {
  action: ActionWithOrg;
  getStatusIcon: (status: string) => JSX.Element;
  updateStatusMutation: any;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDocs, setShowDocs] = useState(false);

  const { data: docs } = useQuery<DocRecord[]>({
    queryKey: ["/api/actions", action.id, "documents"],
    enabled: showDocs,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/actions/${action.id}/documents`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/actions", action.id, "documents"] });
      toast({ title: "Uploaded", description: "Document uploaded successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload document.", variant: "destructive" });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
      e.target.value = "";
    }
  };

  return (
    <div
      className="p-4 space-y-3"
      data-testid={`card-action-${action.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {getStatusIcon(action.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-sm" data-testid={`text-action-title-${action.id}`}>{action.title}</p>
              {action.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {action.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  {action.dueDate
                    ? `Due: ${new Date(action.dueDate).toLocaleDateString()}`
                    : `Created: ${new Date(action.createdAt!).toLocaleDateString()}`}
                </span>
                <button
                  type="button"
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                  onClick={() => setShowDocs(!showDocs)}
                  data-testid={`button-toggle-docs-${action.id}`}
                >
                  <Paperclip className="h-3 w-3" />
                  {showDocs ? "Hide docs" : "Proof docs"}
                  {docs && docs.length > 0 && (
                    <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0 text-xs font-medium">
                      {docs.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={action.status} />
              {action.status === "OPEN" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatusMutation.mutate({
                      actionId: action.id,
                      status: "IN_PROGRESS",
                    });
                  }}
                  disabled={updateStatusMutation.isPending}
                  data-testid={`button-start-${action.id}`}
                >
                  Start
                </Button>
              )}
              {action.status === "IN_PROGRESS" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatusMutation.mutate({
                      actionId: action.id,
                      status: "DONE",
                    });
                  }}
                  disabled={updateStatusMutation.isPending}
                  data-testid={`button-complete-${action.id}`}
                >
                  Complete
                </Button>
              )}
              {action.status === "DONE" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatusMutation.mutate({
                      actionId: action.id,
                      status: "OPEN",
                    });
                  }}
                  disabled={updateStatusMutation.isPending}
                  data-testid={`button-reopen-${action.id}`}
                >
                  Reopen
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDocs && (
        <div className="ml-7 space-y-2" data-testid={`section-docs-${action.id}`}>
          {docs && docs.length > 0 && (
            <div className="space-y-1">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50 text-sm"
                  data-testid={`doc-item-${doc.id}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{doc.filename}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(doc.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="flex-shrink-0"
                    data-testid={`button-download-${doc.id}`}
                  >
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}
          {(!docs || docs.length === 0) && (
            <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
          )}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              data-testid={`input-file-${action.id}`}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              data-testid={`button-upload-doc-${action.id}`}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Upload Proof Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
