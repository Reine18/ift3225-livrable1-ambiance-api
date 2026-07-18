import httpClient from "../api/httpClient";

// TODO API CONTRACT : confirmer si les endpoints utilisent
// l’identifiant, le nom ou le slug du lieu.

// TODO API CONTRACT : vérifier la structure exacte de la réponse
// retournée par l’endpoint summary.
export async function getAmbianceSummary(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/summary`
  );

  return response.data;
}

// TODO API CONTRACT : vérifier la structure exacte de la réponse
// retournée par l’endpoint history.
export async function getAmbianceHistory(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/history`
  );

  return response.data;
}

// TODO API CONTRACT : vérifier la structure exacte de la réponse
// retournée par l’endpoint quiet-hours.
export async function getQuietHours(location) {
  const response = await httpClient.get(
    `/ambiance/${encodeURIComponent(location)}/quiet-hours`
  );

  return response.data;
}