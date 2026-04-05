import { useState, useEffect, useCallback } from "react";
import type { Region, ClimateData } from "@/lib/types";
import { fetchRealClimateDataWithRetry } from "@/services/realClimateService";

interface UseRealClimateReturn {
  data: ClimateData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useRealClimate(region: Region): UseRealClimateReturn {
  const [data, setData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRealClimateDataWithRetry({
        region,
        useCache: true,
      });
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch climate data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [region]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}
