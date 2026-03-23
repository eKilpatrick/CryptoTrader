import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    const message: string =
      typeof detail === "string"
        ? detail
        : typeof detail?.detail === "string"
        ? detail.detail
        : error?.response?.data?.message ??
          error?.message ??
          "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
