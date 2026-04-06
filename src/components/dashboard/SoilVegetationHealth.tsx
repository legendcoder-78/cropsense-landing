import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Droplets, Leaf, ThermometerSun, Cloud } from "lucide-react";

interface SoilVegetationData {
  soilMoisture: number;
  vegetationIndex: number;
  landSurfaceTemp: number;
  cloudCover: number;
}

function getSoilMoistureLevel(value: number): { label: string; color: string; barColor: string } {
  if (value < 15) return { label: "Very Low", color: "text-red-600", barColor: "bg-red-500" };
  if (value < 25) return { label: "Low", color: "text-amber-600", barColor: "bg-amber-500" };
  if (value < 40) return { label: "Moderate", color: "text-emerald-600", barColor: "bg-emerald-500" };
  return { label: "High", color: "text-sky-600", barColor: "bg-sky-500" };
}

function getVegetationHealth(ndvi: number): { label: string; color: string } {
  if (ndvi < 0.2) return { label: "Bare Soil", color: "text-stone-500" };
  if (ndvi < 0.4) return { label: "Sparse", color: "text-amber-600" };
  if (ndvi < 0.6) return { label: "Moderate", color: "text-emerald-600" };
  return { label: "Dense/Healthy", color: "text-green-700" };
}

function generateMockData(region: string): SoilVegetationData {
  const regionData: Record<string, SoilVegetationData> = {
    "punjab": { soilMoisture: 28, vegetationIndex: 0.55, landSurfaceTemp: 32, cloudCover: 35 },
    "haryana": { soilMoisture: 25, vegetationIndex: 0.50, landSurfaceTemp: 34, cloudCover: 30 },
    "maharashtra": { soilMoisture: 32, vegetationIndex: 0.62, landSurfaceTemp: 28, cloudCover: 55 },
    "karnataka": { soilMoisture: 30, vegetationIndex: 0.58, landSurfaceTemp: 29, cloudCover: 45 },
    "uttar pradesh": { soilMoisture: 22, vegetationIndex: 0.45, landSurfaceTemp: 36, cloudCover: 25 },
    "west bengal": { soilMoisture: 38, vegetationIndex: 0.70, landSurfaceTemp: 30, cloudCover: 65 },
    "andhra pradesh": { soilMoisture: 26, vegetationIndex: 0.48, landSurfaceTemp: 33, cloudCover: 40 },
    "gujarat": { soilMoisture: 18, vegetationIndex: 0.35, landSurfaceTemp: 37, cloudCover: 20 },
  };

  return regionData[region] ?? regionData["karnataka"];
}

export default function SoilVegetationHealth() {
  const { user } = useAuth();
  const [data, setData] = useState<SoilVegetationData | null>(null);

  useEffect(() => {
    if (!user?.region) return;
    const timer = setTimeout(() => {
      setData(generateMockData(user.region));
    }, 600);
    return () => clearTimeout(timer);
  }, [user?.region]);

  if (!user?.region) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Soil & Vegetation Health
        </CardTitle>
        <CardDescription>
          Satellite-derived estimates for {user.region}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-white p-4 border border-sky-100">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="h-4 w-4 text-sky-600" />
                <span className="text-xs font-medium text-muted-foreground">Soil Moisture</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{data.soilMoisture.toFixed(1)}%</p>
              <div className="mt-2">
                <Progress value={data.soilMoisture} className="h-1.5" />
              </div>
              <p className={`text-xs font-medium mt-1 ${getSoilMoistureLevel(data.soilMoisture).color}`}>
                {getSoilMoistureLevel(data.soilMoisture).label}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-green-50 to-white p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">Vegetation (NDVI)</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{data.vegetationIndex.toFixed(2)}</p>
              <div className="mt-2">
                <Progress value={data.vegetationIndex * 100} className="h-1.5" />
              </div>
              <p className={`text-xs font-medium mt-1 ${getVegetationHealth(data.vegetationIndex).color}`}>
                {getVegetationHealth(data.vegetationIndex).label}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-white p-4 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <ThermometerSun className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-medium text-muted-foreground">Land Surface Temp</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{data.landSurfaceTemp.toFixed(1)}°C</p>
              <div className="mt-2">
                <Progress value={Math.min(100, (data.landSurfaceTemp / 50) * 100)} className="h-1.5" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.landSurfaceTemp > 35 ? "Hot" : data.landSurfaceTemp > 25 ? "Warm" : "Cool"}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-medium text-muted-foreground">Cloud Cover</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{data.cloudCover.toFixed(0)}%</p>
              <div className="mt-2">
                <Progress value={data.cloudCover} className="h-1.5" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.cloudCover > 70 ? "Overcast" : data.cloudCover > 40 ? "Partly Cloudy" : "Clear"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted/30 p-4 border animate-pulse">
                <div className="h-4 w-20 bg-muted rounded mb-3" />
                <div className="h-8 w-16 bg-muted rounded mb-2" />
                <div className="h-1.5 bg-muted rounded" />
                <div className="h-3 w-12 bg-muted rounded mt-1" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
