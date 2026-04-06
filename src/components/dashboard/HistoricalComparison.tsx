import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface MonthlyComparison {
  month: string;
  thisYear: number;
  lastYear: number;
  diff: number;
  diffPercent: number;
}

interface ComparisonResult {
  rainfall: MonthlyComparison[];
  temperature: MonthlyComparison[];
  annualRainfallDiff: number;
  annualTempDiff: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateMockComparison(region: string): ComparisonResult {
  const regionData: Record<string, { rainfallThis: number[]; rainfallLast: number[]; tempThis: number[]; tempLast: number[] }> = {
    "punjab": {
      rainfallThis: [12, 18, 22, 28, 55, 140, 230, 210, 165, 85, 35, 12],
      rainfallLast: [15, 20, 25, 30, 60, 150, 250, 230, 180, 100, 40, 15],
      tempThis: [14, 17, 23, 29, 34, 36, 31, 29, 30, 26, 20, 15],
      tempLast: [13, 16, 22, 28, 33, 35, 30, 28, 29, 25, 19, 14],
    },
    "haryana": {
      rainfallThis: [10, 15, 20, 25, 50, 130, 220, 200, 155, 80, 30, 10],
      rainfallLast: [12, 18, 22, 28, 55, 140, 230, 210, 165, 85, 35, 12],
      tempThis: [15, 18, 24, 30, 35, 37, 32, 30, 31, 27, 21, 16],
      tempLast: [14, 17, 23, 29, 34, 36, 31, 29, 30, 26, 20, 15],
    },
    "maharashtra": {
      rainfallThis: [5, 8, 15, 25, 55, 180, 350, 320, 250, 120, 45, 8],
      rainfallLast: [8, 10, 18, 30, 60, 200, 380, 350, 280, 140, 50, 10],
      tempThis: [24, 26, 29, 32, 34, 30, 26, 25, 26, 28, 26, 24],
      tempLast: [23, 25, 28, 31, 33, 29, 25, 24, 25, 27, 25, 23],
    },
    "karnataka": {
      rainfallThis: [8, 12, 20, 40, 80, 120, 100, 110, 130, 140, 70, 15],
      rainfallLast: [10, 15, 22, 45, 85, 130, 110, 120, 140, 150, 75, 18],
      tempThis: [24, 26, 29, 31, 30, 26, 24, 24, 25, 25, 24, 23],
      tempLast: [23, 25, 28, 30, 29, 25, 23, 23, 24, 24, 23, 22],
    },
    "uttar pradesh": {
      rainfallThis: [8, 12, 15, 20, 35, 100, 250, 260, 180, 60, 15, 5],
      rainfallLast: [10, 15, 18, 22, 40, 110, 270, 280, 200, 70, 18, 6],
      tempThis: [16, 19, 26, 33, 38, 37, 31, 29, 30, 28, 22, 17],
      tempLast: [15, 18, 25, 32, 37, 36, 30, 28, 29, 27, 21, 16],
    },
    "west bengal": {
      rainfallThis: [10, 18, 30, 55, 120, 250, 320, 280, 220, 130, 30, 8],
      rainfallLast: [12, 20, 35, 60, 130, 270, 350, 300, 240, 140, 35, 10],
      tempThis: [20, 23, 28, 31, 33, 32, 30, 30, 30, 29, 25, 20],
      tempLast: [19, 22, 27, 30, 32, 31, 29, 29, 29, 28, 24, 19],
    },
    "andhra pradesh": {
      rainfallThis: [8, 12, 18, 30, 60, 80, 100, 120, 160, 180, 80, 12],
      rainfallLast: [10, 15, 20, 35, 65, 90, 110, 130, 170, 190, 85, 15],
      tempThis: [26, 29, 33, 36, 38, 35, 30, 29, 30, 30, 27, 25],
      tempLast: [25, 28, 32, 35, 37, 34, 29, 28, 29, 29, 26, 24],
    },
    "gujarat": {
      rainfallThis: [3, 5, 8, 15, 30, 100, 220, 200, 140, 50, 12, 3],
      rainfallLast: [5, 8, 10, 18, 35, 110, 240, 220, 160, 60, 15, 5],
      tempThis: [20, 23, 28, 33, 37, 34, 29, 28, 29, 30, 25, 21],
      tempLast: [19, 22, 27, 32, 36, 33, 28, 27, 28, 29, 24, 20],
    },
  };

  const data = regionData[region] ?? regionData["karnataka"];

  const rainfall = months.map((month, i) => ({
    month,
    thisYear: data.rainfallThis[i],
    lastYear: data.rainfallLast[i],
    diff: parseFloat((data.rainfallThis[i] - data.rainfallLast[i]).toFixed(2)),
    diffPercent: parseFloat(((data.rainfallThis[i] - data.rainfallLast[i]) / Math.max(1, data.rainfallLast[i]) * 100).toFixed(1)),
  }));

  const temperature = months.map((month, i) => ({
    month,
    thisYear: data.tempThis[i],
    lastYear: data.tempLast[i],
    diff: parseFloat((data.tempThis[i] - data.tempLast[i]).toFixed(2)),
    diffPercent: parseFloat(((data.tempThis[i] - data.tempLast[i]) / Math.max(1, data.tempLast[i]) * 100).toFixed(1)),
  }));

  const annualRainfallDiff = rainfall.reduce((s, m) => s + m.diff, 0);
  const annualTempDiff = temperature.reduce((s, m) => s + m.diff, 0);

  return { rainfall, temperature, annualRainfallDiff, annualTempDiff };
}

export default function HistoricalComparison() {
  const { user } = useAuth();

  const data = useMemo(() => {
    if (!user?.region) return null;
    return generateMockComparison(user.region);
  }, [user?.region]);

  if (!user?.region) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Year-over-Year Comparison
        </CardTitle>
        <CardDescription>
          {new Date().getFullYear()} vs {new Date().getFullYear() - 1} monthly comparison for {user.region}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-sm font-semibold text-foreground">Monthly Rainfall (mm)</h4>
                <Badge variant={data.annualRainfallDiff > 0 ? "default" : data.annualRainfallDiff < 0 ? "destructive" : "outline"} className="text-xs">
                  {data.annualRainfallDiff > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : data.annualRainfallDiff < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                  {data.annualRainfallDiff > 0 ? "+" : ""}{data.annualRainfallDiff.toFixed(0)} mm
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.rainfall}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="thisYear" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={`${new Date().getFullYear()}`} />
                  <Bar dataKey="lastYear" fill="#94a3b8" radius={[4, 4, 0, 0]} name={`${new Date().getFullYear() - 1}`} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-sm font-semibold text-foreground">Monthly Avg Temperature (°C)</h4>
                <Badge variant={data.annualTempDiff > 0 ? "destructive" : data.annualTempDiff < 0 ? "default" : "outline"} className="text-xs">
                  {data.annualTempDiff > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : data.annualTempDiff < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                  {data.annualTempDiff > 0 ? "+" : ""}{data.annualTempDiff.toFixed(1)}°C
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.temperature}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="thisYear" fill="#f97316" radius={[4, 4, 0, 0]} name={`${new Date().getFullYear()}`} />
                  <Bar dataKey="lastYear" fill="#94a3b8" radius={[4, 4, 0, 0]} name={`${new Date().getFullYear() - 1}`} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
