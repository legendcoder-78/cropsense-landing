import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. INITIALIZE GEMINI (Use your API Key here)
const genAI = new GoogleGenerativeAI("AIzaSyBZTIz6yctsWgc5bS6fhiPtBOE7ltF1PCA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const AGRI_DATA = {
    "Karnataka": { crops: { "Rice": [6, 11], "Ragi": [5, 9], "Maize": [6, 10] }, hubs: "Bengaluru Hub", alt: "NH-66 (Coastal Bypass)", neighbors: "TN, AP, MH", routes: "NH-48" },
    "Punjab": { crops: { "Wheat": [11, 4], "Rice": [6, 10], "Cotton": [5, 8] }, hubs: "Ludhiana Park", alt: "Amritsar-Jamnagar Exp", neighbors: "HR, RJ", routes: "NH-44" },
    "West Bengal": { crops: { "Rice": [1, 12], "Jute": [4, 9], "Potato": [11, 2] }, hubs: "Kolkata Port", alt: "NH-12 Connector", neighbors: "Bihar, Odisha", routes: "Siliguri Corridor" },
    "Maharashtra": { crops: { "Onions": [1, 4], "Sugarcane": [1, 12], "Cotton": [6, 11] }, hubs: "JNPT Port", alt: "Samruddhi Mahamarg", neighbors: "GJ, KA, TS", routes: "Mumbai-Pune Exp" },
    "Bihar": { crops: { "Maize": [1, 4], "Rice": [6, 11], "Litchi": [5, 6] }, hubs: "Patna Port", alt: "NH-31", neighbors: "WB, UP", routes: "NH-27" },
    "Uttar Pradesh": { crops: { "Sugarcane": [1, 12], "Wheat": [11, 4], "Potatoes": [10, 2] }, hubs: "Noida Terminal", alt: "Agra-Lucknow Exp", neighbors: "Bihar, HR", routes: "Yamuna Exp" },
    "Haryana": { crops: { "Wheat": [11, 4], "Rice": [6, 10], "Mustard": [10, 3] }, hubs: "Sonipat Port", alt: "KMP Expressway", neighbors: "Punjab, RJ", routes: "NH-44" },
    "Rajasthan": { crops: { "Bajra": [7, 10], "Mustard": [10, 3], "Spices": [10, 3] }, hubs: "Jaipur Yard", alt: "Delhi-Mumbai Exp", neighbors: "GJ, HR, MP", routes: "NH-48" }
};

export const nexusOracle = {
    runFullAnalysis: async (query, persona) => {
        try {
            const extractionPrompt = `Extract JSON: {"state": "...", "event": "...", "month": 7} from "${query}". States: [Karnataka, Punjab, West Bengal, Maharashtra, Bihar, Uttar Pradesh, Haryana, Rajasthan]. Events: [flood, heatwave, drought, cyclone]. Return ONLY JSON.`;
            const result = await model.generateContent(extractionPrompt);
            const extracted = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());

            if (extracted.state && AGRI_DATA[extracted.state]) {
                return nexusOracle.generateResponse(extracted.state, extracted.event, extracted.month, persona);
            }
            throw new Error("AI failed to parse state.");
        } catch (err) {
            console.warn("AI Engine failed, using Local Logic...", err);
            return nexusOracle.localFallback(query, persona);
        }
    },

    generateResponse: (state, event, month, persona) => {
        const data = AGRI_DATA[state];
        const currentMonth = month || 7;
        const eventTitle = event?.toUpperCase() || "WEATHER SHIFT";

        const impactedCrops = [];
        const safeCrops = [];

        Object.entries(data.crops).forEach(([crop, window]) => {
            const [start, end] = window;
            const isInSeason = (start <= end)
                ? (currentMonth >= start && currentMonth <= end)
                : (currentMonth >= start || currentMonth <= end);
            isInSeason ? impactedCrops.push(crop) : safeCrops.push(crop);
        });

        const briefings = {
            NGO: {
                title: "Crisis Relief Strategy",
                impact: `The ${eventTitle} in ${state} has compromised the harvest of ${impactedCrops.join(" and ")}. This will lead to an immediate 30% drop in local food availability for the next quarter.`,
                action: `COMMAND: Mobilize emergency grain reserves for ${impactedCrops[0]}. Fortunately, ${safeCrops.join(", ")} supplies are currently in off-season storage and remain safe. Prioritize distribution via ${data.alt} to avoid the ${data.routes} bottleneck.`
            },
            RETAILER: {
                title: "Supply Chain Continuity Plan",
                impact: `Supply failure confirmed for ${impactedCrops.join(", ")}. Market prices in ${state} are expected to surge by 15-20% within 72 hours due to harvest loss.`,
                action: `COMMAND: Immediately cease procurement from ${data.hubs}. Pivot your inventory sourcing to ${data.neighbors} hubs. While ${impactedCrops.join("/")} are unavailable, ${safeCrops.join(" and ")} stocks remain stable—focus your logistics on clearing existing storage via ${data.alt}.`
            },
            GOVERNMENT: {
                title: "National Stability Briefing",
                impact: `Infrastructure failure on ${data.routes} combined with ${eventTitle} threatens the national ${impactedCrops[0]} security. Regional GDP from agriculture is at risk of a localized contraction.`,
                action: `COMMAND: Authorize emergency price ceilings for ${impactedCrops.join(" and ")} to prevent hoarding. Deploy state transport to clear the ${data.alt} corridor. Note: ${safeCrops.join(", ")} reserves are currently unaffected; focus administrative resources on salvaging the standing ${impactedCrops[0]} crop.`
            }
        };

        const personaBrief = briefings[persona] || briefings["NGO"];

        return {
            state,
            event: eventTitle,
            month: currentMonth,
            impactedCrops,
            safeCrops,
            alternate: data.alt,
            advice: personaBrief.action,
            detailedImpact: personaBrief.impact,
            title: personaBrief.title
        };
    },

    localFallback: (query, persona) => {
        const q = query.toLowerCase();
        const state = Object.keys(AGRI_DATA).find(s => q.includes(s.toLowerCase())) || "Karnataka";
        const event = ["flood", "heatwave", "dry", "sunny", "drought"].find(e => q.includes(e)) || "flood";
        return nexusOracle.generateResponse(state, event, 7, persona);
    }
};