// ejemplo simple de ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { canAccessRoute, type Role } from "../config/roles";
import type { ReactElement } from "react";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role: Role | null = user?.role ?? null;

  if (!canAccessRoute(role, location.pathname)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          message:
            "No se admite el ingreso por tu rol. Pide acceso al administrador del negocio.",
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
