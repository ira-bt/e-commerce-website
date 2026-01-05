import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/routes";

export default function PublicRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return null;

  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
}
