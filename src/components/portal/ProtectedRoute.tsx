import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  clientAdminAllowed?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false, clientAdminAllowed = false }: ProtectedRouteProps) {
  const { user, isAdmin, isClientAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/portal/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/portal" replace />;
  if (clientAdminAllowed && !isAdmin && !isClientAdmin) return <Navigate to="/portal" replace />;

  return <>{children}</>;
}
