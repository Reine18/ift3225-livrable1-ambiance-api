import httpClient from "../api/httpClient";
import { removeCachedData } from "../utils/cache";

export async function getObservations() {
  const response = await httpClient.get("/observations");

  return response.data.data;
}

export async function createObservation(observationData, token) {
  const response = await httpClient.post(
    "/observations",
    observationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const locationId =
    observationData.locationId ??
    observationData.location;

  if (locationId) {
    removeCachedData(`summary:${locationId}`);
    removeCachedData(`history:${locationId}`);
    removeCachedData(`quiet-hours:${locationId}`);
    removeCachedData(`forecast:${locationId}`);
  }

  return response.data.data;
}