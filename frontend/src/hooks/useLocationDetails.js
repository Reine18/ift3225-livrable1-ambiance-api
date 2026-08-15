import { useCallback, useEffect, useState } from "react";

import {
  getAmbianceForecast,
  getAmbianceHistory,
  getAmbianceSummary,
  getQuietHours,
} from "../services/ambianceService";

import {
  getCachedData,
  setCachedData,
  removeCachedData,
} from "../utils/cache";

const SUMMARY_CACHE_DURATION = 1 * 60 * 1000;
const HISTORY_CACHE_DURATION = 2 * 60 * 1000;
const QUIET_HOURS_CACHE_DURATION = 5 * 60 * 1000;
const FORECAST_CACHE_DURATION = 1 * 60 * 1000;

function useLocationDetails(locationId) {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [quietHours, setQuietHours] = useState([]);
  const [forecast, setForecast] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocationDetails = useCallback(
    async (forceRefresh = false) => {
      if (!locationId) {
        setSummary(null);
        setHistory([]);
        setQuietHours([]);
        setForecast([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const summaryKey = `summary:${locationId}`;
        const historyKey = `history:${locationId}`;
        const quietHoursKey = `quiet-hours:${locationId}`;
        const forecastKey = `forecast:${locationId}`;

        let summaryData = null;
        let historyData = null;
        let quietHoursData = null;
        let forecastData = null;

        if (!forceRefresh) {
          summaryData = getCachedData(summaryKey);
          historyData = getCachedData(historyKey);
          quietHoursData = getCachedData(quietHoursKey);
          forecastData = getCachedData(forecastKey);
        }

        const requests = [];

        if (summaryData === null) {
          requests.push(
            getAmbianceSummary(locationId).then((data) => {
              summaryData = data ?? null;

              setCachedData(
                summaryKey,
                summaryData,
                SUMMARY_CACHE_DURATION
              );
            })
          );
        }

        if (historyData === null) {
          requests.push(
            getAmbianceHistory(locationId).then((data) => {
              historyData = data ?? [];

              setCachedData(
                historyKey,
                historyData,
                HISTORY_CACHE_DURATION
              );
            })
          );
        }

        if (quietHoursData === null) {
          requests.push(
            getQuietHours(locationId).then((data) => {
              quietHoursData = data ?? [];

              setCachedData(
                quietHoursKey,
                quietHoursData,
                QUIET_HOURS_CACHE_DURATION
              );
            })
          );
        }

        if (forecastData === null) {
          requests.push(
            getAmbianceForecast(locationId).then((data) => {
              forecastData = data ?? [];

              setCachedData(
                forecastKey,
                forecastData,
                FORECAST_CACHE_DURATION
              );
            })
          );
        }

        await Promise.all(requests);

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
    },
    [locationId]
  );

  useEffect(() => {
    loadLocationDetails();
  }, [loadLocationDetails]);

  const reload = useCallback(() => {
    if (!locationId) {
      return;
    }

    removeCachedData(`summary:${locationId}`);
    removeCachedData(`history:${locationId}`);
    removeCachedData(`quiet-hours:${locationId}`);
    removeCachedData(`forecast:${locationId}`);

    loadLocationDetails(true);
  }, [locationId, loadLocationDetails]);

  return {
    summary,
    history,
    quietHours,
    forecast,
    isLoading,
    error,
    reload,
  };
}

export default useLocationDetails;