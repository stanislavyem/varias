import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ActionStatus = "OPEN" | "IN_PROGRESS" | "DONE";
type AssessmentStatus = "DRAFT" | "SUBMITTED" | "CLOSED";

interface StatusBadgeProps {
  status: ActionStatus | AssessmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "OPEN":
      case "DRAFT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "IN_PROGRESS":
      case "SUBMITTED":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "DONE":
      case "CLOSED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", getVariant(), className)}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      {getLabel()}
    </Badge>
  );
}
