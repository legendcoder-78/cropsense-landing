import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ClimateData } from "@/lib/types";

interface RainfallChartProps {
  data: ClimateData;
}

const chartConfig: ChartConfig = {
  rainfall: {
    label: "Rainfall (mm)",
    color: "hsl(var(--sky))",
  },
};

export default function RainfallChart({ data }: RainfallChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Rainfall</CardTitle>
        <CardDescription>
          Annual total: {data.rainfall.annual} mm · {data.rainfall.trend} trend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72">
          <BarChart data={data.rainfall.monthly}>
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
            <Bar
              dataKey="mm"
              fill="hsl(var(--sky))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
