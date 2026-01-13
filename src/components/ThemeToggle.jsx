import { useTheme } from "../hooks/useTheme"

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <span className="theme-toggle__icon">{isDark ? "☀️" : "🌙"}</span>
    </button>
  )
}
