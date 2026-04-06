const NASA_POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point";

export interface NasaPowerParams {
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
  parameters?: string[];
}

const DEFAULT_PARAMETERS = [
  "T2M",
  "T2M_MIN",
  "T2M_MAX",
  "PRECTOTCORR",
  "RH2M",
  "WS2M",
  "ALLSKY_SFC_SW_DWN",
  "TS",
];

async function fetchNasaPower(
  params: NasaPowerParams
): Promise<Record<string, unknown>> {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  
  const startDate = params.startDate ?? lastYear.toISOString().replace(/-/g, "").slice(0, 8);
  const endDate = params.endDate ?? today.toISOString().replace(/-/g, "").slice(0, 8);
  const parameters = params.parameters?.join(",") ?? DEFAULT_PARAMETERS.join(",");

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?latitude=${params.latitude}&longitude=${params.longitude}&community=RE&parameters=${parameters}&start=${startDate}&end=${endDate}&format=JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NASA POWER API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchNasaPowerDaily(params: NasaPowerParams) {
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);

  const startDate = params.startDate ?? yearAgo.toISOString().split("T")[0].replace(/-/g, "");
  const endDate = params.endDate ?? today.toISOString().split("T")[0].replace(/-/g, "");

  return fetchNasaPower({
    ...params,
    startDate,
    endDate,
  });
}

export async function fetchNasaPowerClimatology(params: NasaPowerParams) {
  return fetchNasaPower(params);
}

export interface NasaPowerDailyResult {
  monthlyRainfall: { month: string; mm: number }[];
  monthlyTemp: { month: string; celsius: number }[];
  monthlyTempMin: { month: string; celsius: number }[];
  monthlyTempMax: { month: string; celsius: number }[];
  avgHumidity: number;
  avgWindSpeed: number;
  annualRainfall: number;
  annualAvgTemp: number;
}

export function parseNasaPowerDailyResponse(data: Record<string, unknown>): NasaPowerDailyResult {
  const properties = data.properties as Record<string, Record<string, Record<string, number>>> | undefined;
  if (!properties) {
    throw new Error("Invalid NASA POWER response format");
  }

  const parameterData = properties.parameter as Record<string, Record<string, number>> | undefined;
  if (!parameterData) {
    throw new Error("No parameter data in NASA POWER response");
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyRainfall: { month: string; mm: number }[] = [];
  const monthlyTemp: { month: string; celsius: number }[] = [];
  const monthlyTempMin: { month: string; celsius: number }[] = [];
  const monthlyTempMax: { month: string; celsius: number }[] = [];

  let totalRainfall = 0;
  let totalTemp = 0;
  let tempCount = 0;
  let totalHumidity = 0;
  let humidityCount = 0;
  let totalWindSpeed = 0;
  let windCount = 0;

  const prectot = parameterData.PRECTOTCORR ?? {};
  const t2m = parameterData.T2M ?? {};
  const t2mMin = parameterData.T2M_MIN ?? {};
  const t2mMax = parameterData.T2M_MAX ?? {};
  const rh2m = parameterData.RH2M ?? {};
  const ws2m = parameterData.WS2M ?? {};

  for (let m = 0; m < 12; m++) {
    const monthDates = Object.entries(prectot).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });

    const monthRainfall = monthDates.reduce((sum, [, val]) => sum + val, 0);
    monthlyRainfall.push({ month: months[m], mm: parseFloat((monthRainfall * 30.44).toFixed(2)) });
    totalRainfall += monthRainfall * 30.44;

    const monthTempDates = Object.entries(t2m).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });
    const avgTemp = monthTempDates.length > 0
      ? monthTempDates.reduce((sum, [, val]) => sum + val, 0) / monthTempDates.length
      : 0;
    monthlyTemp.push({ month: months[m], celsius: parseFloat(avgTemp.toFixed(2)) });
    if (avgTemp > 0) {
      totalTemp += avgTemp;
      tempCount++;
    }

    const monthMinDates = Object.entries(t2mMin).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });
    const avgMinTemp = monthMinDates.length > 0
      ? monthMinDates.reduce((sum, [, val]) => sum + val, 0) / monthMinDates.length
      : 0;
    monthlyTempMin.push({ month: months[m], celsius: parseFloat(avgMinTemp.toFixed(2)) });

    const monthMaxDates = Object.entries(t2mMax).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });
    const avgMaxTemp = monthMaxDates.length > 0
      ? monthMaxDates.reduce((sum, [, val]) => sum + val, 0) / monthMaxDates.length
      : 0;
    monthlyTempMax.push({ month: months[m], celsius: parseFloat(avgMaxTemp.toFixed(2)) });

    const monthHumidityDates = Object.entries(rh2m).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });
    if (monthHumidityDates.length > 0) {
      const avgHumidity = monthHumidityDates.reduce((sum, [, val]) => sum + val, 0) / monthHumidityDates.length;
      totalHumidity += avgHumidity;
      humidityCount++;
    }

    const monthWindDates = Object.entries(ws2m).filter(([date]) => {
      const d = new Date(date);
      return d.getMonth() === m && !isNaN(d.getTime());
    });
    if (monthWindDates.length > 0) {
      const avgWind = monthWindDates.reduce((sum, [, val]) => sum + val, 0) / monthWindDates.length;
      totalWindSpeed += avgWind;
      windCount++;
    }
  }

  return {
    monthlyRainfall,
    monthlyTemp,
    monthlyTempMin,
    monthlyTempMax,
    avgHumidity: humidityCount > 0 ? parseFloat((totalHumidity / humidityCount).toFixed(2)) : 0,
    avgWindSpeed: windCount > 0 ? parseFloat((totalWindSpeed / windCount).toFixed(2)) : 0,
    annualRainfall: parseFloat(totalRainfall.toFixed(2)),
    annualAvgTemp: tempCount > 0 ? parseFloat((totalTemp / tempCount).toFixed(2)) : 0,
  };
}

