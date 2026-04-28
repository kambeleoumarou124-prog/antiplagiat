import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - location:', location.pathname);

  if (!isAuthenticated) {
    console.log('ProtectedRoute - not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
