import httpClient from "../api/httpClient";

export async function registerUser(userData) {
  const response = await httpClient.post(
    "/users/register",
    userData
  );

  return response.data;
}

export async function loginUser(credentials) {
  const response = await httpClient.post(
    "/users/login",
    credentials
  );

  return response.data;
}