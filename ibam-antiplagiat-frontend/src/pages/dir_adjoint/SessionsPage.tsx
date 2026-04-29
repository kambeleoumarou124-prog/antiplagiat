import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { sessionsApi } from "@/api/sessions.api";
import { useNavigate } from "react-router-dom";

export default function SessionsPage() {
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await sessionsApi.lister();
      const data = (res.data as any);
      return Array.isArray(data) ? data : (data?.results || []);
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-primary-dark">Gestion des sessions</h1>
        <p className="text-sm text-muted-foreground">Gérez les sessions académiques (thèmes et rapports)</p>
      </div>

      {/* Sessions Table Card */}
      <Card className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary-dark">Toutes les sessions</h3>
          <Button size="sm" onClick={() => navigate('/dir-adjoint/ouvrir-session')}>
            <Plus className="w-3 h-3 mr-1" />
            Nouvelle session
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Promotion</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ouverture</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fermeture</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statut</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Soumissions</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</TableHead>
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
            ) : sessions && sessions.length > 0 ? (
              sessions.map((session: any, index: number) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-sm">
                    {session.type === "SESSION_THEME" ? "Session Thème" : "Session Rapport"}
                  </TableCell>
                  <TableCell className="text-sm">{session.promotion || "—"}</TableCell>
                  <TableCell className="text-xs">
                    {session.date_ouverture ? new Date(session.date_ouverture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {session.date_fermeture ? new Date(session.date_fermeture).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "—"}
                  </TableCell>
                  <TableCell>
                    {session.statut === "OUVERTE" ? (
                      <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                        <span className="w-1 h-1 rounded-full bg-purple-500 mr-1"></span>
                        Ouverte
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-none text-xs">
                        <span className="w-1 h-1 rounded-full bg-red-500 mr-1"></span>
                        Fermée
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {session.soumissions_count || "0"} / {session.soumissions_total || "—"}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="text-xs">
                      {session.statut === "OUVERTE" ? "Fermer" : "Voir"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucune session disponible.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Affichage de 1 à {sessions?.length || 0} sur {sessions?.length || 0} sessions
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
          </div>
        </div>
      </Card>
    </div>
  );
}
