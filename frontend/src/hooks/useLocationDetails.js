import { useCallback, useEffect, useState } from "react";

import {
  getAmbianceHistory,
  getAmbianceSummary,
  getQuietHours,
} from "../services/ambianceService";

function useLocationDetails(locationId) {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [quietHours, setQuietHours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocationDetails = useCallback(async () => {
    if (!locationId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [
        summaryResponse,
        historyResponse,
        quietHoursResponse,
      ] = await Promise.all([
        getAmbianceSummary(locationId),
        getAmbianceHistory(locationId),
        getQuietHours(locationId),
      ]);

      setSummary(summaryResponse.data ?? null);
      setHistory(historyResponse.data ?? []);
      setQuietHours(quietHoursResponse.data ?? []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Impossible de récupérer le portrait du lieu."
      );
    } finally {
      setIsLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    loadLocationDetails();
  }, [loadLocationDetails]);

  return {
    summary,
    history,
    quietHours,
    isLoading,
    error,
    reload: loadLocationDetails,
  };
}

export default useLocationDetails;