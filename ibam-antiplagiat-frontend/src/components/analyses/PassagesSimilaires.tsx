import { useState } from "react";
import type { PassageSimilaire } from "@/types/analyse.types";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PassagesSimilairesProps {
  passages: PassageSimilaire[];
}

export function PassagesSimilaires({ passages }: PassagesSimilairesProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(passages.length / pageSize);
  
  const displayed = passages.slice(page * pageSize, (page + 1) * pageSize);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "destructive";
    if (score >= 0.6) return "warning";
    return "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary font-serif">Passages Similaires ({passages.length})</h3>
        <Button variant="outline" size="sm" className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">Exporter CSV</Button>
      </div>

      <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-2/5 font-semibold text-foreground">Passage de votre document</TableHead>
              <TableHead className="w-2/5 font-semibold text-foreground">Passage source</TableHead>
              <TableHead className="font-semibold text-foreground">Source</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayed.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Aucun passage similaire détecté.
                </TableCell>
              </TableRow>
            ) : (
              displayed.map((p, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="bg-red-50/30 border-r border-border/50">{p.phrase_soumise}</TableCell>
                  <TableCell className="bg-orange-50/20 border-r border-border/50">{p.phrase_reference}</TableCell>
                  <TableCell>
                    <a href={p.source_url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-light hover:underline line-clamp-2 transition-colors">
                      {p.source_titre}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getScoreColor(p.score)} className="shadow-sm">
                      {Math.round(p.score * 100)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Page {page + 1} sur {totalPages}</span>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
