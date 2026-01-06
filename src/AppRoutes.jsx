import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import { USER_ROLES } from "./utils/enums";
import { ROUTES } from "./utils/routes";
import Login from "./pages/Login/Login";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./layout/AppLayout";
import ProductsPage from "./pages/Products/ProductPage";

// TEMP placeholder pages
//const Login = () => <h2>Login Page</h2>;
//const Home = () => <h2>Home</h2>;
const Checkout = () => <h2>Checkout</h2>;
const Admin = () => <h2>Admin</h2>;
const Unauthorized = () => <h2>Unauthorized</h2>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<ProductsPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>  

      {/* Logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout/>}>
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        </Route>
        
      </Route>

      {/* Admin-only */}
      <Route
        element={
          <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />
        }
      >
        <Route element={<AppLayout/>}>
            <Route path={ROUTES.ADMIN} element={<Admin />} />
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
    </Routes>
  );
}
