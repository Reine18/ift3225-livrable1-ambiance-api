import { useCallback, useEffect, useState } from "react";

import { getLocations } from "../services/locationsService";
import {
  getCachedData,
  setCachedData,
  removeCachedData,
} from "../utils/cache";

const CACHE_KEY = "locations";
const CACHE_DURATION = 5 * 60 * 1000;

function useLocations() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!forceRefresh) {
        const cachedLocations = getCachedData(CACHE_KEY);

        if (cachedLocations) {
          setLocations(cachedLocations);
          setIsLoading(false);
          return;
        }
      }

      const data = await getLocations();
      const normalizedLocations = data ?? [];

      setLocations(normalizedLocations);

      setCachedData(
        CACHE_KEY,
        normalizedLocations,
        CACHE_DURATION
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ??
          "Impossible de récupérer les lieux."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const reload = useCallback(() => {
    removeCachedData(CACHE_KEY);
    loadLocations(true);
  }, [loadLocations]);

  return {
    locations,
    isLoading,
    error,
    reload,
  };
}

export default useLocations;