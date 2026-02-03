import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: string;
  className?: string;
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  const getVariant = () => {
    switch (rating) {
      case "High Risk":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "Elevated Risk":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "Moderate Risk":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Strong / Low Risk":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", getVariant(), className)}
      data-testid={`badge-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '')}`}
    >
      {rating}
    </Badge>
  );
}
