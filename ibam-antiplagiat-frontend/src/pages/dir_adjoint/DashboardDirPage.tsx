import { Calendar, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardDirPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-bold text-primary-dark">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Bienvenue, Dr. Sawadogo Ali · Direction des études</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Sessions actives */}
        <Card className="border rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary-light"></div>
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
            <Calendar className="w-4 h-4 text-primary-light" />
          </div>
          <div className="text-2xl font-bold text-primary-dark mb-1">2</div>
          <div className="text-xs text-muted-foreground">Sessions actives</div>
          <div className="text-xs text-muted-foreground mt-1">1 thème · 1 rapport</div>
        </Card>

        {/* Rapports à valider */}
        <Card className="border rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-plagiat-orange"></div>
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4 text-plagiat-orange" />
          </div>
          <div className="text-2xl font-bold text-primary-dark mb-1">4</div>
          <div className="text-xs text-muted-foreground">Rapports à valider</div>
          <div className="text-xs text-muted-foreground mt-1">En attente décision chef</div>
        </Card>

        {/* Rapports validés */}
        <Card className="border rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-plagiat-vert"></div>
          <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-plagiat-vert" />
          </div>
          <div className="text-2xl font-bold text-primary-dark mb-1">18</div>
          <div className="text-xs text-muted-foreground">Rapports validés</div>
          <div className="text-xs text-muted-foreground mt-1">Ce mois</div>
        </Card>

        {/* Signatures en attente */}
        <Card className="border rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent"></div>
          <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-accent-dark" />
          </div>
          <div className="text-2xl font-bold text-primary-dark mb-1">2</div>
          <div className="text-xs text-muted-foreground">Signatures en attente</div>
          <div className="text-xs text-muted-foreground mt-1">Rapports validés chef</div>
        </Card>
      </div>

      {/* Sessions académiques */}
      <div>
        <h3 className="text-sm font-semibold text-primary-dark mb-3">Sessions académiques</h3>
        
        {/* Session Card 1 */}
        <Card className="border rounded-xl p-4 mb-3 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">Session Thème S3 2024-2025</div>
            <div className="text-xs text-muted-foreground">01 avr. 2025 — 15 mai 2025 · L3 Toutes filières</div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
            Ouverte
          </Badge>
          <Button variant="outline" size="sm">Gérer</Button>
        </Card>

        {/* Session Card 2 */}
        <Card className="border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-green-700" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">Session Rapport S3 2024-2025</div>
            <div className="text-xs text-muted-foreground">15 mai 2025 — 30 juin 2025 · L3 Toutes filières</div>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-none">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></span>
            Fermée
          </Badge>
          <Button variant="outline" size="sm" disabled className="opacity-50">Gérer</Button>
        </Card>
      </div>

      {/* Rapports en attente de validation finale */}
      <Card className="border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary-dark">Rapports en attente de validation finale</h3>
          <Button variant="link" size="sm" className="text-primary-light text-xs">
            Voir tout
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Étudiant</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Titre</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Décision Chef</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Taux</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date décision</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Zongo Achille</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">Gestion des risques financiers dans les PME</TableCell>
              <TableCell>
                <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                  <span className="w-1 h-1 rounded-full bg-purple-500 mr-1"></span>
                  Validé
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-[70px] h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-plagiat-orange" style={{ width: '23%' }}></div>
                  </div>
                  <span className="text-xs font-semibold font-mono text-plagiat-orange">23%</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">28 avr. 2025</TableCell>
              <TableCell>
                <Button size="sm" className="bg-primary hover:bg-primary-dark text-xs">
                  Examiner
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Dao Fatou</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">Analyse de la compétitivité agricole</TableCell>
              <TableCell>
                <Badge className="bg-red-100 text-red-700 border-none text-xs">
                  <span className="w-1 h-1 rounded-full bg-red-500 mr-1"></span>
                  Refusé
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-[70px] h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-plagiat-critique" style={{ width: '67%' }}></div>
                  </div>
                  <span className="text-xs font-semibold font-mono text-plagiat-critique">67%</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">27 avr. 2025</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="text-xs">Voir</Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Bambara Ousmane</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">Marketing digital et performance commerciale</TableCell>
              <TableCell>
                <Badge className="bg-purple-100 text-purple-700 border-none text-xs">
                  <span className="w-1 h-1 rounded-full bg-purple-500 mr-1"></span>
                  Validé
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-[70px] h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-plagiat-vert" style={{ width: '8%' }}></div>
                  </div>
                  <span className="text-xs font-semibold font-mono text-plagiat-vert">8%</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">26 avr. 2025</TableCell>
              <TableCell>
                <Button size="sm" className="bg-primary hover:bg-primary-dark text-xs">
                  Examiner
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Tapsoba Pauline</TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">Économie circulaire et développement durable</TableCell>
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">
                  <span className="w-1 h-1 rounded-full bg-yellow-500 mr-1"></span>
                  Corrections
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-[70px] h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-plagiat-rouge" style={{ width: '34%' }}></div>
                  </div>
                  <span className="text-xs font-semibold font-mono text-plagiat-rouge">34%</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">25 avr. 2025</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="text-xs">Voir</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
