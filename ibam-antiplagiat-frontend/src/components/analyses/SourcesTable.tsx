import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import type { SourceAnalyse } from "@/types/analyse.types";

interface SourcesTableProps {
  sources: SourceAnalyse[];
}

export function SourcesTable({ sources }: SourcesTableProps) {
  if (!sources || sources.length === 0) {
    return <div className="p-8 text-center text-muted-foreground bg-white rounded-xl border border-border/50 shadow-sm">Aucune source similaire identifiée.</div>;
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground">Titre de la source</TableHead>
            <TableHead className="font-semibold text-foreground">Lien externe</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Similarité (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source, idx) => (
            <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-foreground">{source.titre}</TableCell>
              <TableCell>
                {source.url !== "Interne" ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-primary-light hover:underline transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Consulter
                  </a>
                ) : (
                  <span className="text-muted-foreground">Document Interne IBAM</span>
                )}
              </TableCell>
              <TableCell className="text-right font-bold">
                <span className={(source.contribution_pct) > 30 ? "text-red-600" : (source.contribution_pct) > 15 ? "text-orange-500" : "text-green-600"}>
                  {(source.contribution_pct).toFixed(1)}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
