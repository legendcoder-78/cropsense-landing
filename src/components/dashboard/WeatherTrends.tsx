import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ClimateData } from "@/lib/types";
import { TrendingUp, ThermometerSun } from "lucide-react";

interface WeatherTrendsProps {
  data: ClimateData;
}

const chartConfig: ChartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--harvest))",
  },
};

export default function WeatherTrends({ data }: WeatherTrendsProps) {
  const maxTemp = Math.max(...data.temperature.monthly.map((m) => m.celsius));
  const minTemp = Math.min(...data.temperature.monthly.map((m) => m.celsius));
  const range = (maxTemp - minTemp).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Weather Trends</h1>
        <p className="text-muted-foreground mt-1">Temperature patterns and climate indicators</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerSun className="h-4 w-4 text-harvest" />
              <span className="text-sm text-muted-foreground">Peak Temperature</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{maxTemp.toFixed(1)}°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerSun className="h-4 w-4 text-sky" />
              <span className="text-sm text-muted-foreground">Lowest Temperature</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{minTemp.toFixed(1)}°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Annual Range</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{range}°C</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Temperature</CardTitle>
              <CardDescription>Average temperature by month</CardDescription>
            </div>
            {data.temperature.riseIndicator && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Temperature Rising
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <LineChart data={data.temperature.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="celsius"
                stroke="hsl(var(--harvest))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--harvest))", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
