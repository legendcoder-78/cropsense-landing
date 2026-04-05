/**
 * supplyChainLogic.js - Final Verified Version
 * Optimized for: State-Level Logistics, AI-Weighted Risk, and Fail-Safe Stability.
 */

const STATE_AI_CONFIG = {
    "Haryana": {
        "temp_w": 0.4567,
        "rain_w": 0.5433,
        "hub": "Sonipat Logistics Park",
        "crop": "Rice",
        "route": "KMP Expressway"
    },
    "Andhra Pradesh": {
        "temp_w": 0.4961,
        "rain_w": 0.5039,
        "hub": "Vijayawada Logistics Cluster",
        "crop": "Sugarcane",
        "route": "NH-16 Coastal Corridor"
    },
    "Maharashtra": {
        "temp_w": 0.47,
        "rain_w": 0.53,
        "hub": "Bhiwandi Hub",
        "crop": "Onions/Maize",
        "route": "Mumbai-Pune Expressway"
    },
    "Gujarat": {
        "temp_w": 0.5175,
        "rain_w": 0.4825,
        "hub": "Mundra Port Hub",
        "crop": "Cotton/Groundnut",
        "route": "NH-47 West Link"
    },
    "West Bengal": {
        "temp_w": 0.5335,
        "rain_w": 0.4665,
        "hub": "Dankuni Hub",
        "crop": "Jute/Rice",
        "route": "NH-19 East Corridor"
    },
    "Karnataka": {
        "temp_w": 0.5046,
        "rain_w": 0.4954,
        "hub": "Dabaspete Industrial Area",
        "crop": "Ragi/Pulses",
        "route": "NH-48 South Link"
    },
    "Uttar Pradesh": {
        "temp_w": 0.5074,
        "rain_w": 0.4926,
        "hub": "Lucknow Trans-shipment Point",
        "crop": "Sugarcane/Potato",
        "route": "Yamuna Expressway"
    },
    "Punjab": {
        "temp_w": 0.4789,
        "rain_w": 0.5211,
        "hub": "Ambala Warehouse",
        "crop": "Wheat",
        "route": "DFCR (North Corridor)"
    },
    "Default": {
        "temp_w": 0.50,
        "rain_w": 0.50,
        "hub": "Central Reserve Hub",
        "crop": "General Produce",
        "route": "State Highways"
    }
};

const historicalCropBackup = {
    "Punjab": 4.8,
    "Haryana": 4.6,
    "Maharashtra": 5.3,
    "Karnataka": 5.0,
    "Uttar Pradesh": 5.1,
    "West Bengal": 4.7,
    "Andhra Pradesh": 5.0,
    "Gujarat": 4.9,
    "Default": 5.0
};

export const calculateDetailedRisk = (state, tempScore, rainScore, cropScore) => {
    // 1. Sanitization: Prevents crashes if there are extra spaces or null inputs
    const sanitizedState = state ? state.trim() : "Default";
    const config = STATE_AI_CONFIG[sanitizedState] || STATE_AI_CONFIG["Default"];

    // 2. Climate Fail-Safe: Defaults to 5.0 (Neutral) if Nilan's data is missing
    const finalTempScore = (tempScore !== undefined && tempScore !== null) ? tempScore : 5.0;
    const finalRainScore = (rainScore !== undefined && rainScore !== null) ? rainScore : 5.0;

    // 3. Crop Fail-Safe: Handles missing Nikhil data using historical averages
    let currentDataSource = "Live AI Sensors";
    let finalCropScore = cropScore;
    if (!cropScore || cropScore === 0) {
        finalCropScore = historicalCropBackup[sanitizedState] || historicalCropBackup["Default"];
        currentDataSource = "Historical Database (Fail-Safe)";
    }

    // AI WEIGHTED FORMULA: Blend Climate and Crop components
    const climateImpact = (finalTempScore * config.temp_w) + (finalRainScore * config.rain_w);
    const rawRisk = (climateImpact * 0.6) + (finalCropScore * 0.4);
    const scoreString = rawRisk.toFixed(1);

    let alertLevel, color, action;

    if (rawRisk >= 7.5) {
        alertLevel = "CRITICAL";
        color = "#d32f2f"; // Red
        action = `URGENT: Divert ${config.crop} from ${config.hub} via ${config.route}.`;
    } else if (rawRisk >= 4.5) {
        alertLevel = "VOLATILE";
        color = "#f57c00"; // Orange
        action = `CAUTION: Monitor ${config.hub} via ${config.route}.`;
    } else {
        alertLevel = "STABLE";
        color = "#388e3c"; // Green
        action = `OPTIMAL: Standard ${config.crop} routes via ${config.route}.`;
    }

    return {
        state: sanitizedState,
        riskScore: scoreString,
        status: alertLevel,
        severityColor: color,
        suggestedAction: action,
        dataMethod: currentDataSource
    };
};