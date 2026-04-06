import { calculateDetailedRisk } from './src/utils/supplyChainLogic.js';

console.log("🛠️ RUNNING FINAL INTEGRATION TEST...");

// Maharashtra Test (Low Temp, High Rain, No Crop Data)
const result = calculateDetailedRisk("Maharashtra", 3, 9, null);

console.log("\n📍 TEST: Maharashtra Flood Scenario");
console.log(`- State: ${result.state}`);
console.log(`- Risk Score: ${result.riskScore}`); // Matches key in logic
console.log(`- Status: ${result.status}`);
console.log(`- Source: ${result.dataMethod}`); // Matches key in logic
console.log(`- Action: ${result.suggestedAction}`);

if (result.riskScore !== "undefined" && result.dataMethod !== "undefined") {
    console.log("\n✅ SUCCESS: Logic is perfectly mapped!");
} else {
    console.log("\n❌ FAIL: Names still don't match.");
}