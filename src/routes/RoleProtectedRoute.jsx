import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/routes";

export default function RoleProtectedRoute({ allowedRoles }) {
  const { role, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return null;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
