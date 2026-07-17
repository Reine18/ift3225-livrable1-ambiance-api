import httpClient from "../api/httpClient";

export async function getAmbianceSummary(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/summary`
  );

  return response.data;
}

export async function getAmbianceHistory(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/history`
  );

  return response.data;
}

export async function getQuietHours(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/quiet-hours`
  );

  return response.data;
}