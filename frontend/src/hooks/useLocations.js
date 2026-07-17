import { useCallback, useEffect, useState } from "react";

import { getLocations } from "../services/locationsService";

function useLocations() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getLocations();

      setLocations(response.data ?? []);
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

  return {
    locations,
    isLoading,
    error,
    reload: loadLocations,
  };
}

export default useLocations;