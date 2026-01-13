import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./AppRoutes"
import { ThemeProvider } from "./context/ThemeProvider"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
