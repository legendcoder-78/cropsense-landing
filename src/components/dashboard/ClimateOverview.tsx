import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClimateData } from "@/lib/types";
import { CloudRain, Thermometer, TrendingUp, AlertTriangle } from "lucide-react";
import WeatherForecast from "./WeatherForecast";
import SoilVegetationHealth from "./SoilVegetationHealth";

interface ClimateOverviewProps {
  data: ClimateData;
}

function RiskGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score <= 3.5 ? "hsl(var(--primary))" : score <= 6.5 ? "hsl(var(--harvest))" : "hsl(var(--destructive))";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" className="-rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-bold text-foreground">{score.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">/ 10</span>
      </div>
    </div>
  );
}

export default function ClimateOverview({ data }: ClimateOverviewProps) {
  const riskColor =
    data.disruptionRisk.level === "LOW"
      ? "bg-primary text-primary-foreground"
      : data.disruptionRisk.level === "MEDIUM"
      ? "bg-harvest text-primary"
      : "bg-destructive text-destructive-foreground";

  const trendIcon =
    data.rainfall.trend === "increasing" ? (
      <TrendingUp className="h-4 w-4 text-primary" />
    ) : data.rainfall.trend === "decreasing" ? (
      <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
    ) : (
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Climate Overview</h1>
        <p className="text-muted-foreground mt-1">
          Risk assessment for{" "}
          <span className="font-medium text-foreground capitalize">{data.region}</span>
        </p>
      </div>

      {data.disruptionRisk.droughtRisk >= 7 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Drought Alert</p>
            <p className="text-xs text-red-600">Elevated drought risk ({data.disruptionRisk.droughtRisk.toFixed(1)}/10) detected for {data.region}. Consider drought-resistant crop varieties.</p>
          </div>
        </div>
      )}

      {data.disruptionRisk.floodRisk >= 7 && (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-sky-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-sky-800">Flood Alert</p>
            <p className="text-xs text-sky-600">Elevated flood risk ({data.disruptionRisk.floodRisk.toFixed(1)}/10) detected for {data.region}. Ensure drainage systems are clear.</p>
          </div>
        </div>
      )}

      {data.temperature.riseIndicator && data.temperature.annualAvg > 30 && (
        <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Heat Advisory</p>
            <p className="text-xs text-orange-600">Average temperature of {data.temperature.annualAvg.toFixed(1)}°C with rising trend. Heat stress risk to crops is elevated.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          <CardContent className="flex flex-col items-center pt-6">
            <RiskGauge score={data.climateRiskScore} />
            <Badge className={`mt-4 text-sm px-4 py-1 ${riskColor}`}>
              {data.disruptionRisk.level} RISK
            </Badge>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Higher score indicates greater climate disruption risk
            </p>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-sky/10">
                  <CloudRain className="h-5 w-5 text-sky" />
                </div>
                <span className="text-sm text-muted-foreground">Annual Rainfall</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {data.rainfall.annual} mm
              </p>
              <div className="flex items-center gap-1 mt-2">
                {trendIcon}
                <span className="text-xs text-muted-foreground capitalize">
                  {data.rainfall.trend} trend
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-harvest/10">
                  <Thermometer className="h-5 w-5 text-harvest" />
                </div>
                <span className="text-sm text-muted-foreground">Avg Temperature</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {data.temperature.annualAvg}°C
              </p>
              <div className="flex items-center gap-1 mt-2">
                {data.temperature.riseIndicator ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-destructive">Rising trend detected</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Stable</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">Drought Risk</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {data.disruptionRisk.droughtRisk.toFixed(1)}
                <span className="text-sm text-muted-foreground font-normal">/10</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-sky/10">
                  <CloudRain className="h-5 w-5 text-sky" />
                </div>
                <span className="text-sm text-muted-foreground">Flood Risk</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {data.disruptionRisk.floodRisk.toFixed(1)}
                <span className="text-sm text-muted-foreground font-normal">/10</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <WeatherForecast />
      <SoilVegetationHealth />
    </div>
  );
}
