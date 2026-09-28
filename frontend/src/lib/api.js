import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
if (!backendUrl) throw new Error("REACT_APP_BACKEND_URL yapılandırılmalıdır");

export const api = axios.create({ baseURL: `${backendUrl}/api` });
export const isCancelledRequest = axios.isCancel;

export const getApiErrorMessage = (error, fallback) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join("; ") || fallback;
  return fallback;
};