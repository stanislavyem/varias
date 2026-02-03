import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Users, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { SubcontractorResponse } from "@shared/schema";

interface SubcontractorData {
  response: SubcontractorResponse | null;
  assessmentId: string;
  organizationName: string;
}

const controls = [
  {
    id: "safetyTraining",
    label: "Safety Training & Oversight",
    description: "Evaluate the subcontractor's safety training programs and oversight procedures",
    weight: 0.3,
  },
  {
    id: "insuranceVerification",
    label: "Ongoing Insurance Verification",
    description: "Assess the frequency and thoroughness of insurance verification processes",
    weight: 0.4,
  },
  {
    id: "coverageContract",
    label: "Coverage & Contract Integrity",
    description: "Review contract terms and coverage adequacy for subcontractor work",
    weight: 0.3,
  },
];

export default function SubcontractorPage() {
  const [, params] = useRoute("/assessments/:id/subcontractor");
  const assessmentId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Record<string, number>>({});

  const { data, isLoading } = useQuery<SubcontractorData>({
    queryKey: ["/api/assessments", assessmentId, "subcontractor"],
    enabled: !!assessmentId,
  });

  useEffect(() => {
    if (data?.response) {
      setScores({
        safetyTraining: data.response.safetyTrainingScore || 0,
        insuranceVerification: data.response.insuranceVerificationScore || 0,
        coverageContract: data.response.coverageContractScore || 0,
      });
    }
  }, [data?.response]);

  const saveMutation = useMutation({
    mutationFn: async (newScores: Record<string, number>) => {
      await apiRequest("POST", `/api/assessments/${assessmentId}/subcontractor`, {
        safetyTrainingScore: newScores.safetyTraining || null,
        insuranceVerificationScore: newScores.insuranceVerification || null,
        coverageContractScore: newScores.coverageContract || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/assessments", assessmentId, "subcontractor"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/assessments", assessmentId],
      });
      toast({
        title: "Saved",
        description: "Subcontractor scores have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save scores. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScoreChange = (controlId: string, value: number) => {
    const newScores = { ...scores, [controlId]: value };
    setScores(newScores);
    saveMutation.mutate(newScores);
  };

  const calculateWeightedAvg = () => {
    const safetyScore = scores.safetyTraining || 0;
    const insuranceScore = scores.insuranceVerification || 0;
    const coverageScore = scores.coverageContract || 0;

    if (!safetyScore && !insuranceScore && !coverageScore) return null;

    return safetyScore * 0.3 + insuranceScore * 0.4 + coverageScore * 0.3;
  };

  const isGuardrailTriggered = (scores.insuranceVerification || 0) <= 2 && scores.insuranceVerification > 0;
  const weightedAvg = calculateWeightedAvg();
  const allAnswered = scores.safetyTraining && scores.insuranceVerification && scores.coverageContract;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/assessments/${assessmentId}`}>
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcontractor Sub-Score</h1>
          <p className="text-muted-foreground">{data?.organizationName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle>Subcontractor Risk Controls</CardTitle>
              <CardDescription>
                Evaluate the following 3 controls on a scale of 1-5
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {controls.map((control) => (
            <div
              key={control.id}
              className="p-4 border rounded-lg space-y-4"
              data-testid={`control-${control.id}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{control.label}</h4>
                  <span className="text-xs text-muted-foreground">
                    Weight: {(control.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {control.description}
                </p>
              </div>

              <RadioGroup
                value={scores[control.id]?.toString() || ""}
                onValueChange={(v) => handleScoreChange(control.id, parseInt(v))}
                className="flex gap-2"
              >
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex-1">
                    <RadioGroupItem
                      value={score.toString()}
                      id={`${control.id}-${score}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`${control.id}-${score}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
                      data-testid={`radio-${control.id}-${score}`}
                    >
                      <span className="font-semibold">{score}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {control.id === "insuranceVerification" && isGuardrailTriggered && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Score of 2 or below triggers the guardrail</span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Score Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <p className="text-sm text-muted-foreground">Weighted Average</p>
              <p className="text-3xl font-bold">
                {weightedAvg !== null ? weightedAvg.toFixed(2) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Scale: 1-5</p>
            </div>
            <div className="text-right">
              {allAnswered ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Complete</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Incomplete</span>
              )}
            </div>
          </div>

          {isGuardrailTriggered && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
              <Shield className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Guardrail Triggered</p>
                <p className="text-sm mt-1">
                  The Insurance Verification score is at or below the threshold (2).
                  This indicates a significant subcontractor risk concern.
                </p>
                {/* FEATURE FLAG: ENABLE_GUARDRAIL_CAPPING
                 * When enabled, this would cap the Safety Pillar Score.
                 * Currently this is displayed as a flag only.
                 * Future implementation: Apply capping logic based on business rules.
                 */}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Score Calculation:</strong> Weighted average of all three controls.
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Safety Training & Oversight: 30% weight</li>
              <li>Ongoing Insurance Verification: 40% weight</li>
              <li>Coverage & Contract Integrity: 30% weight</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href={`/assessments/${assessmentId}`}>
          <Button variant="outline" data-testid="button-back-to-assessment">
            Back to Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
}
