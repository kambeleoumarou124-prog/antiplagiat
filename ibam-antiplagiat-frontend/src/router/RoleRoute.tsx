import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function RoleRoute({ roles, children }: {
  roles?: string[];
  children?: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  console.log('RoleRoute - user:', user);
  console.log('RoleRoute - roles:', roles);
  
  if (!user) {
    console.log('RoleRoute - no user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  if (roles && !roles.includes(user.role)) {
    console.log('RoleRoute - user role', user.role, 'not in', roles, ', redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  if (!children) {
    const map: Record<string, string> = {
      ETUDIANT:    "/etudiant/dashboard",
      CHEF_DEPT:   "/chef/dashboard",
      DIR_ADJOINT: "/directeur/dashboard",
      ADMIN:       "/admin/dashboard",
    };
    const target = map[user.role] ?? "/login";
    console.log('RoleRoute - redirecting to:', target);
    return <Navigate to={target} replace />;
  }
  
  return <>{children}</>;
}
