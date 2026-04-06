export type Region =
  | "punjab"
  | "haryana"
  | "maharashtra"
  | "karnataka"
  | "uttar pradesh"
  | "west bengal"
  | "andhra pradesh"
  | "gujarat";

export const REGIONS: Region[] = [
  "punjab",
  "haryana",
  "maharashtra",
  "karnataka",
  "uttar pradesh",
  "west bengal",
  "andhra pradesh",
  "gujarat",
];

export const INDIAN_CROPS = [
  "Wheat",
  "Rice",
  "Cotton",
  "Sugarcane",
  "Maize",
  "Soybean",
  "Groundnut",
  "Mustard",
  "Potato",
  "Jute",
  "Tea",
  "Coffee",
  "Millet",
  "Pulses",
  "Turmeric",
] as const;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  region: Region;
  crops: string[];
}

export interface ClimateData {
  region: Region;
  climateRiskScore: number;
  rainfall: {
    monthly: { month: string; mm: number }[];
    annual: number;
    trend: "increasing" | "decreasing" | "stable";
  };
  temperature: {
    monthly: { month: string; celsius: number }[];
    annualAvg: number;
    riseIndicator: boolean;
  };
  disruptionRisk: {
    score: number;
    level: "LOW" | "MEDIUM" | "HIGH";
    droughtRisk: number;
    floodRisk: number;
  };
}
