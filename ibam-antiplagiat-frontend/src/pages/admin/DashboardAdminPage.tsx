import { StatCard } from "@/components/ui/StatCard";
import { Users, Server, ShieldAlert, Cpu } from "lucide-react";

export default function DashboardAdminPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Tableau de bord - Administration</h1>
        <p className="text-muted-foreground">Surveillance du système et des ressources NLP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs Actifs"
          value="240"
          icon={<Users className="w-6 h-6 text-blue-500" />}
          description="Utilisateurs connectés cette semaine"
          className="hover-lift border-l-4 border-l-blue-500 shadow-md bg-white"
        />
        <StatCard
          title="État Serveur"
          value="Normal"
          icon={<Server className="w-6 h-6 text-green-500" />}
          description="Tous les services opérationnels"
          className="hover-lift border-l-4 border-l-green-500 shadow-md bg-white"
        />
        <StatCard
          title="Erreurs Extraction"
          value="3"
          icon={<ShieldAlert className="w-6 h-6 text-red-500" />}
          description="Erreurs dans les dernières 24h"
          className="hover-lift border-l-4 border-l-red-500 shadow-md bg-white"
        />
        <StatCard
          title="Charge NLP"
          value="12%"
          icon={<Cpu className="w-6 h-6 text-purple-500" />}
          description="Utilisation des ressources NLP"
          className="hover-lift border-l-4 border-l-purple-500 shadow-md bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="font-semibold mb-4 text-primary font-serif text-lg">Logs Récents</h3>
          <ul className="space-y-3 text-sm font-mono text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">[INFO]</span>
              <span className="text-muted-foreground">Tâche NLP celery réussie (Rapport #12)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">[WARN]</span>
              <span className="text-muted-foreground">Connexion échouée depuis 192.168.1.5</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">[INFO]</span>
              <span className="text-muted-foreground">Nouvelle session académique créée</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
