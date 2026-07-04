import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/organisms/AdminSidebar";
import useAuthStore from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const AdminLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 pb-24 md:pb-8 overflow-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
