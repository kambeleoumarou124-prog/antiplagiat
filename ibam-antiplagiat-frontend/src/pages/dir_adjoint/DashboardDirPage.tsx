import { StatCard } from "@/components/ui/StatCard";
import { Users, FileSignature, Database, Activity } from "lucide-react";

export default function DashboardDirPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-tight">Tableau de bord - Directeur Adjoint</h1>
        <p className="text-muted-foreground">Vue globale sur les sessions et les validations finales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Rapports à signer"
          value="12"
          icon={<FileSignature className="w-6 h-6 text-blue-500" />}
          description="En attente de validation finale"
          className="hover-lift border-l-4 border-l-blue-500 shadow-md bg-white"
        />
        <StatCard
          title="Sessions actives"
          value="2"
          icon={<Activity className="w-6 h-6 text-purple-500" />}
          description="Sessions académiques en cours"
          className="hover-lift border-l-4 border-l-purple-500 shadow-md bg-white"
        />
        <StatCard
          title="Total Étudiants"
          value="240"
          icon={<Users className="w-6 h-6 text-slate-500" />}
          description="Étudiants inscrits"
          className="hover-lift border-l-4 border-l-slate-500 shadow-md bg-white"
        />
        <StatCard
          title="Analyses NLP effectuées"
          value="854"
          icon={<Database className="w-6 h-6 text-green-500" />}
          description="Analyses effectuées"
          className="hover-lift border-l-4 border-l-green-500 shadow-md bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass border border-border/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm">
          <h3 className="font-semibold mb-4 text-primary font-serif text-lg">Actions requises</h3>
          <p className="text-muted-foreground text-sm">Vous avez 12 rapports en attente de signature cryptographique définitive.</p>
        </div>
      </div>
    </div>
  );
}
