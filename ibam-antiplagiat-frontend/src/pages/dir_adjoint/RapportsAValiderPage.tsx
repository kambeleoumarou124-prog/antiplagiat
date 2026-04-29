import { useQuery } from "@tanstack/react-query";
import { rapportsApi } from "@/api/rapports.api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RapportStage } from "@/types/rapport.types";

export default function RapportsAValiderPage() {
  const navigate = useNavigate();

  const { data: rapports, isLoading } = useQuery({
    queryKey: ["rapports_to_validate_dir"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      return items.filter((r: RapportStage) => r.statut === "DECISION_CHEF");
    },
  });

  const getTauxColor = (taux: number) => {
    if (taux < 15) return { bg: 'bg-plagiat-vert', text: 'text-plagiat-vert' };
    if (taux < 30) return { bg: 'bg-plagiat-orange', text: 'text-plagiat-orange' };
    if (taux < 50) return { bg: 'bg-plagiat-rouge', text: 'text-plagiat-rouge' };
    return { bg: 'bg-plagiat-critique', text: 'text-plagiat-critique' };
  };

  const getDecisionBadge = (statut: string) => {
    switch (statut) {
      case 'VALIDE_CHEF':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
            <span className="w-1 h-1 rounded-full bg-purple-500 mr-1"></span>
            Validé
          </Badge>
        );
      case 'REFUSE_CHEF':
        return (
          <Badge className="bg-red-100 text-red-700 border-none text-xs">
            <span className="w-1 h-1 rounded-full bg-red-500 mr-1"></span>
            Refusé
          </Badge>
        );
      case 'EN_REVISION':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">
            <span className="w-1 h-1 rounded-full bg-yellow-500 mr-1"></span>
            Corrections
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-600 border-none text-xs">
            En attente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-primary-dark">Rapports en attente</h1>
        <p className="text-sm text-muted-foreground">Validez les rapports ayant reçu la décision du Chef de Département</p>
      </div>

      {/* Rapports Table Card */}
      <Card className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary-dark">Tous les rapports</h3>
          <div className="relative w-48">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10 bg-white border-border text-xs h-9"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Étudiant</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Titre</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Décision Chef</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Taux</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date décision chef</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                </TableCell>
              </TableRow>
            ) : rapports && rapports.length > 0 ? (
              rapports.map((rapport: any, index: number) => {
                const taux = rapport.taux_similarite || 0;
                const tauxColor = getTauxColor(taux);
                const isValidated = rapport.statut === 'VALIDE_CHEF';
                
                return (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-sm">{rapport.etudiant_nom || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[220px] truncate">{rapport.titre || "—"}</TableCell>
                    <TableCell>
                      {getDecisionBadge(rapport.statut)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-[70px] h-1 bg-border rounded-full overflow-hidden">
                          <div className={`h-full ${tauxColor.bg}`} style={{ width: `${Math.min(taux, 100)}%` }}></div>
                        </div>
                        <span className={`text-xs font-semibold font-mono ${tauxColor.text}`}>{taux}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {rapport.date_decision_chef ? new Date(rapport.date_decision_chef).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        className={isValidated ? "bg-primary hover:bg-primary-dark text-xs" : "text-xs"}
                        variant={isValidated ? "default" : "outline"}
                        onClick={() => navigate(`/dir-adjoint/rapports/${rapport.id}`)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {isValidated ? "Valider" : "Voir"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Aucun rapport en attente de validation.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Affichage de 1 à {rapports?.length || 0} sur {rapports?.length || 0} rapports
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs bg-primary text-white border-primary">
              1
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
