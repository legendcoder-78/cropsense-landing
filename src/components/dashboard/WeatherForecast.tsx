import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Thermometer, Droplets, Wind, Sun, CloudRain } from "lucide-react";
import { generateWeatherForecast } from "@/services/dashboardGemini";
import type { ForecastDay } from "@/services/dashboardGemini";

interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  uvIndex: number;
  windSpeed: number;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const baseTemps: Record<string, { max: number; min: number }> = {
  "punjab": { max: 35, min: 22 },
  "haryana": { max: 36, min: 23 },
  "maharashtra": { max: 33, min: 24 },
  "karnataka": { max: 32, min: 21 },
  "uttar pradesh": { max: 38, min: 25 },
  "west bengal": { max: 34, min: 26 },
  "andhra pradesh": { max: 36, min: 25 },
  "gujarat": { max: 37, min: 24 },
};

function getUvLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-emerald-600" };
  if (uv <= 5) return { label: "Mod", color: "text-amber-600" };
  if (uv <= 7) return { label: "High", color: "text-orange-600" };
  if (uv <= 10) return { label: "V.High", color: "text-red-600" };
  return { label: "Extreme", color: "text-purple-600" };
}

function getPrecipIcon(precip: number) {
  if (precip > 10) return CloudRain;
  if (precip > 2) return Droplets;
  return Sun;
}

function adaptForecastDay(day: ForecastDay, index: number): DailyForecast {
  const today = new Date();
  const d = new Date(today);
  d.setDate(d.getDate() + index);
  return {
    date: day.date || d.toISOString().split("T")[0],
    dayName: day.dayName || dayNames[d.getDay()],
    tempMax: day.tempMax,
    tempMin: day.tempMin,
    precipitation: day.precipitation,
    uvIndex: day.uvIndex,
    windSpeed: day.windSpeed,
  };
}

export default function WeatherForecast() {
  const { user } = useAuth();
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.region) return;
    setLoading(true);
    generateWeatherForecast(user.region)
      .then((data) => {
        setForecast(data.map((day, i) => adaptForecastDay(day, i)));
      })
      .catch(() => {
        const base = baseTemps[user.region!] ?? { max: 34, min: 23 };
        const today = new Date();
        setForecast(Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          const variation = Math.sin(i * 0.8) * 3;
          return {
            date: d.toISOString().split("T")[0],
            dayName: dayNames[d.getDay()],
            tempMax: base.max + variation + Math.round(Math.random() * 2),
            tempMin: base.min + variation * 0.5 + Math.round(Math.random()),
            precipitation: Math.round(Math.random() * 8 * (i > 3 ? 2 : 0.5) * 10) / 10,
            uvIndex: Math.round((7 + Math.random() * 3) * 10) / 10,
            windSpeed: Math.round(8 + Math.random() * 15),
          };
        }));
      })
      .finally(() => setLoading(false));
  }, [user?.region]);

  if (!user?.region) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-sky-600" />
          7-Day Weather Forecast
        </CardTitle>
        <CardDescription>
          {user.region.charAt(0).toUpperCase() + user.region.slice(1)} region forecast
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(forecast.length === 0 || loading) ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center rounded-xl p-3 bg-muted/30 animate-pulse">
                <div className="h-3 w-8 bg-muted rounded mb-3" />
                <div className="h-5 w-5 bg-muted rounded-full mb-2" />
                <div className="h-4 w-6 bg-muted rounded mb-1" />
                <div className="h-3 w-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, i) => {
              const PrecipIcon = getPrecipIcon(day.precipitation);
              const uvLevel = getUvLevel(day.uvIndex);
              const isToday = i === 0;

              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center rounded-xl p-3 text-center transition-colors ${
                    isToday ? "bg-sky-50 border border-sky-200" : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <span className={`text-xs font-medium mb-2 ${isToday ? "text-sky-700" : "text-muted-foreground"}`}>
                    {isToday ? "Today" : day.dayName}
                  </span>

                  <PrecipIcon className={`h-5 w-5 mb-2 ${day.precipitation > 5 ? "text-sky-500" : "text-amber-500"}`} />

                  <div className="flex flex-col items-center gap-0.5 w-full">
                    <span className="text-sm font-bold text-foreground">{Math.round(day.tempMax)}°</span>
                    <span className="text-xs text-muted-foreground">{Math.round(day.tempMin)}°</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50 w-full space-y-1">
                    {day.precipitation > 0 && (
                      <div className="flex items-center justify-center gap-1 text-[10px] text-sky-600">
                        <Droplets className="h-3 w-3" />
                        {day.precipitation.toFixed(0)}mm
                      </div>
                    )}
                    <div className={`flex items-center justify-center gap-1 text-[10px] ${uvLevel.color}`}>
                      <Sun className="h-3 w-3" />
                      {uvLevel.label}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                      <Wind className="h-3 w-3" />
                      {Math.round(day.windSpeed)}km/h
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
