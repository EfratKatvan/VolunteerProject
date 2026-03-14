import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import DashboardAdmin from "./pages/DashboardAdmin";
import AuthGuard from "./auth/AuthGuard";
import { AuthProvider } from "./auth/AuthContext";
import { Paths } from "./routes/paths";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<LoginAdmin />} />
          <Route path={`/${Paths.login}`} element={<LoginAdmin />} />
          <Route
            path={`/${Paths.dashboard}`}
            element={
              <AuthGuard requireAdmin>
                <DashboardAdmin />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

