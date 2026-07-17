import httpClient from "../api/httpClient";

export async function getLocations() {
  const response = await httpClient.get("/locations");

  return response.data;
}