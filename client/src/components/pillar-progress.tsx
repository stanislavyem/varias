import { cn } from "@/lib/utils";

interface PillarProgressProps {
  label: string;
  value: number | null | undefined;
  className?: string;
}

export function PillarProgress({ label, value, className }: PillarProgressProps) {
  const displayValue = value ?? 0;
  
  const getColor = () => {
    if (displayValue >= 85) return "bg-green-500";
    if (displayValue >= 70) return "bg-amber-500";
    if (displayValue >= 55) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value !== null && value !== undefined ? `${value.toFixed(1)}%` : "—"}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${Math.min(100, displayValue)}%` }}
        />
      </div>
    </div>
  );
}
