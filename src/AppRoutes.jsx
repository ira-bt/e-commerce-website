import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import { USER_ROLES } from "./utils/enums";

// TEMP placeholder pages
const Login = () => <h2>Login Page</h2>;
const Home = () => <h2>Home</h2>;
const Checkout = () => <h2>Checkout</h2>;
const Admin = () => <h2>Admin</h2>;
const Unauthorized = () => <h2>Unauthorized</h2>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* Admin-only */}
      <Route
        element={
          <RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />
        }
      >
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
