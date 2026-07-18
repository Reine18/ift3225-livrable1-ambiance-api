import { useCallback, useEffect, useState } from "react";

import {
  getAmbianceForecast,
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
  const [forecast, setForecast] = useState([]);

  const loadLocationDetails = useCallback(async () => {
    if (!locationId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [
        summaryData,
        historyData,
        quietHoursData,
        forecastData,
      ] = await Promise.all([
        getAmbianceSummary(locationId),
        getAmbianceHistory(locationId),
        getQuietHours(locationId),
        getAmbianceForecast(locationId),
      ]);

      setSummary(summaryData ?? null);
      setHistory(historyData ?? []);
      setQuietHours(quietHoursData ?? []);
      setForecast(forecastData ?? []);
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