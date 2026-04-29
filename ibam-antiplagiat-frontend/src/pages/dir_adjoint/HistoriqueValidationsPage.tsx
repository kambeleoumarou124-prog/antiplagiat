import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { rapportsApi } from "@/api/rapports.api";

export default function HistoriqueValidationsPage() {
  const { data: rapports, isLoading } = useQuery({
    queryKey: ["rapports_history"],
    queryFn: async () => {
      const res = await rapportsApi.lister();
      const data = (res.data as any);
      const items = Array.isArray(data) ? data : (data?.results || []);
      // Filter for reports with final decisions
      return items.filter((r: any) => r.decision_finale && r.decision_finale !== "");
    },
  });

  const getTauxColor = (taux: number) => {
    if (taux < 15) return 'text-plagiat-vert';
    if (taux < 30) return 'text-plagiat-orange';
    if (taux < 50) return 'text-plagiat-rouge';
    return 'text-plagiat-critique';
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'VALIDE_DEF':
        return (
          <Badge className="bg-green-100 text-green-700 border-none text-xs">
            Validé définitif
          </Badge>
        );
      case 'REFUSE_DEF':
        return (
          <Badge className="bg-red-100 text-red-700 border-none text-xs">
            Refusé définitif
          </Badge>
        );
      case 'EN_REVISION':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">
            En révision
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-600 border-none text-xs">
            —
          </Badge>
        );
    }
  };

  const getChefDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'VALIDE':
        return (
          <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
            Validé
          </Badge>
        );
      case 'REFUSE':
        return (
          <Badge className="bg-red-100 text-red-700 border-none text-xs">
            Refusé
          </Badge>
        );
      case 'CORRECTIONS':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">
            Corrections
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-600 border-none text-xs">
            —
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-primary-dark">Historique des validations</h1>
        <p className="text-sm text-muted-foreground">Consultation de l'ensemble des décisions finales</p>
      </div>

      {/* History Table Card */}
      <Card className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary-dark">Historique complet</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Exporter
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Étudiant</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Titre</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Décision Chef</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Décision Finale</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Taux</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Signé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                </TableCell>
              </TableRow>
            ) : rapports && rapports.length > 0 ? (
              rapports.map((rapport: any, index: number) => {
                const taux = rapport.taux_similarite_global || 0;
                const tauxColor = getTauxColor(taux);
                const isSigned = rapport.signature?.valide;
                
                return (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-xs">
                      {rapport.date_decision_finale ? new Date(rapport.date_decision_finale).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{rapport.etudiant_nom || "—"}</TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate">{rapport.titre || "—"}</TableCell>
                    <TableCell>
                      {getChefDecisionBadge(rapport.decision_chef)}
                    </TableCell>
                    <TableCell>
                      {getDecisionBadge(rapport.decision_finale)}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold font-mono ${tauxColor}`}>{taux}%</span>
                    </TableCell>
                    <TableCell>
                      {isSigned ? (
                        <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                          ✓ Signé
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucun historique disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Affichage de 1 à {rapports?.length || 0} sur {rapports?.length || 0} validations
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs bg-primary text-white border-primary">
              1
            </Button>
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs">
              3
            </Button>
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs">
              4
            </Button>
            <Button variant="outline" size="sm" className="w-7 h-7 p-0 text-xs">
              5
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
