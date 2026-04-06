import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ClimateData } from "@/lib/types";
import { getRecommendations } from "@/lib/climate";
import { AlertTriangle, Droplets, CloudRain, Lightbulb } from "lucide-react";

interface DisruptionPredictorProps {
  data: ClimateData;
}

function RiskLevelBadge({ level }: { level: string }) {
  const styles =
    level === "LOW"
      ? "bg-primary text-primary-foreground"
      : level === "MEDIUM"
      ? "bg-harvest text-primary"
      : "bg-destructive text-destructive-foreground";

  return <Badge className={`text-base px-4 py-1 ${styles}`}>{level}</Badge>;
}

function RiskBar({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Droplets }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-mono text-muted-foreground">{value.toFixed(1)}/10</span>
      </div>
      <Progress value={value * 10} className="h-2" />
    </div>
  );
}

export default function DisruptionPredictor({ data }: DisruptionPredictorProps) {
  const recommendations = getRecommendations(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Disruption Predictions</h1>
        <p className="text-muted-foreground mt-1">AI-powered climate risk assessment for your region</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Overall disruption risk score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <div className="relative w-40 h-40">
                <svg width="160" height="160" className="-rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke={
                      data.disruptionRisk.score <= 3.5
                        ? "hsl(var(--primary))"
                        : data.disruptionRisk.score <= 6.5
                        ? "hsl(var(--harvest))"
                        : "hsl(var(--destructive))"
                    }
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 65}
                    strokeDashoffset={2 * Math.PI * 65 - (data.disruptionRisk.score / 10) * 2 * Math.PI * 65}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {data.disruptionRisk.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
              </div>
              <div className="mt-4">
                <RiskLevelBadge level={data.disruptionRisk.level} />
              </div>
            </div>

            <div className="space-y-4">
              <RiskBar
                label="Drought Risk"
                value={data.disruptionRisk.droughtRisk}
                icon={Droplets}
              />
              <RiskBar
                label="Flood Risk"
                value={data.disruptionRisk.floodRisk}
                icon={CloudRain}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-harvest" />
              Recommendations
            </CardTitle>
            <CardDescription>Actions based on your climate risk profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="mt-0.5 p-1 rounded-full bg-primary/10 shrink-0">
                    <AlertTriangle className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
