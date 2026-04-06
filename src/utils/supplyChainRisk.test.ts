import { describe, expect, it } from "vitest";
import {
  calibrateLiveClimateScores,
  calculateDetailedRisk,
  getClimateRegionForState,
  normalizeSupplyLocation,
} from "@/utils/supplyChainRisk";

describe("supplyChainRisk", () => {
  it("returns full coverage for configured states", () => {
    const result = calculateDetailedRisk("Punjab", 5, 5, 5);

    expect(result.modelCoverage).toBe("FULL");
    expect(result.isFallbackModel).toBe(false);
  });

  it("returns limited coverage for unsupported states", () => {
    const result = calculateDetailedRisk("Tamil Nadu", 5, 5, 5);

    expect(result.modelCoverage).toBe("LIMITED");
    expect(result.isFallbackModel).toBe(true);
  });

  it("treats crop score of 0 as a valid input", () => {
    const result = calculateDetailedRisk("Punjab", 5, 5, 0);

    expect(result.dataMethod).toBe("Manual Inputs");
    expect(Number(result.riskScore)).toBeLessThan(5);
  });

  it("falls back to historical crop backup when crop input is missing", () => {
    const result = calculateDetailedRisk("Punjab", 5, 5, undefined, {
      dataMethod: "Live Climate Feed + Manual Crop",
    });

    expect(result.dataMethod).toContain("Historical Crop Backup");
  });

  it("maps supported states to climate regions", () => {
    expect(getClimateRegionForState("West Bengal")).toBe("west bengal");
    expect(getClimateRegionForState("UP")).toBe("uttar pradesh");
    expect(getClimateRegionForState("Tamil Nadu")).toBeNull();
  });

  it("normalizes state and district names for district-ready flow", () => {
    const normalized = normalizeSupplyLocation(
      "  Uttar   Pradesh ",
      "prayagraj",
    );

    expect(normalized.normalizedState).toBe("uttar pradesh");
    expect(normalized.displayState).toBe("Uttar Pradesh");
    expect(normalized.displayDistrict).toBe("Prayagraj");
  });

  it("returns location label with district when provided", () => {
    const result = calculateDetailedRisk("Punjab", 6, 5, 4, {
      district: "Ludhiana",
    });

    expect(result.locationLabel).toBe("Ludhiana, Punjab");
  });

  it("calibrates live climate scores into bounded temp/rain values", () => {
    const result = calibrateLiveClimateScores({
      annualAvgTemp: 31.2,
      droughtRisk: 7.4,
      floodRisk: 3.1,
      climateRiskScore: 6.2,
      rainfallTrend: "decreasing",
      riseIndicator: true,
    });

    expect(result.tempScore).toBeGreaterThan(5);
    expect(result.rainScore).toBeGreaterThan(4);
    expect(result.tempScore).toBeLessThanOrEqual(10);
    expect(result.rainScore).toBeLessThanOrEqual(10);
  });

  it("applies district modifier for configured districts", () => {
    const withoutDistrict = calculateDetailedRisk("Punjab", 6, 5, 4);
    const withDistrict = calculateDetailedRisk("Punjab", 6, 5, 4, {
      district: "Ludhiana",
    });

    expect(withDistrict.districtAdjustment).toBeGreaterThan(0);
    expect(Number(withDistrict.riskScore)).toBeGreaterThan(
      Number(withoutDistrict.riskScore),
    );
    expect(withDistrict.dataMethod).toContain("District Modifier");
  });

  it("keeps neutral adjustment for non-configured districts", () => {
    const withoutDistrict = calculateDetailedRisk("Punjab", 6, 5, 4);
    const withUnknownDistrict = calculateDetailedRisk("Punjab", 6, 5, 4, {
      district: "Hoshiarpur",
    });

    expect(withUnknownDistrict.districtAdjustment).toBe(0);
    expect(withUnknownDistrict.riskScore).toBe(withoutDistrict.riskScore);
  });
});
