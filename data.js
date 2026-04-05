// Define Crop Parameters
const CROP_DATA = {
    wheat: {
        name: 'Wheat',
        idealTemp: [15, 25],
        idealRain: [50, 100],
        failTempMax: 35,
        failRainMax: 200,
        failRainMin: 20,
        regions: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Bihar", "Gujarat", "Maharashtra", "Uttarakhand"]
    },
    rice: {
        name: 'Rice',
        idealTemp: [20, 35],
        idealRain: [100, 250],
        failTempMin: 15,
        failRainMin: 50,
        regions: ["West Bengal", "Uttar Pradesh", "Andhra Pradesh", "Punjab", "Odisha", "Chhattisgarh", "Bihar", "Assam", "Tamil Nadu", "Telangana"]
    },
    cotton: {
        name: 'Cotton',
        idealTemp: [25, 35],
        idealRain: [50, 120],
        failTempMin: 20,
        failRainMax: 200,
        regions: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Punjab", "Haryana", "Rajasthan", "Karnataka", "Tamil Nadu", "Madhya Pradesh"]
    },
    maize: {
        name: 'Maize',
        idealTemp: [21, 27],
        idealRain: [50, 100],
        failTempMax: 35,
        failTempMin: 10,
        failRainMax: 200,
        failRainMin: 30,
        regions: ["Karnataka", "Madhya Pradesh", "Bihar", "Tamil Nadu", "Telangana", "Maharashtra", "Andhra Pradesh"]
    },
    sugarcane: {
        name: 'Sugarcane',
        idealTemp: [21, 27],
        idealRain: [75, 150],
        failTempMax: 40,
        failTempMin: 15,
        failRainMax: 300,
        failRainMin: 50,
        regions: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Bihar", "Gujarat", "Haryana", "Punjab"]
    },
    tea: {
        name: 'Tea',
        idealTemp: [20, 30],
        idealRain: [150, 300],
        failTempMax: 35,
        failTempMin: 10,
        failRainMax: 500,
        failRainMin: 100,
        regions: ["Assam", "West Bengal", "Tamil Nadu", "Kerala"]
    },
    jute: {
        name: 'Jute',
        idealTemp: [24, 38],
        idealRain: [150, 250],
        failTempMax: 42,
        failTempMin: 20,
        failRainMax: 400,
        failRainMin: 100,
        regions: ["West Bengal", "Bihar", "Assam", "Odisha", "Meghalaya"]
    }
};

/**
 * Super simple AI Logic Risk Predictor
 * @param {string} cropKey - The selected crop (wheat, rice, cotton)
 * @param {number} temp - Temperature in Celsius
 * @param {number} rain - Rainfall in mm
 * @returns {object} - { status: 'healthy' | 'risk' | 'fail', message: string }
 */
function evaluateRisk(cropKey, temp, rain) {
    const crop = CROP_DATA[cropKey];
    if (!crop) return { status: 'fail', message: 'Unknown Crop' };

    let riskLevel = 0; // 0 = healthy, 1 = risk, 2 = fail
    let messages = [];

    // Evaluate Temperature
    if (crop.failTempMax !== undefined && temp >= crop.failTempMax) {
        return { status: 'fail', message: `Critical Failure: Temperature (${temp}°C) exceeds maximum tolerance for ${crop.name}.` };
    }
    if (crop.failTempMin !== undefined && temp <= crop.failTempMin) {
        return { status: 'fail', message: `Critical Failure: Temperature (${temp}°C) is too cold for ${crop.name}.` };
    }
    
    if (temp < crop.idealTemp[0] || temp > crop.idealTemp[1]) {
        riskLevel = Math.max(riskLevel, 1);
        messages.push(`Sub-optimal temperature.`);
    }

    // Evaluate Rainfall
    if (crop.failRainMax !== undefined && rain >= crop.failRainMax) {
         return { status: 'fail', message: `Critical Failure: Rainfall (${rain}mm) caused flooding/damage.` };
    }
    if (crop.failRainMin !== undefined && rain <= crop.failRainMin) {
         return { status: 'fail', message: `Critical Failure: Rainfall (${rain}mm) led to severe drought.` };
    }

    if (rain < crop.idealRain[0] || rain > crop.idealRain[1]) {
        riskLevel = Math.max(riskLevel, 1);
        messages.push(`Sub-optimal rainfall.`);
    }

    // Determine Final output
    if (riskLevel === 0) {
        return { status: 'healthy', message: `Optimal conditions. ${crop.name} is thriving.` };
    } else if (riskLevel === 1) {
        return { status: 'risk', message: `Warning: ${messages.join(" ")} Expected yield reduction.` };
    }

    return { status: 'fail', message: 'Unknown error in logic.' };
}

// Attach to window so other scripts can access
window.CROP_DATA = CROP_DATA;
window.evaluateRisk = evaluateRisk;
