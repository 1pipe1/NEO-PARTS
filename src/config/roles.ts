// src/config/roles.ts
export type Role = "admin" | "seller" | "pending";

type RoutePermission = {
  path: string;
  allowedRoles: Role[];
};

export const routePermissions: RoutePermission[] = [
  {
    path: "/",
    allowedRoles: ["admin", "seller", "pending"],
  },
  {
    path: "/checkout",
    allowedRoles: ["admin", "seller"], // pending no puede vender
  },
  {
    path: "/admin",
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/users",
    allowedRoles: ["admin"],  
  },
  {
    path: "/admin/stock",
    allowedRoles: ["admin"], // seller, ver y no editar
  },
  {
    path: "/admin/sales",
    allowedRoles: ["admin", "seller"], //  no puede cancelar una orden, solo ver detalle orden"
  },
  {
    path: "/admin/dashboard",
    allowedRoles: ["admin"],
  },
  {
    path: "/admin/drafts",
    allowedRoles: ["admin", "seller"],
  },
];

export const canAccessRoute = (role: Role | null, path: string): boolean => {
  const route = routePermissions.find((r) => r.path === path);
  if (!route) return false; // ruta no conocida -> mejor bloquear
  if (!role) return false; // sin rol -> no hay acceso
  return route.allowedRoles.includes(role);
};