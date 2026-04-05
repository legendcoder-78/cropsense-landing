/**
 * supplyChainLogic.js - Advanced Food Security Edition
 */

// 1. Mapping States to their Primary Food Role and Logistics Alternatives
const stateLogisticsDatabase = {
    "Punjab": { crop: "Wheat/Rice", altHub: "Ambala Warehouse", route: "Dedicated Freight Corridor (North)" },
    "Haryana": { crop: "Wheat/Mustard", altHub: "Sonipat Logistics Park", route: "KMP Expressway" },
    "Maharashtra": { crop: "Onions/Grapes", altHub: "Bhiwandi Hub", route: "Mumbai-Pune Expressway Bypass" },
    "Karnataka": { crop: "Ragi/Pulses", altHub: "Dabaspete Industrial Area", route: "NH-48 (South Link)" },
    "Uttar Pradesh": { crop: "Sugarcane/Potato", altHub: "Lucknow Trans-shipment Point", route: "Yamuna Expressway" },
    "West Bengal": { crop: "Rice/Jute", altHub: "Dankuni Hub", route: "NH-19 (East Corridor)" },
    "Andhra Pradesh": { crop: "Rice/Chilli", altHub: "Vijayawada Logistics Cluster", route: "NH-16 (Coastal Road)" },
    "Gujarat": { crop: "Cotton/Groundnut", altHub: "Mundra Port Hub", route: "NH-47 (West Link)" },
    "Default": { crop: "General Produce", altHub: "Central District Reserve", route: "State Highways" }
};

/**
 * Calculates Food Security Risk based on State-specific logistics
 * @param {string} state - The Indian state being analyzed
 * @param {number} climateScore - From Nilan (0-10)
 * @param {number} cropScore - From Nikhil (0-10)
 */
export const calculateDetailedRisk = (state, climateScore, cropScore) => {

    // The Data Contract verification
    const activeState = stateLogisticsDatabase[state] || stateLogisticsDatabase["Default"];

    // Weighted Risk Formula: 60% Climate (Roads/Transport), 40% Crop (Availability)
    // Formula: $$Risk Score = (Climate \times 0.6) + (Crop \times 0.4)$$
    const rawRisk = (climateScore * 0.6) + (cropScore * 0.4);

    let alertLevel, color, logisticsAction, shortageImpact;

    if (rawRisk >= 7.5) {
        alertLevel = "CRITICAL: FOOD SHORTAGE LIKELY";
        color = "#d32f2f"; // Dark Red
        shortageImpact = "High Probability: 20-30% price surge in local markets.";
        logisticsAction = `URGENT: Divert ${activeState.crop} supply from ${activeState.altHub} via ${activeState.route}.`;
    } else if (rawRisk >= 4.5) {
        alertLevel = "WARNING: SUPPLY CHAIN VOLATILITY";
        color = "#f57c00"; // Orange
        shortageImpact = "Moderate Probability: Potential 10% price fluctuation.";
        logisticsAction = `CAUTION: Monitor ${activeState.altHub} for congestion. Prepare backup transport.`;
    } else {
        alertLevel = "STABLE: FOOD SECURITY SECURED";
        color = "#388e3c"; // Green
        shortageImpact = "Low Probability: Standard market prices expected.";
        logisticsAction = `OPTIMAL: Proceed with standard ${activeState.crop} distribution routes.`;
    }

    return {
        state: state,
        primaryCrop: activeState.crop,
        finalScore: rawRisk.toFixed(1),
        status: alertLevel,
        severityColor: color,
        impact: shortageImpact,
        action: logisticsAction,
        lastUpdated: new Date().toLocaleTimeString()
    };
};