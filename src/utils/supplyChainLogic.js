/**
 * supplyChainLogic.js
 * Core Logic for Food Shortage & Logistics Disruption Prediction
 */

// 1. Database of Alternate Logistics Routes (Indian Context)
const logisticsNetwork = {
    "North": { alternate: "Bhopal Logistics Hub", route: "Western Freight Corridor" },
    "South": { alternate: "Nagpur Connectivity Hub", route: "NH-44 (Central Bypass)" },
    "West": { alternate: "Ahmedabad Cluster", route: "State Highway 8 (Inter-city)" },
    "East": { alternate: "Prayagraj Junction", route: "Golden Quadrilateral (East Section)" },
    "Default": { alternate: "Nearest Tier-2 Distribution Center", route: "Local Rail Freight" }
};

/**
 * Main Function: Predicts Shortage and Suggests Rerouting
 * @param {number} climateScore - Risk from Nilan (0-10, 10 being severe weather)
 * @param {number} cropScore - Risk from Nikhil (0-10, 10 being crop failure)
 * @param {string} region - "North", "South", "West", or "East"
 */
export const calculateSupplyChainRisk = (climateScore, cropScore, region = "Default") => {

    // 2. The Weighted Formula (Climate is 60% weight, Crop is 40%)
    // If roads are closed (Climate), you can't move food even if it's healthy.
    const riskScore = (climateScore * 0.6) + (cropScore * 0.4);

    let status, color, advice;

    // 3. Risk Thresholds
    if (riskScore >= 7.5) {
        status = "CRITICAL DISRUPTION";
        color = "#FF0000"; // Red
        advice = `Immediate Action: Primary routes blocked. Reroute via ${logisticsNetwork[region].alternate} using the ${logisticsNetwork[region].route}.`;
    } else if (riskScore >= 4.5) {
        status = "VOLATILE SUPPLY";
        color = "#FFA500"; // Orange
        advice = "Caution: Minor delays expected. Activate secondary transport buffer.";
    } else {
        status = "OPTIMAL STABILITY";
        color = "#008000"; // Green
        advice = "Normal Operations: Supply lines are clear.";
    }

    return {
        score: riskScore.toFixed(1),
        status: status,
        color: color,
        recommendation: advice,
        timestamp: new Date().toLocaleTimeString()
    };
};