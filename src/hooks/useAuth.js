import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
/**
 * useAuth
 * Purpose:
 * - Safe access to AuthContext
 * - Prevent usage outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
