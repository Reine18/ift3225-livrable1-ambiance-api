import { useEffect, useState } from "react";

import { getObservations } from "../services/observationService";

function useMyPlaces(user) {
  const [myPlaces, setMyPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMyPlaces() {
      try {
        setIsLoading(true);
        setError(null);

        const observations = await getObservations();

        const seen = {};
        const places = [];

        for (const observation of observations ?? []) {
          if (
            observation.author &&
            observation.author._id === user?.id
          ) {
            const locationId = observation.locationId
              ? observation.locationId._id
              : observation.location;

            if (!seen[locationId]) {
              seen[locationId] = true;

              places.push({
                locationId,
                locationName: observation.locationId
                  ? observation.locationId.name
                  : observation.location,
              });
            }
          }
        }

        setMyPlaces(places);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ??
            "Impossible de charger les lieux."
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadMyPlaces();
    } else {
      setMyPlaces([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    myPlaces,
    isLoading,
    error,
  };
}

export default useMyPlaces;