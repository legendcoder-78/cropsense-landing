export type RiskLevel = "Low" | "Medium" | "High";

export interface StateSuitability {
  state: string;
  score: number; // 0 to 100
}

export interface HistoricalYield {
  year: string;
  actual: number;
  predicted: number;
}

export interface PestAlert {
  id: string;
  name: string;
  severity: RiskLevel;
  prevention: string;
}

export interface PriceTrend {
  month: string;
  msp: number;
  marketPrice: number;
}

export interface CropData {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  waterRequirement: string;
  tempRange: string;
  humidity: string;
  rainfall: string;
  frostSensitivity: string;
  topStates: StateSuitability[];
  historicalYield: HistoricalYield[];
  pestAlerts: PestAlert[];
  priceTrends: PriceTrend[];
  riskExplanation: string;
}

export const soilTypes = [
  "Alluvial Soil",
  "Black Soil",
  "Red Soil",
  "Laterite Soil",
  "Sandy Soil",
  "Loamy Soil"
];

export const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

const defaultYield = [
  { year: "2019", actual: 3.2, predicted: 3.1 },
  { year: "2020", actual: 3.4, predicted: 3.3 },
  { year: "2021", actual: 3.3, predicted: 3.5 },
  { year: "2022", actual: 3.1, predicted: 3.4 },
  { year: "2023", actual: 3.5, predicted: 3.4 },
];

const defaultPrices = [
  { month: "Jan", msp: 2000, marketPrice: 2100 },
  { month: "Feb", msp: 2000, marketPrice: 2150 },
  { month: "Mar", msp: 2000, marketPrice: 2050 },
  { month: "Apr", msp: 2000, marketPrice: 2200 },
  { month: "May", msp: 2000, marketPrice: 2250 },
  { month: "Jun", msp: 2000, marketPrice: 2300 },
];

