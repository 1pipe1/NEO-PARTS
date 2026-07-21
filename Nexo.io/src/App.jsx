import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./layout/AdminLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuspendedSalesPage from "./pages/SuspendedSalesPage";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <HashRouter>
      <Routes>
        {" "}
        <Route
          path="/login"
          element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />
          }
        />
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="drafts" element={<SuspendedSalesPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
