import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export async function getJson<T>(path: string): Promise<T> {
  const response = await apiClient.get<T>(path);
  return response.data;
}
getJson;
export async function postJson<TResponse, TBody = undefined>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  const response = await apiClient.post<TResponse>(path, body);
  return response.data;
}
