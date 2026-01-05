import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES } from "../utils/enums";
import { ROUTES } from "../utils/routes";

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <nav className="navbar">
      {isAuthenticated && (
        <div className="navbar__content">
          <NavLink to={ROUTES.HOME}>Home</NavLink>
          <NavLink to={ROUTES.CHECKOUT}>Checkout</NavLink>

          {role === USER_ROLES.ADMIN && (
            <NavLink to={ROUTES.ADMIN}>Admin</NavLink>
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
