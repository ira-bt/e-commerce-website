import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { USER_ROLES } from "../utils/enums"
import { ROUTES } from "../utils/routes"
import { useState } from "react"
import clsx from "classnames"
import ThemeToggle from "../components/ThemeToggle"

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate(ROUTES.HOME, { replace: true })
  }

  const closeMenu = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__logo" onClick={() => navigate(ROUTES.HOME)}>
          FakeStore
        </div>
         
        <div className="navbar__actions">
          <ThemeToggle />
          <button className="navbar__toggle" onClick={() => setOpen(!open)}>
            ☰
          </button>
        </div>
        
        {/* Links */}
        <nav
          className={clsx("navbar__menu", {
            "is-open": open,
            "is-admin": isAuthenticated && role === USER_ROLES.ADMIN,
          })}
        > 
          {/* GUEST */}
          {!isAuthenticated && (
            <>
              <NavLink to={ROUTES.LOGIN} className="navbar__link navbar__link--button" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink
                to={ROUTES.REGISTER}
                className="navbar__link navbar__link--button navbar__link--secondary"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}

          {/* USER */}
          {isAuthenticated && role === USER_ROLES.USER && (
            <>
              <NavLink to={ROUTES.CART} onClick={closeMenu}>
                Cart
              </NavLink>
              <NavLink to={ROUTES.PROFILE} onClick={closeMenu}>
                Profile
              </NavLink>
              <span className="navbar__username">{user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          {/* ADMIN */}
          {isAuthenticated && role === USER_ROLES.ADMIN && (
            <>
              <NavLink to={ROUTES.ADMIN} onClick={closeMenu}>
                Admin
              </NavLink>
              <span className="navbar__username navbar__username--admin">{user?.username}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
