import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import { ROUTES } from "../utils/routes";
// import { replace } from "formik";

export default function ProtectedRoute(){
    const {isAuthenticated, isInitializing} = useAuth();

    if(isInitializing) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}