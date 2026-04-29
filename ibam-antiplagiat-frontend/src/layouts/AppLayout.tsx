import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  LayoutDashboard, FileText, FileCheck, BarChart3, LogOut, 
  Bell, ChevronRight, ChevronDown, ShieldCheck, Users, 
  Settings, FileText as FileAudit, TrendingUp, Clock
} from "lucide-react";
import { useNotificationsStore } from "@/stores/notifications.store";

const MenuLink = ({ to, icon, label, badge }: { to: string; icon: React.ReactNode; label: string; badge?: number }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#E8A020] text-[#0D1F33]"
          : "hover:bg-white/10 text-white/80"
      }`}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
};

export default function AppLayout() {
  useWebSocket();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  const getInitials = (prenom?: string, nom?: string) => {
    if (!prenom || !nom) return "??";
    return (prenom[0] + nom[0]).toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    const labels: Record<string, string> = {
      "ETUDIANT": "Étudiant",
      "CHEF_DEPT": "Chef de Département",
      "DIR_ADJOINT": "Directeur Adjoint",
      "ADMIN": "Administrateur",
    };
    return labels[role || ""] || role || "";
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-gradient-to-b from-[#0D1F33] to-[#1A3A5C] text-white fixed h-screen overflow-y-auto z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#E8A020] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0D1F33]" />
            </div>
            <div>
              <h3 className="font-serif text-white text-lg font-bold">IBAM</h3>
              <span className="text-xs text-white/70 uppercase tracking-wider">Anti-Plagiat</span>
            </div>
          </div>
        </div>

        <nav className="p-3">
          {user?.role === "ETUDIANT" && (
            <>
              <div className="text-xs text-white/40 uppercase tracking-widest px-3 mb-3 mt-4 font-semibold">MON ESPACE</div>
              <MenuLink to="/etudiant/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Tableau de bord" />
              <MenuLink to="/etudiant/themes" icon={<FileText className="w-5 h-5" />} label="Mes thèmes" />
              <MenuLink to="/etudiant/themes/nouveau" icon={<FileCheck className="w-5 h-5" />} label="Soumettre un thème" />
              <MenuLink to="/etudiant/rapports" icon={<FileText className="w-5 h-5" />} label="Mes rapports" />
              <MenuLink to="/etudiant/rapports/deposer" icon={<ChevronDown className="w-5 h-5" />} label="Déposer un rapport" />
              <div className="text-xs text-white/40 uppercase tracking-widest px-3 mb-3 mt-6 font-semibold">OUTILS</div>
              <MenuLink to="/etudiant/auto-analyse" icon={<Clock className="w-5 h-5" />} label="Auto-analyse" />
            </>
          )}

          {user?.role === "CHEF_DEPT" && (
            <>
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-4">Menu Principal</div>
              <MenuLink to="/chef/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Tableau de bord" />
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-6">Validation</div>
              <MenuLink to="/chef/themes" icon={<FileText className="w-5 h-5" />} label="Thèmes à valider" badge={3} />
              <MenuLink to="/chef/rapports-a-analyser" icon={<FileCheck className="w-5 h-5" />} label="Rapports à analyser" badge={5} />
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-6">Historique</div>
              <MenuLink to="/chef/historique-analyses" icon={<BarChart3 className="w-5 h-5" />} label="Historique analyses" />
            </>
          )}

          {user?.role === "DIR_ADJOINT" && (
            <>
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-4">Menu Principal</div>
              <MenuLink to="/directeur/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Tableau de bord" />
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-6">Gestion</div>
              <MenuLink to="/directeur/sessions" icon={<LayoutDashboard className="w-5 h-5" />} label="Sessions" />
              <MenuLink to="/directeur/rapports" icon={<FileCheck className="w-5 h-5" />} label="Validation Rapports" />
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <div className="text-xs text-white/50 uppercase tracking-widest px-3 mb-2 mt-4">Menu Principal</div>
              <MenuLink to="/admin/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
              <MenuLink to="/admin/utilisateurs" icon={<Users className="w-5 h-5" />} label="Utilisateurs" badge={24} />
              <MenuLink to="/admin/seuils" icon={<Settings className="w-5 h-5" />} label="Configuration seuils" />
              <MenuLink to="/admin/audit" icon={<FileAudit className="w-5 h-5" />} label="Journal d'audit" />
              <MenuLink to="/admin/statistiques" icon={<TrendingUp className="w-5 h-5" />} label="Statistiques" />
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
            <div className="w-10 h-10 bg-[#E8A020] rounded-full flex items-center justify-center font-semibold text-[#0D1F33]">
              {getInitials(user?.prenom, user?.nom)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.prenom} {user?.nom}</div>
              <div className="text-xs text-white/60 truncate">{getRoleLabel(user?.role)}</div>
            </div>
            <button 
              onClick={() => useAuthStore.getState().logout()}
              className="text-white/60 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-[280px]">
        {/* Header */}
        <header className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#64748B]">Accueil</span>
            <ChevronRight className="w-4 h-4 text-[#E2E8F0]" />
            <span className="text-[#1E293B] font-medium">
              {location.pathname.includes("dashboard") && "Dashboard"}
              {location.pathname.includes("utilisateurs") && "Gestion des utilisateurs"}
              {location.pathname.includes("seuils") && "Configuration des seuils"}
              {location.pathname.includes("audit") && "Journal d'audit"}
              {location.pathname.includes("statistiques") && "Statistiques"}
              {location.pathname.includes("themes") && "Thèmes à valider"}
              {location.pathname.includes("rapports") && "Rapports à analyser"}
              {location.pathname.includes("analyses") && "Historique analyses"}
              {location.pathname.includes("sessions") && "Sessions"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors">
              <Bell className="w-5 h-5 text-[#64748B]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors">
              <div className="w-9 h-9 bg-[#1A3A5C] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(user?.prenom, user?.nom)}
              </div>
              <span className="text-sm">{user?.prenom} {user?.nom}</span>
              <ChevronDown className="w-4 h-4 text-[#64748B]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
