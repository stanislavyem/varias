import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Filter,
} from "lucide-react";
import type { ActionItem, Organization } from "@shared/schema";

interface ActionWithOrg extends ActionItem {
  organizationName: string;
}

export default function ActionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Action Items</h1>
          <p className="text-muted-foreground">
            Manage risk mitigation tasks across all organizations
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
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
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredActions && filteredActions.length > 0 ? (
        <div className="space-y-4">
          {filteredActions.map((action) => (
            <Card key={action.id} data-testid={`card-action-${action.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(action.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{action.organizationName}</span>
                        </div>
                      </div>
                      <StatusBadge status={action.status} />
                    </div>
                    {action.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {action.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-muted-foreground">
                        {action.dueDate && (
                          <span>
                            Due: {new Date(action.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {!action.dueDate && (
                          <span>
                            Created:{" "}
                            {new Date(action.createdAt!).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {action.status === "OPEN" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                actionId: action.id,
                                status: "IN_PROGRESS",
                              })
                            }
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
                            onClick={() =>
                              updateStatusMutation.mutate({
                                actionId: action.id,
                                status: "DONE",
                              })
                            }
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
                            onClick={() =>
                              updateStatusMutation.mutate({
                                actionId: action.id,
                                status: "OPEN",
                              })
                            }
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No action items found</h3>
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