export interface NasaPowerClimatologyResult {
  monthlyRainfall: { month: string; mm: number }[];
  monthlyTemp: { month: string; celsius: number }[];
  annualRainfall: number;
  annualAvgTemp: number;
}

export function parseNasaPowerClimatologyResponse(data: Record<string, unknown>): NasaPowerClimatologyResult {
  const properties = data.properties as Record<string, unknown> | undefined;
  if (!properties) {
    throw new Error("Invalid NASA POWER response format");
  }

  const parameterData = properties.parameter as Record<string, Record<string, number>> | undefined;
  if (!parameterData) {
    throw new Error("No parameter data in NASA POWER response");
  }

  const prectot = parameterData.PRECTOTCORR ?? {};
  const t2m = parameterData.T2M ?? {};

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyRainfall = months.map((month) => {
    let total = 0;
    let count = 0;
    for (const [date, value] of Object.entries(prectot)) {
      const d = new Date(date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8));
      if (d.getMonth() === months.indexOf(month)) {
        total += value;
        count++;
      }
    }
    return { month, mm: parseFloat(((count > 0 ? total / count : 0) * 30.44).toFixed(2)) };
  });

  const monthlyTemp = months.map((month) => {
    let total = 0;
    let count = 0;
    for (const [date, value] of Object.entries(t2m)) {
      const d = new Date(date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8));
      if (d.getMonth() === months.indexOf(month)) {
        total += value;
        count++;
      }
    }
    return { month, celsius: parseFloat((count > 0 ? total / count : 0).toFixed(2)) };
  });

  const annualRainfall = monthlyRainfall.reduce((s, m) => s + m.mm, 0);
  const annualAvgTemp = monthlyTemp.reduce((s, m) => s + m.celsius, 0) / 12;

  return {
    monthlyRainfall,
    monthlyTemp,
    annualRainfall: parseFloat(annualRainfall.toFixed(2)),
    annualAvgTemp: parseFloat(annualAvgTemp.toFixed(2)),
  };
}
