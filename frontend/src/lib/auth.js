import { api } from "./api";

const STORAGE_KEY = "user";

export const readStoredUser = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
export const storeUser = (user) => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
export const removeStoredUser = () => window.localStorage.removeItem(STORAGE_KEY);
export const authenticateUser = async (username, password) => {
  const { data } = await api.post("/auth/login", { username, password });
  return data;
};

export const userCanAccess = (user, field, value) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return Boolean(user[field]?.includes(value));
};