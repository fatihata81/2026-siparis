import { useCallback, useEffect, useState } from "react";
import { authenticateUser, readStoredUser, removeStoredUser, storeUser } from "../lib/auth";
import { getApiErrorMessage } from "../lib/api";

export const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const userData = await authenticateUser(username, password);
      storeUser(userData);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: getApiErrorMessage(error, "Giriş başarısız") };
    }
  }, []);
  const logout = useCallback(() => {
    removeStoredUser();
    setUser(null);
  }, []);
  return { user, loading, login, logout };
};