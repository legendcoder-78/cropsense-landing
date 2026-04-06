import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const riskConfig = {
  Low: { color: "bg-emerald-100 text-emerald-700 border-emerald-300", bar: "bg-emerald-500" },
  Medium: { color: "bg-amber-100 text-amber-700 border-amber-300", bar: "bg-amber-500" },
  High: { color: "bg-red-100 text-red-700 border-red-300", bar: "bg-red-500" },
};

const mockCropRisks: Record<string, { crop: string; risk: "Low" | "Medium" | "High"; explanation: string }> = {
  "Wheat": { crop: "Wheat", risk: "Low", explanation: "Favorable conditions for wheat growth. Soil moisture levels are adequate and temperatures are within optimal range. No significant pest pressure detected." },
  "Rice": { crop: "Rice", risk: "Medium", explanation: "Moderate risk due to below-normal pre-monsoon rainfall. Water availability for transplanting may be constrained. Consider delayed sowing or alternative water sources." },
  "Cotton": { crop: "Cotton", risk: "High", explanation: "Pink bollworm pressure reported in neighboring areas. Rising temperatures increase pest reproduction rates. Implement integrated pest management and monitor fields weekly." },
  "Sugarcane": { crop: "Sugarcane", risk: "Medium", explanation: "Red rot incidence has been reported in 3 nearby blocks. Prophylactic fungicide application recommended. Drip irrigation infrastructure is adequate for current conditions." },
  "Maize": { crop: "Maize", risk: "Low", explanation: "Spring maize is performing well with adequate irrigation. Fall armyworm pressure is lower than last year due to effective IPM measures. Healthy yield potential of 6-7 tonnes/ha expected." },
  "Soybean": { crop: "Soybean", risk: "High", explanation: "Forecast indicates a 60% probability of delayed monsoon onset. Soybean requires well-distributed rainfall during the first 30 days. Combined with yellow mosaic virus reports, risk is elevated." },
  "Groundnut": { crop: "Groundnut", risk: "Medium", explanation: "Severe moisture stress in the top 30cm soil layer makes germination unreliable. Aflatoxin risk increases with drought stress followed by sudden rainfall. Delay sowing until adequate moisture." },
  "Tomato": { crop: "Tomato", risk: "Medium", explanation: "High temperatures may cause flower drop, reducing yield by 15-20%. Current market prices are favorable. Shade-net cultivation recommended to mitigate heat stress." },
  "Onion": { crop: "Onion", risk: "Low", explanation: "Rabi onion harvest is complete and storage conditions are optimal. Kharif sowing prospects look favorable with adequate seed availability. Purple blotch pressure is minimal." },
  "Jowar (Sorghum)": { crop: "Jowar (Sorghum)", risk: "Low", explanation: "Being a drought-tolerant crop, sorghum is well-suited for current conditions. Shoot fly incidence is within manageable thresholds. Grain filling expected to coincide with favorable temperature drop." },
};

export default function CropRiskAnalysis() {
  const { user } = useAuth();
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const userCrops = user?.crops ?? [];

  const cropEntries = useMemo(() => {
    const cropsToShow = userCrops.length > 0 ? userCrops : Object.keys(mockCropRisks);
    return cropsToShow
      .map((crop) => mockCropRisks[crop] ?? { crop, risk: "Medium" as const, explanation: "Analysis pending. Check back later." })
      .sort((a, b) => {
        const order = { High: 0, Medium: 1, Low: 2 };
        return (order[a.risk] ?? 1) - (order[b.risk] ?? 1);
      });
  }, [userCrops]);

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
        {cropEntries.map((riskData) => {
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
                        {riskData.risk === "High" ? "75%" : riskData.risk === "Medium" ? "50%" : "25%"}
                      </span>
                    </div>
                    <Progress
                      value={riskData.risk === "High" ? 75 : riskData.risk === "Medium" ? 50 : 25}
                      className="h-2"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{riskData.explanation}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
