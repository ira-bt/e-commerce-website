import { Routes, Route } from "react-router-dom"
import RoleProtectedRoute from "./routes/RoleProtectedRoute"
import { USER_ROLES } from "./utils/enums"
import { ROUTES } from "./utils/routes"
import Login from "./pages/Login/Login"
import PublicRoute from "./routes/PublicRoute"
import AppLayout from "./layout/AppLayout"
import ProductsPage from "./pages/Products/ProductPage"
import Register from "./pages/Register/Register"
import Cart from "./pages/Cart/Cart"
import AdminPanel from "./pages/Admin/AdminPanel"

// TEMP placeholder pages
const Unauthorized = () => <h2>Unauthorized</h2>

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<ProductsPage />} />
      </Route>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={[USER_ROLES.USER]} />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.CART} element={<Cart />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.ADMIN} element={<AdminPanel />} />
        </Route>
      </Route>

      <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
    </Routes>
  )
}
