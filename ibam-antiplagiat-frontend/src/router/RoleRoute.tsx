import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function RoleRoute({ roles, children }: {
  roles?: string[];
  children?: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  if (!children) {
    const map: Record<string, string> = {
      ETUDIANT:    "/etudiant/dashboard",
      CHEF_DEPT:   "/chef/dashboard",
      DIR_ADJOINT: "/directeur/dashboard",
      ADMIN:       "/admin/dashboard",
    };
    return <Navigate to={map[user.role] ?? "/login"} replace />;
  }
  
  return <>{children}</>;
}
