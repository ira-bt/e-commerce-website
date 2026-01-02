import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { STORAGE_KEYS, USER_ROLES } from "../utils/enums";
import storageService from "../services/storage.service";

/**
 * AuthProvider
 * Handles auth lifecycle & bootstrap
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = storageService.get(STORAGE_KEYS.AUTH);

      if (storedAuth?.user) {
        setUser(storedAuth.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth bootstrap failed:", error);
      storageService.remove(STORAGE_KEYS.AUTH);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = (userData) => {
    const normalizedUser = {
      ...userData,
      role: userData.role || USER_ROLES.USER,
    };

    storageService.set(STORAGE_KEYS.AUTH, { user: normalizedUser });

    setUser(normalizedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    storageService.remove(STORAGE_KEYS.AUTH);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
}
