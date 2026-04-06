import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useClimate } from "@/hooks/useClimate";
import { Sprout, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { REGION_CROPS, calculateCropRisk } from "@/lib/climate";
import { generateCropRiskAssessment } from "@/services/dashboardGemini";
import type { Region, ClimateData } from "@/lib/types";
import type { CropRiskResult } from "@/services/dashboardGemini";

const riskConfig = {
  Low: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", bar: "bg-emerald-500" },
  Medium: { color: "bg-amber-100 text-amber-700 border-amber-300", bar: "bg-amber-500" },
  High: { color: "bg-red-100 text-red-700 border-red-300", bar: "bg-red-500" },
};

export default function CropRiskAnalysis() {
  const { user } = useAuth();
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);
  const [cropRisks, setCropRisks] = useState<Record<string, CropRiskResult>>({});
  const [loading, setLoading] = useState(false);

  const userCrops = useMemo(() => user?.crops ?? [], [user?.crops]);
  const region = user?.region as Region;

  const { data: climateData } = useClimate(region);

  const cropsToShow = useMemo(() => {
    if (!climateData) return [];
    return userCrops.length > 0
      ? userCrops
      : REGION_CROPS[region] ?? [];
  }, [userCrops, region, climateData]);

  useEffect(() => {
    if (!climateData || cropsToShow.length === 0) return;
    setLoading(true);

    Promise.all(
      cropsToShow.map(async (crop) => {
        try {
          const geminiResult = await generateCropRiskAssessment(crop, region, {
            avgTemp: climateData.temperature.annualAvg,
            annualRainfall: climateData.rainfall.annual,
            droughtRisk: climateData.disruptionRisk.droughtRisk,
            floodRisk: climateData.disruptionRisk.floodRisk,
          });
          return { crop, result: geminiResult };
        } catch {
          const fallback = calculateCropRisk(crop, climateData);
          return { crop, result: fallback };
        }
      })
    )
      .then((results) => {
        const map: Record<string, CropRiskResult> = {};
        results.forEach(({ crop, result }) => {
          map[crop] = result;
        });
        setCropRisks(map);
      })
      .finally(() => setLoading(false));
  }, [climateData, cropsToShow, region]);

  const cropEntries = useMemo(() => {
    return cropsToShow
      .map((crop) => {
        const riskResult = cropRisks[crop] ?? calculateCropRisk(crop, climateData!);
        return { crop, risk: riskResult.risk, explanation: riskResult.explanation, score: riskResult.score };
      })
      .sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.risk] ?? 1) - (order[b.risk] ?? 1);
      });
  }, [cropsToShow, cropRisks, climateData]);

  const riskSummary = useMemo(() => ({
    high: cropEntries.filter((c) => c.risk === "High").length,
    medium: cropEntries.filter((c) => c.risk === "Medium").length,
    low: cropEntries.filter((c) => c.risk === "Low").length,
  }), [cropEntries]);

  if (!user?.region) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Crop Risk Analysis</h1>
          <p className="text-muted-foreground mt-1">AI-powered risk assessment for your crops</p>
        </div>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Sprout className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Please set your region and crops in the Profile tab first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Crop Risk Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Risk assessment for {userCrops.length > 0 ? `${userCrops.length} crops` : "key crops"} in {user.region}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{riskSummary.high}</p>
              <p className="text-xs text-muted-foreground">High Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{riskSummary.medium}</p>
              <p className="text-xs text-muted-foreground">Medium Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Sprout className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{riskSummary.low}</p>
              <p className="text-xs text-muted-foreground">Low Risk</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: cropsToShow.length || 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </Card>
          ))
        ) : cropEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Sprout className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No crops to analyze.</p>
            </CardContent>
          </Card>
        ) : (
          cropEntries.map((riskData) => {
            const isExpanded = expandedCrop === riskData.crop;
            const config = riskConfig[riskData.risk] ?? riskConfig.Medium;

            return (
              <Card key={riskData.crop} className="overflow-hidden">
                <button
                  onClick={() => setExpandedCrop(isExpanded ? null : riskData.crop)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                      {riskData.risk}
                    </div>
                    <span className="font-display text-base font-semibold text-foreground">{riskData.crop}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-4">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Risk Level</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {riskData.score}%
                        </span>
                      </div>
                      <Progress
                        value={riskData.score}
                        className="h-2"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{riskData.explanation}</p>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