export const mockCropData: Record<string, CropData> = {
  wheat: {
    id: "wheat", name: "Wheat", riskLevel: "Medium",
    waterRequirement: "450-650 mm", tempRange: "10°C - 25°C",
    humidity: "50% - 60%", rainfall: "Moderate", frostSensitivity: "High during flowering",
    topStates: [
      { state: "Uttar Pradesh", score: 92 }, { state: "Punjab", score: 88 },
      { state: "Haryana", score: 85 }, { state: "Madhya Pradesh", score: 78 }, { state: "Rajasthan", score: 70 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "p1", name: "Yellow Rust", severity: "High", prevention: "Use resistant varieties; spray propiconazole." },
      { id: "p2", name: "Aphids", severity: "Medium", prevention: "Apply neem-based insecticides." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Wheat faces medium risk primarily due to rising early-summer temperatures causing terminal heat stress, which negatively impacts grain filling.",
  },
  rice: {
    id: "rice", name: "Rice", riskLevel: "High",
    waterRequirement: "1200-2000 mm", tempRange: "20°C - 35°C",
    humidity: "70% - 80%", rainfall: "High", frostSensitivity: "Highly Sensitive",
    topStates: [
      { state: "West Bengal", score: 95 }, { state: "Punjab", score: 90 },
      { state: "Uttar Pradesh", score: 85 }, { state: "Andhra Pradesh", score: 82 }, { state: "Bihar", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "r1", name: "Brown Plant Hopper", severity: "High", prevention: "Drain field and allow dry spells." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Rice presents high risk due to heavy dependence on timely monsoon progression.",
  },
  cotton: {
    id: "cotton", name: "Cotton", riskLevel: "High",
    waterRequirement: "700-1200 mm", tempRange: "21°C - 30°C",
    humidity: "50% - 70%", rainfall: "Moderate", frostSensitivity: "Highly Sensitive",
    topStates: [
      { state: "Gujarat", score: 88 }, { state: "Maharashtra", score: 82 },
      { state: "Telangana", score: 80 }, { state: "Rajasthan", score: 75 }, { state: "Haryana", score: 72 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "c1", name: "Pink Bollworm", severity: "High", prevention: "Install pheromone traps; rotate crops." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Cotton reflects high risk from severe pest pressures and extreme vulnerability to unseasonal rains.",
  },
  maize: {
    id: "maize", name: "Maize", riskLevel: "Low",
    waterRequirement: "500-800 mm", tempRange: "18°C - 27°C",
    humidity: "40% - 60%", rainfall: "Moderate", frostSensitivity: "Low",
    topStates: [
      { state: "Karnataka", score: 89 }, { state: "Madhya Pradesh", score: 85 },
      { state: "Bihar", score: 80 }, { state: "Maharashtra", score: 78 }, { state: "Uttar Pradesh", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "m1", name: "Fall Armyworm", severity: "High", prevention: "Early planting; biopesticides application." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Maize is highly adaptable, though Fall Armyworm poses localized threats.",
  },
  sugarcane: {
    id: "sugarcane", name: "Sugarcane", riskLevel: "Medium",
    waterRequirement: "1500-2500 mm", tempRange: "20°C - 35°C",
    humidity: "70% - 85%", rainfall: "High", frostSensitivity: "Medium",
    topStates: [
      { state: "Uttar Pradesh", score: 94 }, { state: "Maharashtra", score: 90 },
      { state: "Karnataka", score: 85 }, { state: "Tamil Nadu", score: 80 }, { state: "Bihar", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "s1", name: "Shoot Borer", severity: "Medium", prevention: "Trash mulching; clean cultivation." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Water intensive crop; risk correlates strongly with depleted water tables in non-irrigated zones.",
  },
  soybean: {
    id: "soybean", name: "Soybean", riskLevel: "Medium",
    waterRequirement: "450-700 mm", tempRange: "20°C - 30°C",
    humidity: "60% - 70%", rainfall: "Moderate", frostSensitivity: "High",
    topStates: [
      { state: "Madhya Pradesh", score: 92 }, { state: "Maharashtra", score: 88 },
      { state: "Rajasthan", score: 80 }, { state: "Karnataka", score: 75 }, { state: "Telangana", score: 70 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "soy1", name: "Girdle Beetle", severity: "Medium", prevention: "Use systemic seed treatments." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Susceptible to mid-season drought stress during pod filling stage.",
  },
  groundnut: {
    id: "groundnut", name: "Groundnut", riskLevel: "Low",
    waterRequirement: "500-700 mm", tempRange: "25°C - 35°C",
    humidity: "50% - 60%", rainfall: "Low to Moderate", frostSensitivity: "High",
    topStates: [
      { state: "Gujarat", score: 95 }, { state: "Andhra Pradesh", score: 85 },
      { state: "Tamil Nadu", score: 82 }, { state: "Karnataka", score: 78 }, { state: "Rajasthan", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "g1", name: "White Grub", severity: "High", prevention: "Deep summer ploughing; soil application of insecticides." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Drought resistant, but a dry spell during pegging can severely depress yields.",
  },
  mustard: {
    id: "mustard", name: "Mustard", riskLevel: "Low",
    waterRequirement: "250-400 mm", tempRange: "10°C - 25°C",
    humidity: "40% - 50%", rainfall: "Low", frostSensitivity: "High during flowering",
    topStates: [
      { state: "Rajasthan", score: 94 }, { state: "Haryana", score: 88 },
      { state: "Madhya Pradesh", score: 85 }, { state: "Uttar Pradesh", score: 80 }, { state: "West Bengal", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "mu1", name: "Mustard Aphid", severity: "High", prevention: "Timely sowing; dimethoate spray." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Resilient winter crop, very susceptible to frost bite. Frost alerts are critical.",
  },
  bajra: {
    id: "bajra", name: "Pearl Millet (Bajra)", riskLevel: "Low",
    waterRequirement: "250-400 mm", tempRange: "25°C - 35°C",
    humidity: "30% - 50%", rainfall: "Low", frostSensitivity: "High",
    topStates: [
      { state: "Rajasthan", score: 96 }, { state: "Uttar Pradesh", score: 85 },
      { state: "Haryana", score: 82 }, { state: "Gujarat", score: 80 }, { state: "Maharashtra", score: 78 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "bj1", name: "Downy Mildew", severity: "Medium", prevention: "Seed treatment with Metalaxyl." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Hardy dryland crop with extremely low climate risk profile.",
  },
  jowar: {
    id: "jowar", name: "Sorghum (Jowar)", riskLevel: "Low",
    waterRequirement: "400-600 mm", tempRange: "26°C - 33°C",
    humidity: "40% - 60%", rainfall: "Low to Moderate", frostSensitivity: "High",
    topStates: [
      { state: "Maharashtra", score: 92 }, { state: "Karnataka", score: 88 },
      { state: "Andhra Pradesh", score: 80 }, { state: "Tamil Nadu", score: 75 }, { state: "Gujarat", score: 72 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "jw1", name: "Shoot Fly", severity: "Medium", prevention: "Early sowing within monsoon onset." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Strong drought tolerance protects baseline yield in volatile rainfed areas.",
  },
  jute: {
    id: "jute", name: "Jute", riskLevel: "Medium",
    waterRequirement: "1500-2000 mm", tempRange: "24°C - 35°C",
    humidity: "70% - 90%", rainfall: "High", frostSensitivity: "Sensitive",
    topStates: [
      { state: "West Bengal", score: 96 }, { state: "Bihar", score: 88 },
      { state: "Assam", score: 85 }, { state: "Odisha", score: 75 }, { state: "Meghalaya", score: 70 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "ju1", name: "Jute Semilooper", severity: "Medium", prevention: "Apply correct dosage of fenvalerate." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Requires standing water for retting; dry periods during harvest deeply degrade fiber.",
  },
  tea: {
    id: "tea", name: "Tea", riskLevel: "Medium",
    waterRequirement: "1500-3000 mm", tempRange: "20°C - 30°C",
    humidity: "70% - 90%", rainfall: "Very High, distributed", frostSensitivity: "High",
    topStates: [
      { state: "Assam", score: 95 }, { state: "West Bengal", score: 90 },
      { state: "Tamil Nadu", score: 85 }, { state: "Kerala", score: 80 }, { state: "Tripura", score: 70 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "t1", name: "Red Spider Mite", severity: "High", prevention: "Pruning and safe acaricides." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Requires continuous soil moisture but excellent drainage. Floods or drought halts pluckings.",
  },
  coffee: {
    id: "coffee", name: "Coffee", riskLevel: "Medium",
    waterRequirement: "1500-2500 mm", tempRange: "15°C - 28°C",
    humidity: "70% - 85%", rainfall: "High", frostSensitivity: "Highly Sensitive",
    topStates: [
      { state: "Karnataka", score: 95 }, { state: "Kerala", score: 88 },
      { state: "Tamil Nadu", score: 85 }, { state: "Andhra Pradesh", score: 65 }, { state: "Odisha", score: 60 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "cf1", name: "Coffee Berry Borer", severity: "High", prevention: "Phytosanitary harvest practices." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Vulnerable to sudden unseasonal blossom showers altering flowering synchrony.",
  },
  barley: {
    id: "barley", name: "Barley", riskLevel: "Low",
    waterRequirement: "300-400 mm", tempRange: "12°C - 25°C",
    humidity: "40% - 60%", rainfall: "Low", frostSensitivity: "Moderate",
    topStates: [
      { state: "Rajasthan", score: 90 }, { state: "Uttar Pradesh", score: 88 },
      { state: "Madhya Pradesh", score: 82 }, { state: "Haryana", score: 78 }, { state: "Punjab", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "b1", name: "Loose Smut", severity: "Low", prevention: "Solar seed treatment before sowing." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "A resilient alternative to wheat in water-scarce or saline soil areas.",
  },
  chickpea: {
    id: "chickpea", name: "Chickpea (Bengal Gram)", riskLevel: "Low",
    waterRequirement: "300-500 mm", tempRange: "15°C - 25°C",
    humidity: "40% - 50%", rainfall: "Low", frostSensitivity: "High during flowering",
    topStates: [
      { state: "Madhya Pradesh", score: 92 }, { state: "Maharashtra", score: 88 },
      { state: "Rajasthan", score: 85 }, { state: "Uttar Pradesh", score: 80 }, { state: "Karnataka", score: 75 },
    ],
    historicalYield: defaultYield,
    pestAlerts: [
      { id: "cp1", name: "Gram Pod Borer", severity: "High", prevention: "Install bird perches and pheromone traps." },
    ],
    priceTrends: defaultPrices,
    riskExplanation: "Winter legume that thrives on residual soil moisture; excessive late rains cause disease.",
  }
};

export interface DistrictZoneData {
  id: string; // matches SVG path ID e.g. "ka-north"
  name: string;
  soilProfiles: string[];
  irrigatability: number; // 0-100 (high is better)
}

// Granular mock reflecting district/zone level configurations per state.
export const granularRiskData: Record<string, DistrictZoneData[]> = {
  "Karnataka": [
    { id: "ka-north", name: "North Karnataka", soilProfiles: ["Black Soil", "Sandy Soil"], irrigatability: 40 },
    { id: "ka-central", name: "Central Karnataka", soilProfiles: ["Loamy Soil", "Red Soil"], irrigatability: 70 },
    { id: "ka-south", name: "South Karnataka", soilProfiles: ["Red Soil", "Laterite Soil"], irrigatability: 85 },
    { id: "ka-coastal", name: "Coastal Karnataka", soilProfiles: ["Laterite Soil", "Alluvial Soil", "Loamy Soil"], irrigatability: 95 },
  ],
  "Maharashtra": [
    { id: "mh-vidarbha", name: "Vidarbha", soilProfiles: ["Black Soil"], irrigatability: 35 },
    { id: "mh-marathwada", name: "Marathwada", soilProfiles: ["Black Soil", "Red Soil"], irrigatability: 25 },
    { id: "mh-western", name: "Western Maharashtra", soilProfiles: ["Alluvial Soil", "Red Soil"], irrigatability: 85 },
    { id: "mh-konkan", name: "Konkan", soilProfiles: ["Laterite Soil", "Loamy Soil"], irrigatability: 90 },
  ],
  "Uttar Pradesh": [
    { id: "up-west", name: "Western UP", soilProfiles: ["Alluvial Soil"], irrigatability: 95 },
    { id: "up-east", name: "Eastern UP", soilProfiles: ["Alluvial Soil", "Red Soil"], irrigatability: 75 },
    { id: "up-bundelkhand", name: "Bundelkhand", soilProfiles: ["Red Soil"], irrigatability: 45 },
  ]
};
