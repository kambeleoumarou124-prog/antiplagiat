import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useWebSocket } from "@/hooks/useWebSocket";
import { LayoutDashboard, LogOut, Settings, Bell } from "lucide-react";
import { useNotificationsStore } from "@/stores/notifications.store";

const MenuLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-primary text-white shadow-lg shadow-primary/30 font-medium border-l-4 border-l-accent"
          : "hover:bg-white/5 hover:text-white text-slate-300 border-l-4 border-l-transparent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default function AppLayout() {
  useWebSocket();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-72 bg-primary-dark text-slate-300 flex flex-col shadow-2xl z-20 transition-all duration-300 relative border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 pointer-events-none"></div>
        <div className="h-20 flex items-center px-6 border-b border-white/10 relative z-10 bg-gradient-to-r from-primary-dark to-primary">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center mr-3 shadow-lg shadow-accent/20">
            <span className="font-serif font-bold text-white text-lg tracking-wider">IB</span>
          </div>
          <div>
            <h1 className="font-serif text-white text-lg font-bold tracking-wide">IBAM</h1>
            <p className="text-[10px] text-accent font-mono uppercase tracking-widest">Anti-Plagiat</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
          
          {user?.role === "ETUDIANT" && (
            <>
              <MenuLink to="/etudiant/dashboard" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Tableau de bord" />
              <MenuLink to="/etudiant/themes" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Mes Thèmes" />
              <MenuLink to="/etudiant/rapports" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Mes Rapports" />
            </>
          )}

          {user?.role === "CHEF_DEPT" && (
            <>
              <MenuLink to="/chef/dashboard" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Tableau de bord" />
              <MenuLink to="/chef/themes" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Thèmes à valider" />
              <MenuLink to="/chef/rapports" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Rapports à analyser" />
            </>
          )}

          {user?.role === "DIR_ADJOINT" && (
            <>
              <MenuLink to="/directeur/dashboard" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Tableau de bord" />
              <MenuLink to="/directeur/sessions" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Sessions" />
              <MenuLink to="/directeur/rapports" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Validation Rapports" />
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <MenuLink to="/admin/dashboard" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Tableau de bord" />
              <MenuLink to="/admin/utilisateurs" icon={<LayoutDashboard className="w-5 h-5 mr-3" />} label="Utilisateurs" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 relative z-10 bg-black/10">
          <div className="flex items-center px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border border-white/20 shadow-inner">
              {user?.prenom?.[0] || "?"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => useAuthStore.getState().logout()}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary-light/5 blur-[100px] pointer-events-none rounded-full"></div>

        <header className="h-20 glass border-b border-border/50 flex items-center justify-between px-8 z-10 sticky top-0">
          <h2 className="font-serif text-2xl font-bold text-primary tracking-tight">Vue d'ensemble</h2>
          
          <div className="flex items-center space-x-3">
            <button className="relative p-2.5 text-slate-500 hover:text-primary transition-colors hover:bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            <button className="p-2.5 text-slate-500 hover:text-primary transition-colors hover:bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 relative z-0">
          <div className="max-w-7xl mx-auto animate-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
