import { useState, useEffect, useCallback } from "react";
import type { Region, ClimateData } from "@/lib/types";
import { getClimateData } from "@/lib/climate";

export function useClimate(region: Region) {
  const [data, setData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const result = getClimateData(region);
    setData(result);
    setLoading(false);
  }, [region]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh };
}
