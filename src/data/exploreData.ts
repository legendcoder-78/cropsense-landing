// ── Location hierarchy ──────────────────────────────────────────────
export interface State {
  name: string;
  districts: string[];
}

export const locationData: State[] = [
  { name: "Andhra Pradesh", districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Chittoor"] },
  { name: "Arunachal Pradesh", districts: ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila", "Roing", "Tezu"] },
  { name: "Assam", districts: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tezpur", "Tinsukia"] },
  { name: "Bihar", districts: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Arrah"] },
  { name: "Chhattisgarh", districts: ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur", "Raigarh", "Ambikapur"] },
  { name: "Goa", districts: ["North Goa", "South Goa", "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"] },
  { name: "Gujarat", districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"] },
  { name: "Haryana", districts: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak"] },
  { name: "Himachal Pradesh", districts: ["Shimla", "Mandi", "Kullu", "Dharamshala", "Solan", "Chamba", "Una"] },
  { name: "Jharkhand", districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih"] },
  { name: "Karnataka", districts: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubli", "Belagavi", "Davangere", "Shivamogga"] },
  { name: "Kerala", districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Kannur"] },
  { name: "Madhya Pradesh", districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Satna"] },
  { name: "Maharashtra", districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur"] },
  { name: "Manipur", districts: ["Imphal West", "Imphal East", "Thoubal", "Churachandpur", "Ukhrul", "Bishnupur", "Senapati"] },
  { name: "Meghalaya", districts: ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara", "Williamnagar", "Resubelpara"] },
  { name: "Mizoram", districts: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Saiha", "Lawngtlai"] },
  { name: "Nagaland", districts: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek"] },
  { name: "Odisha", districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri", "Balasore", "Berhampur"] },
  { name: "Punjab", districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur"] },
  { name: "Rajasthan", districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar"] },
  { name: "Sikkim", districts: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Pakyong"] },
  { name: "Tamil Nadu", districts: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode"] },
  { name: "Telangana", districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Adilabad"] },
  { name: "Tripura", districts: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Ambassa", "Sabroom"] },
  { name: "Uttar Pradesh", districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Prayagraj", "Ghaziabad"] },
  { name: "Uttarakhand", districts: ["Dehradun", "Haridwar", "Nainital", "Almora", "Pithoragarh", "Roorkee", "Haldwani"] },
  { name: "West Bengal", districts: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Kharagpur"] },
];

// ── AI Insights ─────────────────────────────────────────────────────
export interface NewsItem {
  category: "crop_failure" | "weather" | "market" | "policy";
  title: string;
  summary: string;
  date: string;
  severity: "info" | "warning" | "critical";
}

export function getInsightsForDistrict(state: string, district: string) {
  const newsPool: NewsItem[] = [
    {
      category: "crop_failure",
      title: `Paddy crop damage reported in ${district}`,
      summary: `Heavy unseasonal rainfall over the past 10 days has damaged an estimated 1,200 hectares of standing paddy crop in ${district}, ${state}. Farmers are urged to file compensation claims through the PMFBY portal.`,
      date: "2026-04-02",
      severity: "critical",
    },
    {
      category: "weather",
      title: `Heat wave alert for ${district} region`,
      summary: `IMD has issued a yellow alert for ${district}, predicting temperatures 4-5°C above normal over the next 72 hours. Maximum temperatures expected to touch 42°C. Advisory issued to avoid noon-hour field work.`,
      date: "2026-04-04",
      severity: "warning",
    },
    {
      category: "market",
      title: `Tomato prices surge 40% in ${state}`,
      summary: `Supply disruption caused by recent flooding in neighboring districts has pushed tomato wholesale prices in ${state} up by 40%. Current mandi rate stands at ₹62/kg vs ₹38/kg last month.`,
      date: "2026-04-03",
      severity: "info",
    },
    {
      category: "policy",
      title: `MSP increase announced for Kharif 2026`,
      summary: `The central government has announced a 7% increase in MSP for paddy, bringing it to ₹2,450/quintal. Soybean MSP raised to ₹4,800/quintal. Benefits will apply starting the upcoming Kharif sowing season.`,
      date: "2026-04-01",
      severity: "info",
    },
  ];

  const aiSummary = `Based on current analysis for ${district}, ${state}: The region is experiencing higher-than-average temperatures with below-normal pre-monsoon rainfall. Soil moisture levels are at 32%, which is 15% below the seasonal average. We recommend delaying sowing of moisture-sensitive crops like groundnut by 7-10 days. Existing standing crops may need supplemental irrigation. Monitor IMD forecasts closely for expected weather pattern shifts around April 15-20.`;

  return { news: newsPool, aiSummary };
}

// ── Crop risk ───────────────────────────────────────────────────────
export interface CropRisk {
  crop: string;
  risk: "Low" | "Medium" | "High";
  explanation: string;
}

export const cropList = [
  "Rice (Paddy)",
  "Wheat",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Tomato",
  "Onion",
  "Groundnut",
  "Maize",
  "Jowar (Sorghum)",
];

export function getCropRisk(crop: string, _district: string): CropRisk {
  const risks: Record<string, CropRisk> = {
    "Rice (Paddy)": {
      crop: "Rice (Paddy)",
      risk: "High",
      explanation:
        "Current soil moisture deficit of 15% combined with predicted heatwave makes paddy cultivation extremely risky. Water-intensive requirements cannot be met with current reservoir levels at 42% capacity. Delay transplanting by 2-3 weeks until monsoon onset is confirmed.",
    },
    Wheat: {
      crop: "Wheat",
      risk: "Low",
      explanation:
        "Wheat harvesting season is nearly complete. No significant pest or disease pressure detected. Post-harvest storage conditions are favorable with low humidity levels predicted for the next 2 weeks.",
    },
    Sugarcane: {
      crop: "Sugarcane",
      risk: "Medium",
      explanation:
        "Drip irrigation infrastructure is adequate, but rising temperatures may accelerate evapotranspiration by 20%. Red rot incidence has been reported in 3 neighboring blocks. Prophylactic fungicide application is recommended.",
    },
    Cotton: {
      crop: "Cotton",
      risk: "Medium",
      explanation:
        "Pink bollworm resistance to Bt cotton observed in adjacent districts. Early sowing may expose the crop to whitefly infestations. Recommended to use certified seed with dual Bt gene and implement refuge strategy.",
    },
    Soybean: {
      crop: "Soybean",
      risk: "High",
      explanation:
        "Forecast models indicate a 60% probability of delayed monsoon onset. Soybean requires well-distributed rainfall during the first 30 days. Combined with yellow mosaic virus reports in the region, risk is elevated.",
    },
    Tomato: {
      crop: "Tomato",
      risk: "Medium",
      explanation:
        "High temperatures may cause flower drop, reducing yield by 15-20%. However, current market prices are favorable at ₹62/kg. Shade-net cultivation is recommended to mitigate heat stress.",
    },
    Onion: {
      crop: "Onion",
      risk: "Low",
      explanation:
        "Rabi onion harvest is complete and storage conditions are optimal. Kharif sowing prospects look favorable with adequate seed availability. Purple blotch pressure is minimal due to low humidity.",
    },
    Groundnut: {
      crop: "Groundnut",
      risk: "High",
      explanation:
        "Severe moisture stress in the top 30cm soil layer makes germination unreliable. Additionally, aflatoxin risk increases with the combination of drought stress followed by sudden rainfall. Delay sowing until adequate moisture is available.",
    },
    Maize: {
      crop: "Maize",
      risk: "Low",
      explanation:
        "Spring maize is performing well with adequate irrigation. Fall armyworm pressure is lower than last year due to effective IPM measures. Current growth stage indicates healthy yield potential of 6-7 tonnes/ha.",
    },
    "Jowar (Sorghum)": {
      crop: "Jowar (Sorghum)",
      risk: "Low",
      explanation:
        "Being a drought-tolerant crop, sorghum is well-suited for current conditions. Shoot fly incidence is within manageable thresholds. Grain filling stage expected to coincide with favorable temperature drop in late April.",
    },
  };

  return (
    risks[crop] || {
      crop,
      risk: "Medium",
      explanation: "Detailed analysis is being computed. Please check back shortly.",
    }
  );
}

// ── Climate data ────────────────────────────────────────────────────
export interface ClimateDataPoint {
  month: string;
  rainfall: number;
  temperature: number;
  uvIndex: number;
}

export function getClimateData(_district: string): ClimateDataPoint[] {
  return [
    { month: "Jan", rainfall: 8, temperature: 22, uvIndex: 5 },
    { month: "Feb", rainfall: 5, temperature: 24, uvIndex: 6 },
    { month: "Mar", rainfall: 12, temperature: 28, uvIndex: 8 },
    { month: "Apr", rainfall: 18, temperature: 33, uvIndex: 9 },
    { month: "May", rainfall: 35, temperature: 36, uvIndex: 10 },
    { month: "Jun", rainfall: 140, temperature: 32, uvIndex: 7 },
    { month: "Jul", rainfall: 210, temperature: 28, uvIndex: 5 },
    { month: "Aug", rainfall: 195, temperature: 27, uvIndex: 5 },
    { month: "Sep", rainfall: 165, temperature: 28, uvIndex: 6 },
    { month: "Oct", rainfall: 85, temperature: 29, uvIndex: 7 },
    { month: "Nov", rainfall: 25, temperature: 25, uvIndex: 5 },
    { month: "Dec", rainfall: 10, temperature: 22, uvIndex: 4 },
  ];
}

// ── Recommendations ─────────────────────────────────────────────────
export interface Recommendation {
  icon: "water" | "seed" | "shield" | "calendar" | "sun" | "leaf";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export function getRecommendations(_district: string): Recommendation[] {
  return [
    {
      icon: "water",
      title: "Optimize Irrigation Schedule",
      description:
        "Switch to early morning (5-7 AM) or late evening (6-8 PM) irrigation to reduce evaporation losses by up to 30%. Consider drip irrigation for water-intensive crops.",
      priority: "high",
    },
    {
      icon: "shield",
      title: "Apply Preventive Pest Management",
      description:
        "Install pheromone traps for bollworm monitoring at 5 traps/hectare. Begin neem-based organic spray schedule as temperatures rise above 35°C.",
      priority: "high",
    },
    {
      icon: "seed",
      title: "Select Climate-Resilient Varieties",
      description:
        "For upcoming Kharif season, choose drought-tolerant varieties like Sahbhagi Dhan (rice) or MACS 1407 (soybean) that perform well under moisture-stress conditions.",
      priority: "medium",
    },
    {
      icon: "calendar",
      title: "Adjust Sowing Calendar",
      description:
        "Based on IMD's extended-range forecast, delay sowing of rain-fed crops by 7-10 days. Target sowing window: June 20 – July 5 for optimal monsoon alignment.",
      priority: "medium",
    },
    {
      icon: "sun",
      title: "Implement Mulching for Heat Protection",
      description:
        "Apply 5-7 cm layer of crop residue mulch around existing crops to reduce soil temperature by 3-5°C and conserve soil moisture during the heatwave period.",
      priority: "high",
    },
    {
      icon: "leaf",
      title: "Diversify with Intercropping",
      description:
        "Consider pigeon pea + soybean or maize + groundnut intercropping systems to spread risk across multiple crops and improve overall land productivity by 20-30%.",
      priority: "low",
    },
  ];
}
