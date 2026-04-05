/**
 * Calculates a crop risk score (0-10) for Nilan's weather data and Abhinav's UI.
 * 
 * Score Scale:
 * 0–2: Healthy (Perfect weather, no risk to food supply)
 * 3–5: At Risk (Moderate issues. Supply might dip)
 * 6–8: Damaged (Heavy rain or drought. Significant shortage likely)
 * 9–10: Failed (Total crop loss. No food available to ship)
 * 
 * @param {string} cropKey - Which crop is being searched ('wheat', 'rice', etc)
 * @param {number} temp - Temperature in Celsius 
 * @param {number} rain - Rainfall in mm
 * @returns {object} { cropName: String, cropScore: Number, status: String }
 */
function calculateCropScore(cropKey, temp, rain) {
    // Ensure CROP_DATA exists globally, otherwise fallback to a generic object
    const cropData = (typeof window !== 'undefined' && window.CROP_DATA)
        ? window.CROP_DATA
        : null;

    if (!cropData || !cropData[cropKey]) {
        return {
            cropName: cropKey.charAt(0).toUpperCase() + cropKey.slice(1),
            cropScore: 10,
            status: "Error: Crop data unavailable"
        };
    }

    const crop = cropData[cropKey];
    let score = 0;       // Start at 0 (Healthy)
    let issueTypes = []; // Track reasons for risk to craft Abhinav's UI status

    // 1. Evaluate Temperature 
    let tempDeviation = 0;
    if (crop.failTempMax && temp >= crop.failTempMax) {
        score = Math.max(score, 9);
        issueTypes.push('Severe Heat');
    } else if (crop.failTempMin && temp <= crop.failTempMin) {
        score = Math.max(score, 9);
        issueTypes.push('Severe Cold');
    } else if (temp > crop.idealTemp[1]) {
        // Between ideal max and fail max
        tempDeviation = (temp - crop.idealTemp[1]) / (crop.failTempMax - crop.idealTemp[1]);
        score += tempDeviation * 4 + 3; // Adds roughly 3 to 7 points
        issueTypes.push('High Temp');
    } else if (temp < crop.idealTemp[0]) {
        // Between ideal min and fail min
        tempDeviation = (crop.idealTemp[0] - temp) / (crop.idealTemp[0] - crop.failTempMin);
        score += tempDeviation * 4 + 3;
        issueTypes.push('Cold Stress');
    }

    // 2. Evaluate Rainfall
    let rainDeviation = 0;
    if (crop.failRainMax && rain >= crop.failRainMax) {
        score = Math.max(score, 9);
        issueTypes.push('Flooding');
    } else if (crop.failRainMin && rain <= crop.failRainMin) {
        score = Math.max(score, 9);
        issueTypes.push('Severe Drought');
    } else if (rain > crop.idealRain[1]) {
        rainDeviation = (rain - crop.idealRain[1]) / ((crop.failRainMax || crop.idealRain[1] + 100) - crop.idealRain[1]);
        score += rainDeviation * 4 + 3;
        issueTypes.push('Heavy Rain');
    } else if (rain < crop.idealRain[0]) {
        rainDeviation = (crop.idealRain[0] - rain) / (crop.idealRain[0] - (crop.failRainMin || 0));
        score += rainDeviation * 4 + 3;
        issueTypes.push('Low Rainfall');
    }

    // 3. Finalize numerical score (Clamp 0-10 and round to 1 decimal)
    let finalScore = Math.min(10, Math.max(0, score));
    finalScore = Math.round(finalScore * 10) / 10;

    // 4. Generate Status text for Abhinav
    let statusText = "";
    if (finalScore >= 9) {
        statusText = `Total Failure due to ${issueTypes.join(" and ")}`;
    } else if (finalScore >= 6) {
        statusText = `Heavy Damage due to ${issueTypes.join(" & ")}. Supply Shortage.`;
    } else if (finalScore >= 3) {
        statusText = `Yield Drop due to ${issueTypes.join(" & ")}.`;
    } else {
        // If ideal conditions
        // Randomize score between 0.0 and 2.0 just to make UI look organic
        finalScore = Math.round((Math.random() * 2) * 10) / 10;
        statusText = `Healthy. Optimal conditions.`;
    }

    return {
        cropName: crop.name,
        cropScore: finalScore,
        status: statusText
    };
}

// Expose globally
if (typeof window !== 'undefined') window.calculateCropScore = calculateCropScore;
