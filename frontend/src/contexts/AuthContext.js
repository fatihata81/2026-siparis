import { createContext, useCallback, useContext, useMemo } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
import { userCanAccess } from "../lib/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, loading, login, logout } = useAuthSession();
  const hasPermission = useCallback((permission) => userCanAccess(user, "permissions", permission), [user]);
  const canViewColumn = useCallback((column) => userCanAccess(user, "visible_columns", column), [user]);
  const value = useMemo(() => ({ user, loading, login, logout, hasPermission, canViewColumn }),
    [user, loading, login, logout, hasPermission, canViewColumn]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};